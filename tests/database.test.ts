import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { readFileSync } from 'node:fs'

const db = new PGlite()
const editor = '00000000-0000-0000-0000-000000000001'
const outsider = '00000000-0000-0000-0000-000000000002'
async function asUser<T>(role: 'anon' | 'authenticated', user: string, action: () => Promise<T>) {
  await db.exec(`set role ${role}; set request.jwt.claim.sub = '${user}';`)
  try { return await action() } finally { await db.exec('reset role; reset request.jwt.claim.sub;') }
}
beforeAll(async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
    create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon,authenticated; grant select,insert on storage.objects to anon,authenticated;`)
  await db.exec(readFileSync(new URL('../supabase/migrations/202610220001_articles.sql', import.meta.url), 'utf8'))
  await db.exec(readFileSync(new URL('../supabase/migrations/202610220002_service_permissions.sql', import.meta.url), 'utf8'))
  await db.query('insert into auth.users values ($1),($2)', [editor, outsider])
  await db.query('insert into cms_editors(user_id) values($1)', [editor])
  await db.exec("insert into categories(slug,name) values ('news','News');")
  for (const [slug, status, date, deleted] of [
    ['public', 'published', '2020-01-01Z', null], ['draft', 'draft', '2020-01-01Z', null],
    ['private', 'private', '2020-01-01Z', null], ['future', 'published', '2099-01-01Z', null],
    ['trashed', 'published', '2020-01-01Z', '2021-01-01Z'],
  ]) await db.query('insert into articles(slug,title,status,published_at,deleted_at,category_slugs) values($1,$1,$2,$3,$4,ARRAY[\'news\'])', [slug, status, date, deleted])
}, 30000)
afterAll(() => db.close())

describe('Database access and editorial integrity', () => {
  it('trusted migration access works without automatic table grants', async () => {
    await db.exec('set role service_role')
    try {
      expect((await db.query('select slug from articles')).rows).toHaveLength(5)
      await db.query('insert into cms_editors(user_id) values($1)', [outsider])
      await db.query('delete from cms_editors where user_id=$1', [outsider])
    } finally { await db.exec('reset role') }
  })
  it('anonymous readers see only due, published, untrashed articles', async () => {
    const result = await asUser('anon', '', () => db.query('select slug from articles'))
    expect(result.rows).toEqual([{ slug: 'public' }])
  })
  it('signed-in non-editors gain no private read access', async () => {
    const result = await asUser('authenticated', outsider, () => db.query('select slug from articles'))
    expect(result.rows).toEqual([{ slug: 'public' }])
  })
  it('outsiders cannot promote themselves or create articles', async () => {
    await expect(asUser('authenticated', outsider, () => db.query('insert into cms_editors(user_id) values($1)', [outsider]))).rejects.toThrow()
    await expect(asUser('authenticated', outsider, () => db.exec("insert into articles(slug,title) values('attack','Attack')"))).rejects.toThrow()
    const result = await asUser('authenticated', outsider, () => db.query("update articles set title='Attack' where slug='public' returning id"))
    expect(result.rows).toHaveLength(0)
  })
  it('editors can read all states but cannot irreversibly delete articles', async () => {
    const result = await asUser('authenticated', editor, () => db.query('select slug from articles'))
    expect(result.rows).toHaveLength(5)
    await expect(asUser('authenticated', editor, () => db.exec("delete from articles where slug='draft'"))).rejects.toThrow()
  })
  it('edits preserve revisions and reject stale optimistic updates', async () => {
    const before = (await db.query<{ id: string; updated_at: string }>("select id,updated_at::text from articles where slug='public'")).rows[0]
    const updated = await asUser('authenticated', editor, () => db.query('update articles set title=$1 where id=$2 and updated_at=$3 returning id', ['Nuovo titolo', before.id, before.updated_at]))
    expect(updated.rows).toHaveLength(1)
    const stale = await asUser('authenticated', editor, () => db.query('update articles set title=$1 where id=$2 and updated_at=$3 returning id', ['Stale', before.id, before.updated_at]))
    expect(stale.rows).toHaveLength(0)
    const revision = await db.query<{ title: string; changed_by: string }>("select snapshot->>'title' as title,changed_by from article_revisions where article_id=$1", [before.id])
    expect(revision.rows).toEqual([{ title: 'public', changed_by: editor }])
  })
  it('supports exact historical timestamps and trash / restore', async () => {
    await asUser('authenticated', editor, () => db.exec("update articles set published_at='2017-10-20T14:23:51+02:00', deleted_at=now() where slug='public'"))
    expect((await asUser('anon', '', () => db.query('select slug from articles'))).rows).toHaveLength(0)
    await asUser('authenticated', editor, () => db.exec("update articles set deleted_at=null where slug='public'"))
    const result = await asUser('anon', '', () => db.query<{ epoch: string }>("select extract(epoch from published_at)::text as epoch from articles"))
    expect(Number(result.rows[0].epoch) * 1000).toBe(Date.parse('2017-10-20T14:23:51+02:00'))
  })
  it('rejects invalid categories and duplicate slugs', async () => {
    await expect(asUser('authenticated', editor, () => db.exec("insert into articles(slug,title,category_slugs) values('bad','Bad',ARRAY['missing'])"))).rejects.toThrow('Categoria non esistente')
    await expect(asUser('authenticated', editor, () => db.exec("insert into articles(slug,title) values('public','Duplicate')"))).rejects.toThrow()
  })
  it('restricts media uploads to editors and the designated bucket', async () => {
    await expect(asUser('anon', '', () => db.exec("insert into storage.objects(bucket_id,name) values('article-media','bad.jpg')"))).rejects.toThrow()
    await expect(asUser('authenticated', outsider, () => db.exec("insert into storage.objects(bucket_id,name) values('article-media','bad.jpg')"))).rejects.toThrow()
    await asUser('authenticated', editor, () => db.exec("insert into storage.objects(bucket_id,name) values('article-media','good.jpg')"))
    await expect(asUser('authenticated', editor, () => db.exec("insert into storage.objects(bucket_id,name) values('other','bad.jpg')"))).rejects.toThrow()
  })
  it('keeps old article addresses and hides aliases when the article becomes private', async () => {
    await asUser('authenticated', editor, () => db.exec("insert into articles(slug,title,status,published_at) values('old-address','Article','published','2020-01-01Z')"))
    await asUser('authenticated', editor, () => db.exec("update articles set slug='new-address' where slug='old-address'"))
    expect((await asUser('anon', '', () => db.query("select slug from article_aliases where slug='old-address'"))).rows).toHaveLength(1)
    await expect(asUser('authenticated', editor, () => db.exec("insert into articles(slug,title) values('old-address','Unrelated article')"))).rejects.toThrow('storico')
    await asUser('authenticated', editor, () => db.exec("update articles set status='private' where slug='new-address'"))
    expect((await asUser('anon', '', () => db.query("select slug from article_aliases where slug='old-address'"))).rows).toHaveLength(0)
  })
})
