import { useEffect, useState } from 'react'
import { Navbar } from '../components/sections/Navbar'
import { Footer } from '../components/sections/Footer'
import { articleTitle, articleUrl, formatDate, getArticle, listArticles, listCategories, PAGE_SIZE, type Article, type Category } from '../lib/articles'
import { requireSupabase } from '../lib/supabase'
import { safeHtml, plainText } from '../lib/content'

function Card({ article }: { article: Article }) {
  return <article className="panel flex flex-col h-full">
    <a href={articleUrl(article.slug)}>{article.featured_image && <img src={article.featured_image} alt={article.featured_image_alt} loading="lazy" className="w-full aspect-video object-cover rounded-xl mb-5" />}<h2 className="text-xl leading-snug hover:underline">{articleTitle(article)}</h2></a>
    <time dateTime={article.published_at} className="text-sm mt-3">{formatDate(article.published_at)}</time>
    <p className="text-sm leading-relaxed my-4 line-clamp-4">{plainText(article.excerpt || article.content_html).slice(0, 240)}</p>
    <a href={articleUrl(article.slug)} className="underline mt-auto font-semibold text-sm">Leggi l’articolo ↗</a>
  </article>
}

export default function PublicNews({ slug }: { slug?: string }) {
  const params = new URLSearchParams(window.location.search)
  const page = Math.max(1, Number.parseInt(params.get('pagina') || '1', 10) || 1)
  const search = params.get('q') || ''
  const category = params.get('categoria') || ''
  const year = params.get('anno') || ''
  const [categories, setCategories] = useState<Category[]>([])
  const [years, setYears] = useState<number[]>([])
  const [article, setArticle] = useState<Article | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const [cats, result, current, archive] = await Promise.all([
          listCategories(), listArticles(slug ? { limit: 4 } : { page, search, category, year }),
          slug ? getArticle(slug) : Promise.resolve(null), requireSupabase().rpc('article_years'),
        ])
        if (archive.error) throw archive.error
        if (!alive) return
        setCategories(cats); setArticles(result.articles); setCount(result.count); setArticle(current)
        setYears((archive.data as { year: number }[]).map(v => v.year))
        document.title = current ? `${articleTitle(current)} — Campania DIH` : slug ? 'Articolo non trovato — Campania DIH' : 'News e archivio — Campania DIH'
        const description = document.querySelector('meta[name="description"]')
        if (description && current) description.setAttribute('content', current.seo_description || plainText(current.excerpt || current.content_html).slice(0, 160))
      } catch { if (alive) setError('Non è stato possibile caricare l’archivio. Riprova tra poco.') }
      finally { if (alive) setLoading(false) }
    }
    void load(); return () => { alive = false }
  }, [slug, page, search, category, year])
  const pageUrl = (value: number) => { const p = new URLSearchParams(params); p.set('pagina', String(value)); return `/news?${p}` }
  return <><Navbar /><main className="cms flex-grow bg-brand-surface pt-36 sm:pt-40 pb-24"><div className="container-page">
    <a href={slug ? '/news' : '/'} className="text-sm underline">← {slug ? 'Tutte le news' : 'Home'}</a>
    {loading ? <p role="status" className="panel mt-8">Caricamento…</p> : error ? <div role="alert" className="panel mt-8"><p>{error}</p><button className="mt-4" onClick={() => window.location.reload()}>Riprova</button></div> : slug ? article ? <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-12 mt-8">
      <article>
        <header><div className="flex flex-wrap gap-2 mb-4">{article.category_slugs.map(s => <a key={s} href={`/news?categoria=${encodeURIComponent(s)}`} className="bg-[#e3eaec] px-3 py-1 rounded-full text-xs">{categories.find(c => c.slug === s)?.name || s}</a>)}</div><h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.2] font-light text-[#013167]">{articleTitle(article)}</h1><p className="mt-5 text-sm"><time dateTime={article.published_at}>{formatDate(article.published_at)}</time>{article.author_name && ` · ${article.author_name}`}</p></header>
        {(article.status !== 'published' || new Date(article.published_at) > new Date()) && <p className="success my-5">Anteprima riservata alla redazione — questo articolo non è ancora pubblico.</p>}
        {article.featured_image && <img src={article.featured_image} alt={article.featured_image_alt} className="w-full max-h-[560px] object-contain rounded-2xl my-9" />}
        {article.event_at && <p className="panel my-6">Evento: {formatDate(article.event_at, true)}{article.event_location && ` · ${article.event_location}`}</p>}
        <div className="article-content mt-8" dangerouslySetInnerHTML={{ __html: safeHtml(article.content_html) }} />
        {article.tags.length > 0 && <p className="text-sm mt-8">Tag: {article.tags.filter(Boolean).join(', ')}</p>}
      </article>
      <aside><div className="panel"><h2 className="text-2xl mb-6">Altre news</h2>{articles.filter(a => a.id !== article.id).slice(0, 3).map(a => <div key={a.id} className="border-t py-5"><a className="font-medium hover:underline" href={articleUrl(a.slug)}>{articleTitle(a)}</a><p className="text-xs mt-3">{formatDate(a.published_at)}</p></div>)}</div><div className="mt-8"><h2 className="mb-4">Archivio</h2>{years.map(y => <a className="block border-t py-4 text-xl" href={`/news?anno=${y}`} key={y}>{y} ↗</a>)}<a href="/news" className="button mt-5">Archivio completo</a></div></aside>
    </div> : <div className="panel my-10"><h1 className="text-3xl">Articolo non trovato</h1><p className="mt-4">L’indirizzo potrebbe essere cambiato oppure il contenuto non è pubblico.</p><a href="/news" className="button mt-6">Cerca nell’archivio</a></div> : <>
      <header className="my-9"><h1 className="text-4xl sm:text-5xl font-light">News e archivio</h1><p className="mt-4 text-lg">Notizie, bandi, eventi e opportunità per le imprese.</p></header>
      <form action="/news" className="panel grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-end mb-9"><label>Cerca<input type="search" name="q" defaultValue={search} placeholder="Parole chiave" /></label><label>Categoria<select name="categoria" defaultValue={category}><option value="">Tutte le categorie</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label><label>Anno<select name="anno" defaultValue={year}><option value="">Tutti gli anni</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></label><button>Cerca</button></form>
      <p className="text-sm mb-5">{count} articoli trovati</p><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{articles.map(a => <Card article={a} key={a.id} />)}</div>{!count && <p className="panel">Nessun articolo corrisponde ai filtri. <a href="/news" className="underline">Mostra tutto l’archivio</a>.</p>}
      <nav aria-label="Pagine archivio" className="flex justify-center items-center gap-5 mt-10">{page > 1 && <a className="button" href={pageUrl(page - 1)}>Precedente</a>}<span>Pagina {page} di {Math.max(1, Math.ceil(count / PAGE_SIZE))}</span>{page * PAGE_SIZE < count && <a className="button" href={pageUrl(page + 1)}>Successiva</a>}</nav>
    </>}
  </div></main><Footer /></>
}
