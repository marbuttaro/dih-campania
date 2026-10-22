/** Exercise the real Auth, PostgREST and Storage policies before deployment.
 * node --env-file=.env.migration scripts/verify-hosted.mjs /private/backup
 * Creates uniquely named disposable fixtures and removes only those fixtures.
 * Never modifies migrated articles or changes an existing user's credentials.
 */
import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const env = process.env
const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL
const publicKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY
const reportDirectory = process.argv[2]
if (!url || !publicKey || !env.SUPABASE_SERVICE_ROLE_KEY || !env.CMS_EDITOR_EMAIL || !env.CMS_EDITOR_PASSWORD || !reportDirectory) {
  throw new Error('Missing project/editor environment or private report directory')
}
const client = key => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const service = client(env.SUPABASE_SERVICE_ROLE_KEY)
const anon = client(publicKey)
const editor = client(publicKey)
const outsider = client(publicKey)
const articleId = randomUUID()
const slug = `cms-verification-${articleId}`
const mediaPath = `verification/${articleId}.txt`
const blockedMediaPath = `verification/${articleId}-blocked.txt`
const checks = []
const cleanupErrors = []
let outsiderId
let failure
const ok = result => { if (result.error) throw result.error; return result.data }
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); console.log(`PASS ${name}`) }
const anonymousRows = () => anon.from('articles').select('id').eq('id', articleId)
const patch = async values => ok(await editor.from('articles').update(values).eq('id', articleId).select('id,slug,status,published_at,updated_at,deleted_at').single())
try {
  ok(await editor.auth.signInWithPassword({ email: env.CMS_EDITOR_EMAIL, password: env.CMS_EDITOR_PASSWORD }))
  check('Editor allowlist membership', ok(await editor.rpc('is_cms_editor')) === true)
  const outsiderEmail = `${slug}@example.invalid`
  const outsiderPassword = randomBytes(32).toString('base64url')
  const created = ok(await service.auth.admin.createUser({ email: outsiderEmail, password: outsiderPassword, email_confirm: true }))
  outsiderId = created.user.id
  ok(await outsider.auth.signInWithPassword({ email: outsiderEmail, password: outsiderPassword }))
  check('Ordinary authenticated user has no editorial role', ok(await outsider.rpc('is_cms_editor')) === false)
  check('Self-promotion is denied', !!(await outsider.from('cms_editors').insert({ user_id: outsiderId })).error)

  const payload = { id: articleId, slug, title: 'Verifica tecnica temporanea', content_html: '<p>Verifica di conservazione <strong>contenuto</strong>.</p>', status: 'draft', published_at: '2017-12-10T09:20:31Z' }
  check('Anonymous article creation is denied', !!(await anon.from('articles').insert(payload)).error)
  check('Non-editor article creation is denied', !!(await outsider.from('articles').insert(payload)).error)
  const initial = ok(await editor.from('articles').insert(payload).select('id,published_at,updated_at').single())
  check('Editor can create an exact-second backdated draft', new Date(initial.published_at).toISOString() === '2017-12-10T09:20:31.000Z')
  check('Draft hidden from anonymous users', ok(await anonymousRows()).length === 0)
  check('Draft hidden from authenticated non-editors', ok(await outsider.from('articles').select('id').eq('id', articleId)).length === 0)
  ok(await service.from('article_sources').insert({ article_id: articleId, source: { test: true } }))
  check('Source metadata cannot be read anonymously', !!(await anon.from('article_sources').select('*').eq('article_id', articleId)).error)
  check('Source metadata hidden from non-editors', ok(await outsider.from('article_sources').select('*').eq('article_id', articleId)).length === 0)

  const updated = await patch({ status: 'published' })
  check('Published article visible anonymously', ok(await anonymousRows()).length === 1)
  const stale = ok(await editor.from('articles').update({ title: 'Must not overwrite' }).eq('id', articleId).eq('updated_at', initial.updated_at).select('id'))
  check('Stale editor update cannot overwrite newer changes', stale.length === 0 && updated.updated_at !== initial.updated_at)
  const deniedUpdate = await outsider.from('articles').update({ title: 'Unauthorized' }).eq('id', articleId).select('id')
  check('Non-editor cannot modify public articles', !!deniedUpdate.error || deniedUpdate.data.length === 0)
  check('Editor cannot permanently delete articles', !!(await editor.from('articles').delete().eq('id', articleId)).error)
  await patch({ slug: `${slug}-renamed` })
  check('Old slug remains resolvable', ok(await anon.from('article_aliases').select('article_id').eq('slug', slug).single()).article_id === articleId)
  check('Revision preserves original HTML', ok(await editor.from('article_revisions').select('snapshot').eq('article_id', articleId)).some(row => row.snapshot.content_html === payload.content_html))
  check('Revisions are hidden from non-editors', ok(await outsider.from('article_revisions').select('id').eq('article_id', articleId)).length === 0)
  await patch({ status: 'private' })
  check('Private article hidden anonymously', ok(await anonymousRows()).length === 0)
  check('Private historical slug hidden anonymously', ok(await anon.from('article_aliases').select('article_id').eq('slug', slug)).length === 0)
  await patch({ status: 'published', published_at: '2099-01-01T10:20:31Z' })
  check('Scheduled article hidden before publication', ok(await anonymousRows()).length === 0)
  await patch({ published_at: payload.published_at, deleted_at: new Date().toISOString() })
  check('Trashed article hidden anonymously', ok(await anonymousRows()).length === 0)
  const restored = await patch({ deleted_at: null })
  check('Restoring preserves original exact publication time', ok(await anonymousRows()).length === 1 && new Date(restored.published_at).toISOString() === '2017-12-10T09:20:31.000Z')

  const bytes = Buffer.from('Campania DIH verification fixture\n')
  check('Anonymous media upload denied', !!(await anon.storage.from('article-media').upload(blockedMediaPath, bytes, { contentType: 'text/plain' })).error)
  check('Non-editor media upload denied', !!(await outsider.storage.from('article-media').upload(blockedMediaPath, bytes, { contentType: 'text/plain' })).error)
  ok(await editor.storage.from('article-media').upload(mediaPath, bytes, { contentType: 'text/plain', upsert: false }))
  const downloaded = ok(await anon.storage.from('article-media').download(mediaPath))
  check('Editor upload is publicly readable and byte-identical', Buffer.from(await downloaded.arrayBuffer()).equals(bytes))
  check('Existing files cannot be overwritten by editors', !!(await editor.storage.from('article-media').upload(mediaPath, Buffer.from('changed'), { contentType: 'text/plain', upsert: true })).error)
} catch (error) {
  failure = error instanceof Error ? error.message : JSON.stringify(error)
  console.error(`FAIL ${failure}`)
} finally {
  // All paths and identifiers below were generated in this run. Imported data is untouched.
  for (const [label, operation] of [
    ['media fixtures', () => service.storage.from('article-media').remove([mediaPath, blockedMediaPath])],
    ['fixture revisions', () => service.from('article_revisions').delete().eq('article_id', articleId)],
    ['fixture article', () => service.from('articles').delete().eq('id', articleId)],
    ...(outsiderId ? [['fixture user', () => service.auth.admin.deleteUser(outsiderId)]] : []),
  ]) {
    try { ok(await operation()) } catch (error) { cleanupErrors.push(`${label}: ${error.message || String(error)}`) }
  }
  const report = { checkedAt: new Date().toISOString(), project: new URL(url).hostname, passed: !failure && cleanupErrors.length === 0, checks, failure, cleanupErrors, fixtureId: articleId }
  await writeFile(resolve(reportDirectory, 'hosted-verification.json'), JSON.stringify(report, null, 2) + '\n')
  if (failure || cleanupErrors.length) process.exitCode = 1
  console.log(`Hosted verification: ${report.passed ? 'PASS' : 'FAIL'} (${checks.length} checks)`)
}
