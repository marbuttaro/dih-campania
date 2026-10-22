import { requireSupabase } from './supabase'

export type ArticleStatus = 'draft' | 'published' | 'private'
export interface Article {
  id: string
  wp_id: number | null
  slug: string
  title: string
  excerpt: string
  content_html: string
  featured_image: string
  featured_image_alt: string
  author_name: string
  category_slugs: string[]
  tags: string[]
  status: ArticleStatus
  published_at: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  original_url: string | null
  is_featured: boolean
  event_at: string | null
  event_location: string
  seo_description: string
}
export type ArticleInput = Omit<Article, 'id' | 'created_at' | 'updated_at'>
export interface Category { slug: string; name: string; wp_id: number | null; parent_slug: string | null }
export const PAGE_SIZE = 12
const ARTICLE_COLUMNS = 'id,wp_id,slug,title,excerpt,content_html,featured_image,featured_image_alt,author_name,category_slugs,tags,status,published_at,created_at,updated_at,deleted_at,original_url,is_featured,event_at,event_location,seo_description'
export const articleUrl = (slug: string) => `/news/${encodeURIComponent(slug)}`
export const articleTitle = (article: Pick<Article, 'title' | 'published_at'>) => article.title || `Aggiornamento del ${formatDate(article.published_at)}`
export const formatDate = (date: string, time = false) => new Intl.DateTimeFormat('it-IT', {
  timeZone: 'Europe/Rome', dateStyle: 'long', ...(time ? { timeStyle: 'short' as const } : {}),
}).format(new Date(date))

export function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await requireSupabase().from('categories').select('*').order('name')
  if (error) throw error
  return data
}

export async function listArticles({ page = 1, search = '', category = '', year = '', admin = false, status = '', trash = false, limit = PAGE_SIZE } = {}) {
  let query = requireSupabase().from('articles').select(ARTICLE_COLUMNS, { count: 'exact' })
  query = trash ? query.not('deleted_at', 'is', null) : query.is('deleted_at', null)
  if (!admin) query = query.eq('status', 'published').lte('published_at', new Date().toISOString())
  if (search.trim()) query = query.textSearch('search_document', search.trim(), { type: 'websearch', config: 'italian' })
  if (category) query = query.contains('category_slugs', [category])
  if (year && /^\d{4}$/.test(year)) query = query.gte('published_at', `${year}-01-01T00:00:00+01:00`).lt('published_at', `${Number(year) + 1}-01-01T00:00:00+01:00`)
  if (status) query = query.eq('status', status)
  const { data, error, count } = await query.order('published_at', { ascending: false }).order('id').range((page - 1) * limit, page * limit - 1)
  if (error) throw error
  return { articles: data as Article[], count: count ?? 0 }
}

export async function getArticle(slug: string): Promise<Article | null> {
  const candidates = [...new Set([slug, encodeURIComponent(slug).replace(/%[A-F0-9]{2}/g, v => v.toLowerCase())])]
  for (const candidate of candidates) {
    const { data, error } = await requireSupabase().from('articles').select(ARTICLE_COLUMNS).eq('slug', candidate).is('deleted_at', null).maybeSingle()
    if (error) throw error
    if (data) return data
  }
  for (const candidate of candidates) {
    const alias = await requireSupabase().from('article_aliases').select('article_id').eq('slug', candidate).maybeSingle()
    if (alias.error) throw alias.error
    if (alias.data) {
      const result = await requireSupabase().from('articles').select(ARTICLE_COLUMNS).eq('id', alias.data.article_id).is('deleted_at', null).maybeSingle()
      if (result.error) throw result.error
      if (result.data) return result.data
    }
  }
  return null
}

export async function saveArticle(input: ArticleInput, id?: string, expectedUpdatedAt?: string) {
  const db = requireSupabase()
  const query = id
    ? db.from('articles').update(input).eq('id', id).eq('updated_at', expectedUpdatedAt!)
    : db.from('articles').insert(input)
  const { data, error } = await query.select(ARTICLE_COLUMNS).maybeSingle()
  if (error) throw new Error(error.code === '23505' ? 'Questo indirizzo articolo è già utilizzato. Scegli uno slug diverso.' : error.message)
  if (!data) throw new Error('L’articolo è stato modificato da un’altra sessione. Riaprilo prima di salvare per non perdere le modifiche.')
  return data as Article
}

export async function setTrashed(article: Article, trash: boolean) {
  const { data, error } = await requireSupabase().from('articles')
    .update({ deleted_at: trash ? new Date().toISOString() : null })
    .eq('id', article.id).eq('updated_at', article.updated_at).select('id').maybeSingle()
  if (error) throw error
  if (!data) throw new Error('L’articolo è stato modificato. Aggiorna la lista e riprova.')
}

export async function uploadMedia(file: File) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf', 'video/mp4', 'audio/mpeg', 'application/msword', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  if (!allowed.includes(file.type)) throw new Error('Formato non supportato. Usa immagini, PDF, documenti Word/PowerPoint, MP4 o MP3.')
  if (file.size > 50 * 1024 * 1024) throw new Error('Il file supera 50 MB.')
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const db = requireSupabase()
  const { error } = await db.storage.from('article-media').upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  return db.storage.from('article-media').getPublicUrl(path).data.publicUrl
}
