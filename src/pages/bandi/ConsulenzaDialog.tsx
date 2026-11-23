import { useRef, useState, type FormEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { Bando } from './bandiData'

interface Props {
  initial: Bando | null
  bandi: Bando[]
  onClose: () => void
  trigger: HTMLElement | null
}

const inputClass = 'mt-1 block w-full rounded-lg border border-brand-navy/30 bg-white px-3 py-2 text-sm text-brand-dark-navy'

export function ConsulenzaDialog({ initial, bandi, onClose, trigger }: Props) {
  const [id, setId] = useState(initial?.id ?? '')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const request = useRef({ payload: '', key: '' })
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = new FormData(event.currentTarget)
    const payload = JSON.stringify(Object.fromEntries(form.entries()))
    if (request.current.payload !== payload) request.current = { payload, key: crypto.randomUUID() }
    setError(''); setBusy(true)
    try {
      const response = await fetch('/api/consulenza-bando', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(form.entries()), requestId: request.current.key }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Invio non riuscito. Riprova.')
      setDone(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Invio non riuscito. Riprova.') }
    finally { setBusy(false) }
  }
  return <Dialog.Root open onOpenChange={open => { if (!open && !busy) onClose() }}>
    <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[100] bg-brand-dark-navy/65" />
      <Dialog.Content onCloseAutoFocus={e => { e.preventDefault(); trigger?.focus() }}
        className="fixed left-1/2 top-1/2 z-[101] max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 text-brand-dark-navy shadow-xl sm:p-8">
        <Dialog.Close disabled={busy} aria-label="Chiudi finestra" className="absolute right-4 top-4 p-2"><X className="size-5" /></Dialog.Close>
        <Dialog.Title className="pr-8 text-2xl font-semibold">Richiedi una consulenza</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm">{initial?.titolo ?? 'Seleziona il bando sul quale desideri ricevere assistenza.'}</Dialog.Description>
        {done ? <div className="mt-6"><p role="status">Richiesta registrata. La redazione potrà risponderti all’indirizzo indicato.</p><Dialog.Close className="mt-4 rounded-lg bg-brand-navy px-4 py-2 text-white">Chiudi</Dialog.Close></div>
        : <form onSubmit={submit} className="mt-5 space-y-4">
          {!initial && <label className="block text-sm font-semibold">Bando<select required value={id} onChange={e => setId(e.target.value)} className={inputClass}>
            <option value="">Scegli il bando</option>{bandi.map(b => <option key={b.id} value={b.id}>{b.titolo}</option>)}</select></label>}
          <input type="hidden" name="bandoId" value={id} />
          <label className="block text-sm font-semibold">Nome e cognome<input className={inputClass} name="nome" autoComplete="name" maxLength={120} required /></label>
          <label className="block text-sm font-semibold">Email<input className={inputClass} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <label className="block text-sm font-semibold">Come possiamo aiutarti?<textarea className={inputClass} name="messaggio" rows={3} maxLength={3000} required /></label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <label className="flex items-start gap-2 text-sm"><input required name="privacy" type="checkbox" className="mt-1" /><span>Ho letto l’<a href="https://www.campaniadih.it/privacy-policy-2/" target="_blank" rel="noreferrer" className="underline">informativa privacy</a>.</span></label>
          {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
          <button disabled={busy} className="rounded-lg bg-brand-navy px-4 py-2.5 font-semibold text-white disabled:opacity-60">{busy ? 'Invio in corso…' : 'Invia richiesta'}</button>
        </form>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
