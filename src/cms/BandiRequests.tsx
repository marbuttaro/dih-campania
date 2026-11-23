import { useState } from 'react'
import { requireSupabase } from '../lib/supabase'

type Request = { id: string; bando_id: string; titolo: string; nome: string; email: string; messaggio: string; sent_at: string | null; created_at: string }

export function BandiRequests() {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<Request[]>([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function load(n: number) {
    setBusy(true); setError('')
    try {
      const { data, error, count } = await requireSupabase().from('bando_consulenze')
        .select('id,bando_id,titolo,nome,email,messaggio,sent_at,created_at',{count:'exact'})
        .order('created_at',{ascending:false}).order('id').range(n*20,n*20+19)
      if (error) throw error
      setRows(data); setCount(count ?? 0); setPage(n)
    } catch { setError('Caricamento delle richieste non riuscito.') }
    finally { setBusy(false) }
  }
  async function retry(id: string) {
    setBusy(true); setError('')
    try {
      const { data } = await requireSupabase().auth.getSession()
      if (!data.session) throw new Error('Accedi di nuovo alla redazione.')
      const response = await fetch('/api/consulenza-bando', { method:'POST', headers:{'Content-Type':'application/json',Authorization:'Bearer '+data.session.access_token}, body:JSON.stringify({action:'retry',requestId:id}) })
      if (!response.ok) throw new Error((await response.json()).error)
      await load(page)
    } catch (e) { setError(e instanceof Error ? e.message : 'Invio non riuscito.') }
    finally { setBusy(false) }
  }
  return <section className="panel"><button className="secondary" aria-expanded={open} onClick={() => { setOpen(!open); if (!open) void load(0) }}>Richieste di consulenza</button>
    {open && <div className="mt-4 space-y-4" aria-busy={busy}>{error && <p role="alert" className="error">{error}</p>}
      {busy && <p role="status">Caricamento…</p>}
      {!busy && !rows.length && <p>Nessuna richiesta di consulenza.</p>}
      {rows.map(r => <article key={r.id} className="border-t pt-3 break-words"><h2 className="font-semibold">{r.titolo}</h2>
        <p className="text-xs">ID bando {r.bando_id} · {new Date(r.created_at).toLocaleString('it-IT',{timeZone:'Europe/Rome'})}</p>
        <p className="mt-2">{r.nome} · <a className="underline" href={'mailto:'+r.email}>{r.email}</a></p><p className="whitespace-pre-line">{r.messaggio}</p>
        <p className="text-sm mt-2">{r.sent_at ? 'Email inviata al servizio di posta' : 'Notifica email in attesa'}</p>
        {!r.sent_at && <button className="secondary mt-2" disabled={busy} onClick={() => retry(r.id)}>Invia notifica email</button>}</article>)}
      <div className="flex flex-wrap items-center gap-2"><button disabled={busy || !page} onClick={() => load(page-1)}>Precedente</button><span>{page+1} / {Math.max(1,Math.ceil(count/20))}</span>
        <button disabled={busy || (page+1)*20 >= count} onClick={() => load(page+1)}>Successiva</button><button className="secondary" disabled={busy} onClick={() => load(page)}>Aggiorna richieste</button></div>
    </div>}
  </section>
}
