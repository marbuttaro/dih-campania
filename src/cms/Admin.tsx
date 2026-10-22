import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, requireSupabase } from '../lib/supabase'
import { listArticles, listCategories, setTrashed, formatDate, PAGE_SIZE, type Article, type Category } from '../lib/articles'
import { ArticleForm } from './ArticleForm'
import { confirmAction } from './dialogs'

const message = (e: unknown) => e instanceof Error ? e.message : 'Operazione non riuscita. Riprova.'
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError('')
    try { const { error } = await requireSupabase().auth.signInWithPassword({ email, password }); if (error) throw new Error('Accesso non riuscito. Controlla email e password.') } catch (err) { setError(message(err)) }
    finally { setBusy(false) }
  }
  return <main className="cms max-w-lg mx-auto px-5 py-20"><a href="/" className="underline">← Campania DIH</a><form className="panel mt-8 space-y-5" onSubmit={submit}><h1 className="text-3xl">Area redazione</h1><p>Accedi per gestire articoli e contenuti.</p>{error && <p role="alert" className="error">{error}</p>}<label>Email<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy || !supabase}>{busy ? 'Accesso…' : 'Accedi'}</button>{!supabase && <p role="alert">Il servizio editoriale non è ancora configurato.</p>}</form></main>
}

function Dashboard({ session }: { session: Session }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [trash, setTrash] = useState(false)
  const [editing, setEditing] = useState<Article | null | undefined>(undefined)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [version, setVersion] = useState(0)
  const [revisions, setRevisions] = useState<{ changed_at: string; snapshot: Article }[] | null>(null)
  useEffect(() => {
    let alive = true
    requireSupabase().from('cms_editors').select('user_id').eq('user_id', session.user.id).maybeSingle().then(({ data, error }) => { if (alive) { if (error) setError(error.message); setAllowed(!!data) } })
    listCategories().then(data => { if (alive) setCategories(data) }).catch(err => { if (alive) setError(message(err)) })
    return () => { alive = false }
  }, [session.user.id])
  useEffect(() => {
    if (!allowed) return
    let alive = true
    const load = async () => {
      setBusy(true); setError('')
      try { const result = await listArticles({ page, search: query, status, category, trash, admin: true }); if (alive) { setArticles(result.articles); setCount(result.count) } }
      catch (err) { if (alive) setError(message(err)) }
      finally { if (alive) setBusy(false) }
    }
    void load(); return () => { alive = false }
  }, [allowed, page, query, status, category, trash, version])
  const signOut = async () => { const { error } = await requireSupabase().auth.signOut(); if (error) setError(error.message) }
  return <div className="cms min-h-screen bg-[#f0f4f8]">
    <header className="bg-white border-b px-5 sm:px-10 py-5 flex flex-wrap items-center gap-5 justify-between"><a href="/" className="font-bold text-xl">Campania DIH <span className="font-normal text-sm">/ Redazione</span></a><div className="flex items-center gap-4"><span className="text-xs break-all">{session.user.email}</span><button className="secondary" onClick={signOut}>Esci</button></div></header>
    <main className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8">
      {allowed === null && <p role="status">Verifica accesso…</p>}
      {allowed === false && <p role="alert" className="error">Questo account non è abilitato alla redazione. Contatta l’amministratore.</p>}
      {allowed && editing !== undefined ? <ArticleForm key={editing?.id || 'new'} article={editing} categories={categories} onClose={() => setEditing(undefined)} onSaved={article => { setEditing(undefined); setVersion(v => v + 1); setNotice(`Articolo “${article.title}” salvato.`) }} /> : allowed && <>
        <div className="flex justify-between items-center gap-4 mb-6"><div><h1 className="text-3xl">Articoli</h1><p className="mt-2 text-sm">{count} risultati {trash && 'nel cestino'}</p></div><button onClick={() => { setNotice(''); setEditing(null) }}>+ Nuovo articolo</button></div>
        {notice && <p role="status" className="success mb-5">{notice}</p>}
        <form className="panel grid md:grid-cols-[2fr_1fr_1fr_auto] items-end gap-4 mb-6" onSubmit={e => { e.preventDefault(); setQuery(search); setPage(1) }}>
          <label>Cerca nel titolo e nel testo<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Parole chiave" /></label>
          <label>Stato<select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}><option value="">Tutti gli stati</option><option value="published">Pubblicati / programmati</option><option value="draft">Bozze</option><option value="private">Privati</option></select></label>
          <label>Categoria<select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}><option value="">Tutte le categorie</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label><button>Cerca</button>
        </form>
        <div className="flex gap-3 mb-5"><button className={trash ? 'secondary' : ''} onClick={() => { setTrash(false); setPage(1) }}>Attivi</button><button className={trash ? '' : 'secondary'} onClick={() => { setTrash(true); setPage(1) }}>Cestino</button></div>
        {error && <p role="alert" className="error mb-5">{error}</p>}
        {busy ? <p role="status">Caricamento articoli…</p> : <div className="space-y-3">{articles.map(article => <article key={article.id} className="panel flex flex-col md:flex-row gap-5 justify-between">
          <div className="min-w-0"><h2 className="text-lg">{article.title || '(Senza titolo)'}</h2><p className="text-sm mt-2">{article.status === 'draft' ? 'Bozza' : article.status === 'private' ? 'Privato' : new Date(article.published_at) > new Date() ? 'Programmato' : 'Pubblicato'} · {formatDate(article.published_at, true)}</p><p className="text-xs mt-2">{article.category_slugs.map(slug => categories.find(c => c.slug === slug)?.name || slug).join(' · ')}</p></div>
          <div className="flex flex-wrap gap-2 self-start shrink-0">
            {!trash && <button onClick={() => { setNotice(''); setEditing(article) }}>Modifica</button>}
            <button className="secondary" onClick={async () => { setError(''); const { data, error } = await requireSupabase().from('article_revisions').select('changed_at,snapshot').eq('article_id', article.id).order('changed_at', { ascending: false }).limit(20); if (error) setError(error.message); else setRevisions(data as { changed_at: string; snapshot: Article }[]) }}>Cronologia</button>
            <button className={trash ? 'secondary' : 'danger'} onClick={async () => { if (!trash && !await confirmAction(`Spostare “${article.title}” nel cestino? Potrai ripristinarlo.`)) return; setError(''); try { await setTrashed(article, !trash); setVersion(v => v + 1); setNotice(trash ? 'Articolo ripristinato.' : 'Articolo spostato nel cestino.'); if (articles.length === 1 && page > 1) setPage(p => p - 1) } catch (err) { setError(message(err)) } }}>{trash ? 'Ripristina' : 'Cestina'}</button>
          </div>
        </article>)}{articles.length === 0 && <p className="panel">Nessun articolo trovato.</p>}</div>}
        <nav aria-label="Pagine articoli" className="flex justify-center gap-4 items-center mt-8"><button disabled={page === 1 || busy} onClick={() => setPage(p => p - 1)}>Precedente</button><span>{page} / {Math.max(1, Math.ceil(count / PAGE_SIZE))}</span><button disabled={page * PAGE_SIZE >= count || busy} onClick={() => setPage(p => p + 1)}>Successiva</button></nav>
      </>}
      {revisions && <section role="dialog" aria-label="Cronologia articolo" aria-modal="true" className="fixed inset-0 bg-black/40 z-50 overflow-auto p-5 sm:p-12"><div className="panel max-w-3xl mx-auto"><div className="flex justify-between gap-4"><h2 className="text-xl">Ultime revisioni</h2><button onClick={() => setRevisions(null)}>Chiudi</button></div><p className="my-4 text-sm">Ogni modifica conserva la versione precedente. Le copie possono essere scaricate per recuperare i contenuti.</p>{revisions.length === 0 && <p>Nessuna modifica precedente.</p>}{revisions.map((r, i) => <div key={i} className="border-t py-4 flex flex-wrap justify-between gap-3"><span>{formatDate(r.changed_at, true)} — {r.snapshot.title}</span><button className="secondary" onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify(r.snapshot, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = `revisione-${r.snapshot.slug}-${i}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) }}>Scarica copia</button></div>)}</div></section>}
    </main>
  </div>
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(!supabase)
  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => { if (alive) { setSession(data.session); setReady(true) } })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => { if (alive) { setSession(session); setReady(true) } })
    return () => { alive = false; data.subscription.unsubscribe() }
  }, [])
  if (!ready) return <p className="cms p-12" role="status">Caricamento…</p>
  return session ? <Dashboard session={session} /> : <Login />
}
