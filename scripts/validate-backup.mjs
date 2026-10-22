import { PGlite } from '@electric-sql/pglite'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
const directory = process.argv[2]
if (!directory) throw new Error('Specify backup directory')
const read = name => JSON.parse(readFileSync(join(directory, name), 'utf8'))
const db = new PGlite()
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql as $$select null::uuid$$; create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); create table storage.objects(bucket_id text);`)
await db.exec(readFileSync(new URL('../supabase/migrations/202610220001_articles.sql', import.meta.url), 'utf8'))
const categories = read('import-categories.json')
for (const c of categories) await db.query('insert into categories(slug,name,wp_id) values($1,$2,$3)', [c.slug,c.name,c.wp_id])
for (const c of categories) if(c.parent_slug) await db.query('update categories set parent_slug=$1 where slug=$2',[c.parent_slug,c.slug])
const articles = [...read('articles.json'), ...read('current-news.json')]
for (const article of articles) {
  const keys = Object.keys(article)
  try { await db.query(`insert into articles(${keys.join(',')}) values(${keys.map((_,i)=>`$${i+1}`).join(',')})`, keys.map(k=>article[k])) }
  catch (error) { console.error(JSON.stringify({wp_id:article.wp_id,slug:article.slug,error:error.message,code:error.code,detail:error.detail})); process.exit(1) }
}
const rows = (await db.query('select * from articles')).rows
assert.equal(rows.length, articles.length)
const bySlug = new Map(rows.map(r=>[r.slug,r]))
for(const article of articles) {
  const remote = bySlug.get(article.slug)
  for(const key of Object.keys(article)) {
    if(['published_at','created_at','updated_at','event_at','deleted_at'].includes(key)) assert.equal(article[key] ? Date.parse(article[key]) : null, remote[key] ? Date.parse(remote[key]) : null)
    else assert.deepEqual(remote[key],article[key],`${article.slug}: ${key}`)
  }
}
const report = {verified_articles:rows.length,states:(await db.query('select status,count(*)::int as count from articles group by status order by status')).rows,verified_fields:'Every imported field including HTML, categories, tags, exact timestamps and original URLs',database:'PostgreSQL via PGlite',checked_at:new Date().toISOString()}
writeFileSync(join(directory,'local-import-verification.json'),JSON.stringify(report,null,2))
console.log(JSON.stringify(report,null,2))
await db.close()
