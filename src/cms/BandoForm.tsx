import { useEffect, useState, type FormEvent } from 'react'
import { AMBITI, DESTINATARI, LIVELLI, type Bando } from '../pages/bandi/bandiData'
import { saveBando, type BandoRecord } from '../lib/bandi'
import { confirmAction } from './dialogs'

const MODALITA: Record<Bando['modalita'], string> = {
  scadenza: 'Con scadenza', sportello: 'A sportello', ricorrente: 'Ricorrente',
  informativa: 'Scheda informativa', sospesa: 'Sospeso', 'non-documentata': 'Stato da verificare',
}

function Termine({ name, label, value = '' }: { name: string; label: string; value?: string }) {
  const [date, time] = value.split('T')
  return <fieldset className="grid grid-cols-2 gap-3"><legend className="font-semibold">{label}</legend>
    <label>Data {label.toLowerCase()}<input type="date" name={name} defaultValue={date} /></label>
    <label>Ora {label.toLowerCase()} (facoltativa)<input type="time" name={name + 'Ora'} defaultValue={time} /></label>
  </fieldset>
}

type Source = NonNullable<Bando['pubblicazioni']>[number]
type Props = { record?: BandoRecord; records: BandoRecord[]; onClose: () => void; onSaved: () => void }

export function BandoForm({ record, records, onClose, onSaved }: Props) {
  const b = record?.scheda
  const [id] = useState(() => record?.id ?? crypto.randomUUID())
  const [sources, setSources] = useState<Source[]>(b?.pubblicazioni ?? [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const fields = new FormData(event.currentTarget)
    const value = (k: string) => String(fields.get(k) ?? '').trim()
    const term = (k: string) => {
      if (value(k + 'Ora') && !value(k)) throw new Error('Inserisci la data corrispondente all’orario.')
      return value(k) ? value(k) + (value(k + 'Ora') ? 'T' + value(k + 'Ora') : '') : undefined
    }
    setError(''); setBusy(true)
    try {
      const apertura = term('apertura'), scadenza = term('scadenza')
      if (apertura && scadenza && apertura > (scadenza.includes('T') ? scadenza : scadenza + 'T23:59')) throw new Error('La chiusura deve seguire l’apertura.')
      const destinatari = fields.getAll('destinatari') as Bando['destinatari']
      if (!destinatari.length) throw new Error('Seleziona almeno un beneficiario.')
      const modalita = value('modalita') as Bando['modalita']
      if (modalita === 'scadenza' && !scadenza && !fields.has('chiuso')) throw new Error('Indica la scadenza o seleziona lo stato da verificare.')
      if (new Set(sources.map(s => s.wpId)).size !== sources.length) throw new Error('Ogni pubblicazione deve avere un ID WordPress distinto.')
      const link = value('link'), approfondimento = value('approfondimento')
      if (link && !/^https?:\/\//i.test(link)) throw new Error('Inserisci un indirizzo HTTP o HTTPS per la fonte.')
      if (approfondimento && !/^\/news\/[^/?#\s]+$/.test(approfondimento)) throw new Error('Usa il percorso interno /news/slug per l’approfondimento.')
      const importo = value('dotazioneEuro')
      const scheda: BandoRecord['scheda'] = {
        titolo: value('titolo'), ente: value('ente'), tipologia: value('tipologia'), livello: value('livello') as Bando['livello'],
        abstract: value('abstract').split(/\n+/).map(p => p.trim()).filter(Boolean), destinatari,
        ambiti: fields.getAll('ambiti') as Bando['ambiti'], modalita, apertura, scadenza,
        dotazioneEuro: importo ? Number(importo) : undefined,
        budget: value('budget') || (importo ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Number(importo)) : undefined),
        requisiti: value('requisiti') || undefined, noteTermini: value('noteTermini') || undefined,
        coinvolgimentoDih: value('coinvolgimentoDih') || undefined, chiusoManualmente: fields.has('chiuso') || undefined,
        link: link || undefined, approfondimento: approfondimento || undefined, pubblicazioni: sources.length ? sources : undefined,
      }
      if (!scheda.titolo || !scheda.ente || !scheda.tipologia || !scheda.abstract.length) throw new Error('Completa titolo, ente, tipologia e sintesi.')
      await saveBando(id, scheda, fields.has('published'), record)
      onSaved()
    } catch (err) { setError(err instanceof Error ? err.message : 'Salvataggio non riuscito.') }
    finally { setBusy(false) }
  }

  function editSource(index: number, patch: Partial<Source>) {
    setDirty(true)
    setSources(list => list.map((s, i) => i === index ? { ...s, ...patch } : s))
  }
  return <form onSubmit={submit} onChange={() => setDirty(true)} className="panel space-y-6">
    <h1 className="text-2xl">{record ? 'Modifica bando' : 'Nuovo bando'}</h1>
    <label>Titolo<input name="titolo" maxLength={500} required defaultValue={b?.titolo} /></label>
    <div className="grid gap-4 md:grid-cols-3">
      <label>Ente erogatore o promotore<input list="enti-bandi" maxLength={300} name="ente" required defaultValue={b?.ente} /></label>
      <datalist id="enti-bandi">{[...new Set(records.map(r => r.scheda.ente))].sort().map(v => <option key={v} value={v} />)}</datalist>
      <label>Tipologia<input name="tipologia" list="tipologie-bandi" required defaultValue={b?.tipologia} /></label>
      <datalist id="tipologie-bandi">{[...new Set(records.map(r => r.scheda.tipologia).filter(Boolean))].sort().map(v => <option key={v} value={v} />)}</datalist>
      <label>Livello territoriale<select name="livello" defaultValue={b?.livello ?? 'Regionale'}>{LIVELLI.map(v => <option key={v}>{v}</option>)}</select></label>
    </div>
    <label>Sintesi (un paragrafo per riga)<textarea name="abstract" rows={4} required defaultValue={b?.abstract.join('\n\n')} /></label>
    <fieldset><legend className="font-semibold mb-2">Ambiti</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{AMBITI.map(a => <label key={a.id}><input type="checkbox" name="ambiti" value={a.id} defaultChecked={b?.ambiti.includes(a.id)} />{a.label}</label>)}</div></fieldset>
    <fieldset><legend className="font-semibold mb-2">Beneficiari</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{DESTINATARI.map(a => <label key={a.id}><input type="checkbox" name="destinatari" value={a.id} defaultChecked={b?.destinatari.includes(a.id)} />{a.label}</label>)}</div></fieldset>
    <label>Requisiti dei beneficiari<textarea name="requisiti" defaultValue={b?.requisiti} /></label>
    <div className="grid gap-4 md:grid-cols-2">
      <label>Dotazione complessiva in euro<input type="number" min="0" step="0.01" name="dotazioneEuro" defaultValue={b?.dotazioneEuro} /></label>
      <label>Budget e massimali (testo pubblico)<input name="budget" defaultValue={b?.budget} /></label>
      <label>Modalità e stato<select name="modalita" defaultValue={b?.modalita ?? 'scadenza'}>{Object.entries(MODALITA).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="self-end pb-3"><input name="chiuso" type="checkbox" defaultChecked={b?.chiusoManualmente} />Bando chiuso manualmente</label>
      <Termine name="apertura" label="Apertura" value={b?.apertura} />
      <Termine name="scadenza" label="Scadenza" value={b?.scadenza} />
    </div>
    <label>Note sui termini<textarea name="noteTermini" defaultValue={b?.noteTermini} /></label>
    <label>Supporto del DIH<textarea name="coinvolgimentoDih" defaultValue={b?.coinvolgimentoDih} /></label>
    <label>Fonte ufficiale<input type="url" name="link" defaultValue={b?.link} /></label>
    <label>Approfondimento interno<input name="approfondimento" placeholder="/news/slug" defaultValue={b?.approfondimento} /></label>
    <fieldset className="space-y-3"><legend className="font-semibold">Pubblicazioni dall’archivio WordPress</legend>
      {sources.map((s,i) => <div key={i} className="grid gap-2 sm:grid-cols-2 border-b pb-3">
        <label>ID WordPress<input type="number" required min={1} value={s.wpId || ''} onChange={e => editSource(i,{wpId:Number(e.target.value)})} /></label>
        <label>Data pubblicazione<input type="date" required value={s.data} onChange={e => editSource(i,{data:e.target.value})} /></label>
        <label>Titolo pubblicazione<input required value={s.titolo} onChange={e => editSource(i,{titolo:e.target.value})} /></label>
        <label>Slug articolo<input required pattern={String.raw`[^\/\s?#]+`} value={s.slug} onChange={e => editSource(i,{slug:e.target.value})} /></label>
        <button className="secondary justify-self-start" type="button" onClick={() => { setDirty(true); setSources(sources.filter((_,j) => i !== j)) }}>Rimuovi collegamento</button>
      </div>)}
      <button className="secondary" type="button" onClick={() => { setDirty(true); setSources([...sources,{wpId:0,titolo:'',slug:'',data:''}]) }}>Aggiungi pubblicazione</button>
    </fieldset>
    <label><input name="published" type="checkbox" defaultChecked={record?.published ?? false} />Pubblicato nel catalogo pubblico</label>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="flex gap-3"><button disabled={busy}>{busy ? 'Salvataggio…' : 'Salva bando'}</button>
      <button className="secondary" type="button" disabled={busy} onClick={async () => { if (!dirty || await confirmAction('Vuoi uscire e scartare le modifiche al bando?')) onClose() }}>Annulla</button></div>
  </form>
}
