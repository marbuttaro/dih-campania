import { GIORNI_IN_SCADENZA, type AmbitoId, type Bando, type DestinatarioId, type Livello, type StatoFiltro } from './bandiData'

export type Stato = 'in-scadenza' | 'aperto' | 'in-apertura' | 'chiuso'

export const STATO_LABEL: Record<Stato, string> = {
  'in-scadenza': 'In scadenza',
  aperto: 'Aperto',
  'in-apertura': 'In apertura',
  chiuso: 'Chiuso',
}

const STATO_ORDINE: Record<Stato, number> = { 'in-scadenza': 0, aperto: 1, 'in-apertura': 2, chiuso: 3 }

const MS_GIORNO = 86_400_000

/** "2026-12-15" vale fino a fine giornata; "2026-12-15T12:00" fino a quell'ora */
function fineTermine(iso: string) {
  return iso.includes('T') ? new Date(iso) : new Date(`${iso}T23:59:59`)
}

function inizioTermine(iso: string) {
  return iso.includes('T') ? new Date(iso) : new Date(`${iso}T00:00:00`)
}

/** Giorni di calendario tra oggi e la data (0 = oggi) */
export function giorniA(iso: string, oggi: Date) {
  const a = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())
  const d = inizioTermine(iso)
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.round((b.getTime() - a.getTime()) / MS_GIORNO)
}

export function statoBando(bando: Bando, oggi: Date): Stato {
  if (bando.chiusoManualmente) return 'chiuso'
  if (bando.apertura && oggi < inizioTermine(bando.apertura)) return 'in-apertura'
  if (bando.modalita === 'scadenza' && bando.scadenza) {
    if (oggi > fineTermine(bando.scadenza)) return 'chiuso'
    if (giorniA(bando.scadenza, oggi) <= GIORNI_IN_SCADENZA) return 'in-scadenza'
  }
  return 'aperto'
}

const fmtData = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtOra = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' })

/** "15 dic 2026" (senza il punto che Intl aggiunge ad alcuni mesi abbreviati) */
export function formatData(iso: string) {
  return fmtData.format(inizioTermine(iso)).replace('.', '')
}

function formatDataOra(iso: string) {
  const data = formatData(iso)
  return iso.includes('T') ? `${data}, ore ${fmtOra.format(new Date(iso))}` : data
}

function traGiorni(n: number) {
  if (n === 0) return 'oggi'
  if (n === 1) return 'domani'
  return `tra ${n} giorni`
}

/** Riga "Scadenza" della card: testo principale in grassetto + dettaglio */
export function testoScadenza(bando: Bando, oggi: Date): { principale: string; dettaglio?: string } {
  const stato = statoBando(bando, oggi)

  if (stato === 'chiuso') {
    return { principale: 'Chiuso', dettaglio: bando.scadenza ? `il ${formatData(bando.scadenza)}` : undefined }
  }

  if (stato === 'in-apertura' && bando.apertura) {
    const chiusura =
      bando.modalita === 'scadenza' && bando.scadenza
        ? `chiude il ${formatData(bando.scadenza)}`
        : bando.modalita === 'sportello'
          ? 'a sportello'
          : undefined
    return { principale: `Apre il ${formatData(bando.apertura)}`, dettaglio: chiusura }
  }

  if (bando.modalita === 'sportello') return { principale: 'A sportello', dettaglio: 'fino a esaurimento fondi' }
  if (bando.modalita === 'ricorrente') return { principale: 'Ogni anno', dettaglio: bando.noteTermini }

  if (bando.scadenza) {
    const giorni = giorniA(bando.scadenza, oggi)
    if (stato === 'in-scadenza') {
      return {
        principale: giorni <= 1 ? `Scade ${traGiorni(giorni)}` : `Scade tra ${giorni} giorni`,
        dettaglio: formatDataOra(bando.scadenza),
      }
    }
    return { principale: `Scade il ${formatData(bando.scadenza)}`, dettaglio: traGiorni(giorni) }
  }

  return { principale: 'Aperto' }
}

export function ordinaBandi(bandi: Bando[], oggi: Date) {
  const chiave = (b: Bando) => b.scadenza ?? b.apertura ?? '9999'
  return [...bandi].sort((a, b) => {
    const sa = statoBando(a, oggi)
    const sb = statoBando(b, oggi)
    if (sa !== sb) return STATO_ORDINE[sa] - STATO_ORDINE[sb]
    // I chiusi più recenti per primi, gli altri per scadenza più vicina
    return sa === 'chiuso' ? chiave(b).localeCompare(chiave(a)) : chiave(a).localeCompare(chiave(b))
  })
}

export interface Filtri {
  testo: string
  ambito: AmbitoId | ''
  destinatario: DestinatarioId | ''
  stato: StatoFiltro
  livello: Livello | ''
}

export const FILTRI_VUOTI: Filtri = { testo: '', ambito: '', destinatario: '', stato: 'tutti', livello: '' }

function corrispondeStato(stato: Stato, filtro: StatoFiltro) {
  switch (filtro) {
    case 'tutti':
      return true
    case 'aperti':
      return stato === 'aperto' || stato === 'in-scadenza'
    case 'in-scadenza':
      return stato === 'in-scadenza'
    case 'in-apertura':
      return stato === 'in-apertura'
    case 'attivi':
      return stato !== 'chiuso'
    case 'chiusi':
      return stato === 'chiuso'
  }
}

/** Minuscole e senza accenti, per una ricerca tollerante */
function normalizza(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function filtraBandi(bandi: Bando[], filtri: Filtri, oggi: Date) {
  const parole = normalizza(filtri.testo).split(/\s+/).filter(Boolean)
  return bandi.filter((b) => {
    if (filtri.ambito && !b.ambiti.includes(filtri.ambito)) return false
    if (filtri.destinatario && !b.destinatari.includes(filtri.destinatario)) return false
    if (filtri.livello && b.livello !== filtri.livello) return false
    if (!corrispondeStato(statoBando(b, oggi), filtri.stato)) return false
    if (parole.length) {
      const testo = normalizza([b.titolo, b.ente, b.livello, ...b.abstract].join(' '))
      if (!parole.every((p) => testo.includes(p))) return false
    }
    return true
  })
}
