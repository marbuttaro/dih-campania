/** Server-only, resumable import. Never runs in the browser or uses a VITE_ secret.
 * node --env-file=.env.migration scripts/import-wordpress.mjs /private/backup
 * Add --apply only after reviewing the dry-run report and applying the SQL migration.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, basename } from 'node:path'
import { isDeepStrictEqual } from 'node:util'

const directory = process.argv[2]
if (!directory) throw new Error('Specify the private migration backup directory')
const read = name => JSON.parse(readFileSync(join(directory, name), 'utf8'))
const original = read('articles.json')
const current = read('current-news.json')
const categories = read('import-categories.json')
const sources = read('article-sources.json')
const assets = read('media-audit.json')
const goodAssets = [...new Map(assets.filter(a => a.sha256 && !a.error).map(a => [a.path, a])).values()]
const storagePath = asset => `wordpress/${asset.sha256.slice(0, 24)}-${basename(asset.path).normalize('NFD').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)}`
const bytes = goodAssets.reduce((total, asset) => total + asset.bytes, 0)
if (assets.length !== read('media-urls.json').length) throw new Error('Media audit is incomplete')
if (bytes > 900 * 1024 * 1024) throw new Error('Media exceeds the migration storage budget; review before uploading')
if (new Set([...original, ...current].map(a => a.slug)).size !== original.length + current.length) throw new Error('Duplicate article slugs')
const summary = { wordpress_articles: original.length, existing_new_articles: current.length, categories: categories.length, media_files: goodAssets.length, media_bytes: bytes, unavailable_source_assets: assets.filter(a => !a.sha256 || a.error).length }
console.log(JSON.stringify(summary, null, 2))
if (!process.argv.includes('--apply')) { console.log('Dry run complete. No remote changes.'); process.exit(0) }

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const check = result => { if (result.error) throw result.error; return result.data }
const uploadReportFile = join(directory, 'uploaded-media.json')
let uploaded
try { uploaded = JSON.parse(readFileSync(uploadReportFile, 'utf8')) } catch { uploaded = {} }
for (const [index, asset] of goodAssets.entries()) {
  const objectPath = storagePath(asset)
  const data = readFileSync(join(directory, 'media', asset.path))
  if (createHash('sha256').update(data).digest('hex') !== asset.sha256) throw new Error(`Local file checksum mismatch: ${asset.path}`)
  if (uploaded[objectPath]?.sha256 !== asset.sha256 || uploaded[objectPath]?.project !== url) {
    const contentType = asset.path.endsWith('.avif') && data.subarray(4, 32).includes(Buffer.from('avif')) ? 'image/avif' : asset.content_type
    const result = await db.storage.from('article-media').upload(objectPath, data, { contentType, upsert: false, cacheControl: '31536000' })
    if (result.error && !['409', 'Duplicate'].includes(String(result.error.statusCode || result.error.error))) {
      // Some SDK versions expose duplicate as a message only; never overwrite an existing object.
      if (!/already exists|duplicate/i.test(result.error.message)) throw result.error
    }
    const remote = check(await db.storage.from('article-media').download(objectPath))
    const checksum = createHash('sha256').update(Buffer.from(await remote.arrayBuffer())).digest('hex')
    if (checksum !== asset.sha256) throw new Error(`Remote file checksum mismatch: ${asset.path}`)
    uploaded[objectPath] = { sha256: checksum, bytes: asset.bytes, project: url, public_url: db.storage.from('article-media').getPublicUrl(objectPath).data.publicUrl }
    writeFileSync(uploadReportFile, JSON.stringify(uploaded, null, 2))
  }
  if ((index + 1) % 50 === 0) console.log(`Uploaded and checksum-verified ${index + 1}/${goodAssets.length} files`)
}
const replacements = assets.filter(a => a.sha256 && !a.error).map(a => [a.source_url, uploaded[storagePath(a)].public_url]).sort((a,b) => b[0].length - a[0].length)
const rewrite = html => { for (const [source, target] of replacements) html = html.split(source).join(target); return html }
const articles = [...original.map(a => ({ ...a, content_html: rewrite(a.content_html), excerpt: rewrite(a.excerpt), featured_image: rewrite(a.featured_image) })), ...current]
// Normalize internal dated links without changing external domains or public HTML structure.
for (const article of articles) article.content_html = article.content_html.replace(/https?:\/\/(?:www\.)?campaniadih\.it\/\d{4}\/\d{2}\/\d{2}\/([^\s"'<>/?#]+)\/?/g, '/news/$1')
// Parent categories must exist before children.
for (const category of categories) check(await db.from('categories').upsert({ ...category, parent_slug: null }, { onConflict: 'slug' }))
for (const category of categories.filter(c => c.parent_slug)) check(await db.from('categories').update({ parent_slug: category.parent_slug }).eq('slug', category.slug))
async function allRows(table, columns = '*') {
  const rows = []
  for (let offset = 0; ; offset += 500) {
    const data = check(await db.from(table).select(columns).order(table === 'articles' ? 'id' : 'article_id').range(offset, offset + 499))
    rows.push(...data); if (data.length < 500) break
  }
  return rows
}
const existing = new Map((await allRows('articles')).map(a => [a.slug, a]))
const comparable = ['wp_id','slug','title','excerpt','content_html','featured_image','featured_image_alt','author_name','category_slugs','tags','status','deleted_at','original_url','is_featured','event_location','seo_description']
function differences(expected, actual) {
  return [...comparable.filter(k => !isDeepStrictEqual(expected[k], actual[k])), ...['id'].filter(k => expected[k] !== undefined && expected[k] !== actual[k]), ...['published_at','event_at','created_at','updated_at'].filter(k => expected[k] !== undefined && (expected[k] ? Date.parse(expected[k]) : null) !== (actual[k] ? Date.parse(actual[k]) : null))]
}
for (const article of articles) {
  const found = existing.get(article.slug)
  if (found && differences(article, found).length) throw new Error(`Existing article differs; refusing to overwrite editorial work: ${article.slug}`)
}
const pending = articles.filter(a => !existing.has(a.slug))
// WordPress rows have source IDs/timestamps; new-site rows use database defaults.
// PostgREST must apply defaults to absent fields in mixed bulk inserts.
for (let i = 0; i < pending.length; i += 50) check(await db.from('articles').insert(pending.slice(i, i + 50), { defaultToNull: false }))
const existingSources = new Set((await allRows('article_sources', 'article_id')).map(s => s.article_id))
const pendingSources = sources.filter(s => !existingSources.has(s.article_id))
for (let i = 0; i < pendingSources.length; i += 25) check(await db.from('article_sources').insert(pendingSources.slice(i, i + 25)))
for (const source of sources) {
  for (const meta of source.source.all_metadata || []) {
    if (meta.key !== '_wp_old_slug' || !meta.value || articles.some(a => a.slug === meta.value)) continue
    check(await db.from('article_aliases').upsert({ slug: meta.value, article_id: source.article_id }, { onConflict: 'slug', ignoreDuplicates: true }))
  }
}
const remote = new Map((await allRows('articles')).map(a => [a.slug, a]))
const mismatches = articles.flatMap(a => { const row = remote.get(a.slug); const fields = row ? differences(a, row) : ['missing']; return fields.length ? [{ slug: a.slug, fields }] : [] })
const remoteSources = new Map((await allRows('article_sources')).map(s => [s.article_id, s.source]))
const sourceMismatches = sources.filter(s => !isDeepStrictEqual(s.source, remoteSources.get(s.article_id))).map(s => s.article_id)
const report = { ...summary, verified_articles: articles.length - mismatches.length, mismatches, verified_source_records: sources.length - sourceMismatches.length, source_mismatches: sourceMismatches, verified_at: new Date().toISOString(), source_backup: 'wordpress.xml', checksummed_uploaded_files: Object.keys(uploaded).length }
writeFileSync(join(directory, 'import-verification.json'), JSON.stringify(report, null, 2))
if (mismatches.length || sourceMismatches.length) throw new Error('Article verification failed; see private import-verification.json')
console.log(JSON.stringify(report, null, 2))
