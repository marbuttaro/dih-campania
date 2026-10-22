import { useEffect, useState, type FormEvent } from 'react'
import { type Article, type ArticleInput, type Category, saveArticle, slugify, uploadMedia, articleUrl } from '../lib/articles'
import { resolveDateTime, toLocalDateTime } from '../lib/dates'
import { ContentEditor } from './ContentEditor'
import { confirmAction } from './dialogs'

const blank = (): ArticleInput => ({ wp_id: null, slug: '', title: '', excerpt: '', content_html: '', featured_image: '', featured_image_alt: '', author_name: 'Campania DIH', category_slugs: [], tags: [], status: 'draft', published_at: new Date().toISOString(), deleted_at: null, original_url: null, is_featured: false, event_at: null, event_location: '', seo_description: '' })
export function ArticleForm({ article, categories, onClose, onSaved }: { article: Article | null; categories: Category[]; onClose: () => void; onSaved: (article: Article) => void }) {
  const [form, setForm] = useState<ArticleInput>(article ? (() => { const { id: _id, created_at: _created, updated_at: _updated, ...rest } = article; void _id; void _created; void _updated; return rest })() : blank)
  const [zone, setZone] = useState('Europe/Rome')
  const [date, setDate] = useState(toLocalDateTime(form.published_at))
  const [eventDate, setEventDate] = useState(form.event_at ? toLocalDateTime(form.event_at) : '')
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => { if (dirty || busy) e.preventDefault() }
    window.addEventListener('beforeunload', before)
    return () => window.removeEventListener('beforeunload', before)
  }, [dirty, busy])
  const change = <K extends keyof ArticleInput>(key: K, value: ArticleInput[K]) => { setForm(f => ({ ...f, [key]: value })); setDirty(true) }
  async function save(e: FormEvent) {
    e.preventDefault(); if (busy) return; setBusy(true); setError('')
    try {
      const result = await saveArticle({ ...form, title: form.title.trim(), slug: form.slug.trim(), tags: form.tags.map(t => t.trim()).filter(Boolean), published_at: resolveDateTime(date, form.published_at, zone), event_at: eventDate ? resolveDateTime(eventDate, form.event_at, zone) : null }, article?.id, article?.updated_at)
      setDirty(false); onSaved(result)
    } catch (err) { setError(err instanceof Error ? err.message : 'Salvataggio non riuscito') }
    finally { setBusy(false) }
  }
  return <form onSubmit={save} className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-2xl">{article ? 'Modifica articolo' : 'Nuovo articolo'}</h1><div className="flex gap-2"><button type="button" className="secondary" disabled={busy} onClick={async () => { if (!dirty || await confirmAction('Uscire senza salvare le modifiche?')) onClose() }}>Chiudi</button><button disabled={busy}>{busy ? 'Operazione in corso…' : 'Salva articolo'}</button></div></div>
    {error && <p role="alert" className="error">{error}</p>}
    <fieldset disabled={busy} className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start min-w-0">
      <div className="panel space-y-6">
        <label>Titolo<input required maxLength={1000} value={form.title} onChange={e => { change('title', e.target.value); if (!article && (!form.slug || form.slug === slugify(form.title))) change('slug', slugify(e.target.value)) }} /></label>
        <label>Indirizzo (slug)<input required maxLength={220} pattern="[^/?#\s]+" value={form.slug} onChange={e => change('slug', e.target.value)} /></label>
        {article && <a href={articleUrl(article.slug)} target="_blank" rel="noreferrer" className="underline text-sm">Apri anteprima salvata ↗</a>}
        <label>Sommario<textarea rows={3} value={form.excerpt} onChange={e => change('excerpt', e.target.value)} /></label>
        <ContentEditor value={form.content_html} onChange={value => change('content_html', value)} imported={!!article} disabled={busy} onBusyChange={setBusy} />
      </div>
      <aside className="space-y-6">
        <section className="panel space-y-4"><h2>Pubblicazione</h2>
          <label>Stato<select value={form.status} onChange={e => change('status', e.target.value as ArticleInput['status'])}><option value="draft">Bozza</option><option value="published">Pubblicato / programmato</option><option value="private">Privato (solo redazione)</option></select></label>
          <label>Fuso orario<select value={zone} onChange={e => { try { const instant = resolveDateTime(date, form.published_at, zone); const event = eventDate ? resolveDateTime(eventDate, form.event_at, zone) : null; setDate(toLocalDateTime(instant, e.target.value)); setEventDate(event ? toLocalDateTime(event, e.target.value) : ''); setZone(e.target.value); setError('') } catch { setZone(e.target.value); setDirty(true); setError('Fuso cambiato. Reinserisci la data e l’ora esatte nel nuovo fuso prima di salvare.') } }}><option value="Europe/Rome">Italia — Europe/Rome</option><option value="UTC">UTC</option></select></label>
          <label>Data e ora esatte<input type="datetime-local" step="1" required value={date} onChange={e => { setDate(e.target.value); setDirty(true) }} /></label>
          <p className="text-xs leading-relaxed">Puoi retrodatare un articolo. Con stato pubblicato e data futura, diventa visibile automaticamente all’ora indicata.</p>
          <label>Autore<input value={form.author_name} onChange={e => change('author_name', e.target.value)} /></label>
          <label><input type="checkbox" checked={form.is_featured} onChange={e => change('is_featured', e.target.checked)} />In evidenza</label>
        </section>
        <section className="panel space-y-4"><h2>Immagine di copertina</h2>
          {form.featured_image && <img src={form.featured_image} alt={form.featured_image_alt} className="rounded-lg" />}
          <label>URL immagine<input type="url" value={form.featured_image} onChange={e => change('featured_image', e.target.value)} /></label>
          <label>Carica immagine<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={busy} onChange={async e => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); setError(''); try { change('featured_image', await uploadMedia(file)) } catch (err) { setError((err as Error).message) } finally { setBusy(false); e.target.value = '' } }} /></label>
          <label>Testo alternativo<input value={form.featured_image_alt} onChange={e => change('featured_image_alt', e.target.value)} /></label>
        </section>
        <section className="panel space-y-3"><h2>Categorie e tag</h2>{categories.map(c => <label key={c.slug}><input type="checkbox" checked={form.category_slugs.includes(c.slug)} onChange={e => change('category_slugs', e.target.checked ? [...form.category_slugs, c.slug] : form.category_slugs.filter(s => s !== c.slug))} />{c.name}</label>)}
          <label>Tag (separati da virgole)<input value={form.tags.join(', ')} onChange={e => change('tags', e.target.value.split(',').map(t => t.trim()))} /></label>
        </section>
        <section className="panel space-y-4"><h2>Evento (facoltativo)</h2><label>Data e ora evento<input type="datetime-local" step="1" value={eventDate} onChange={e => { setEventDate(e.target.value); setDirty(true) }} /></label><label>Luogo<input value={form.event_location} onChange={e => change('event_location', e.target.value)} /></label></section>
        <section className="panel"><label>Descrizione per i motori di ricerca<textarea rows={4} maxLength={320} value={form.seo_description} onChange={e => change('seo_description', e.target.value)} /></label></section>
      </aside>
    </fieldset>
  </form>
}
