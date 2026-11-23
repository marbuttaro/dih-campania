import { useEffect, useState } from 'react'
import { listBandi, moveBando, type BandoRecord } from '../lib/bandi'
import { BandoForm } from './BandoForm'
import { confirmAction } from './dialogs'
import { BandiRequests } from './BandiRequests'

export function BandiAdmin() {
  const [rows, setRows] = useState<BandoRecord[]>([])
  const [revision, setRevision] = useState(0)
  const [editing, setEditing] = useState<BandoRecord | 'new' | null>(null)
  const [query, setQuery] = useState('')
  const [trash, setTrash] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let current = true
    listBandi(true).then(data => { if (current) setRows(data) }).catch(err => { if (current) setError(err.message) })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [revision])
  function refresh() { setLoading(true); setError(''); setRevision(v => v + 1) }
  async function change(row: BandoRecord, action: 'trash' | 'restore' | 'delete') {
    const question = action === 'delete' ? 'Eliminare definitivamente' : action === 'trash' ? 'Spostare nel cestino' : 'Ripristinare'
    if (!await confirmAction(`${question} “${row.scheda.titolo}”?`)) return
    setSaving(true); setError(''); setNotice('')
    try { await moveBando(row, action); setNotice('Catalogo aggiornato.'); refresh() }
    catch (err) { setError(err instanceof Error ? err.message : 'Operazione non riuscita.') }
    finally { setSaving(false) }
  }
  if (editing) return <BandoForm key={editing === 'new' ? 'new' : editing.id}
    record={editing === 'new' ? undefined : editing} records={rows} onClose={() => setEditing(null)}
    onSaved={() => { setEditing(null); setNotice('Bando salvato.'); refresh() }} />
  const needle = query.trim().toLocaleLowerCase('it')
  const matches = rows.filter(r => Boolean(r.deleted_at) === trash && [r.id, r.scheda.titolo, r.scheda.ente].some(s => s.toLocaleLowerCase('it').includes(needle)))
    .sort((a,b) => b.updated_at.localeCompare(a.updated_at) || a.scheda.titolo.localeCompare(b.scheda.titolo,'it'))
  const pages = Math.max(1, Math.ceil(matches.length / 20)), currentPage = Math.min(page,pages)
  return <section className="space-y-5">
    <div className="flex flex-wrap justify-between items-center gap-3"><h1 className="text-3xl">Bandi</h1><button onClick={() => setEditing('new')}>+ Nuovo bando</button></div>
    <BandiRequests />
    <label>Cerca per titolo, ente o ID<input type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} /></label>
    <div className="flex flex-wrap gap-2">{[false,true].map(t => <button key={String(t)} className={t === trash ? '' : 'secondary'} aria-pressed={t === trash} onClick={() => { setTrash(t); setPage(1) }}>{t ? 'Cestino bandi' : 'Tutte le schede'}</button>)}
      <button className="secondary" onClick={refresh}>Aggiorna elenco</button></div>
    {error && <p role="alert" className="error">{error}</p>}{notice && <p role="status" className="success">{notice}</p>}
    {loading ? <p role="status">Caricamento bandi…</p> : <><p>{matches.length} schede</p>
      {matches.slice((currentPage-1)*20,currentPage*20).map(row => <article key={row.id} className="panel flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1"><h2 className="font-semibold">{row.scheda.titolo}</h2><p className="mt-1 text-sm">{row.scheda.ente} · {row.deleted_at ? 'Nel cestino' : row.published ? 'Pubblicato' : 'Bozza'}</p><p className="text-xs mt-1 break-all">ID {row.id}</p></div>
        <div className="flex flex-wrap gap-2">{trash ? <><button disabled={saving} onClick={() => change(row,'restore')}>Ripristina</button><button className="danger" disabled={saving} onClick={() => change(row,'delete')}>Elimina definitivamente</button></> :
        <><button onClick={() => setEditing(row)}>Modifica bando</button><button className="secondary" disabled={saving} onClick={() => change(row,'trash')}>Sposta nel cestino</button></>}</div>
      </article>)}
      <nav aria-label="Pagine bandi amministrazione" className="flex items-center gap-3"><button disabled={currentPage===1} onClick={() => setPage(currentPage-1)}>Precedente</button><span>{currentPage} / {pages}</span><button disabled={currentPage===pages} onClick={() => setPage(currentPage+1)}>Successiva</button></nav>
    </>}
  </section>
}
