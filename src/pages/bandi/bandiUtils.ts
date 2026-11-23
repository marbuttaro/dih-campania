import { Temporal } from '@js-temporal/polyfill'
import { GIORNI_IN_SCADENZA, type AmbitoId, type Bando, type DestinatarioId, type Livello, type StatoFiltro } from './bandiData'

export type Stato = 'in-scadenza' | 'aperto' | 'in-apertura' | 'chiuso' | 'informativo' | 'incerto' | 'sospeso'

export const STATO_LABEL: Record<Stato, string> = {
  'in-scadenza': 'In scadenza',
  aperto: 'Aperto',
  'in-apertura': 'In apertura',
  chiuso: 'Scaduto / chiuso',
  sospeso: 'Sospeso',
  informativo: 'Informazione',
  incerto: 'Stato da verificare',
}

const STATO_ORDINE: Record<Stato, number> = { 'in-scadenza': 0, aperto: 1, 'in-apertura': 2, sospeso: 3, incerto: 4, chiuso: 5, informativo: 6 }

const FUSO = 'Europe/Rome'
const termini = new Map<string, number>()

function istante(iso: string, fine = false) {
  const valore = iso.includes('T') ? iso : iso + (fine ? 'T23:59:59.999' : 'T00:00')
  let ms = termini.get(valore)
  if (ms === undefined) {
    ms = Temporal.PlainDateTime.from(valore).toZonedDateTime(FUSO).epochMilliseconds
    termini.set(valore, ms)
  }
  return ms
}

export function giorniA(iso: string, oggi: Date) {
  const dataOggi = Temporal.Instant.fromEpochMilliseconds(oggi.getTime()).toZonedDateTimeISO(FUSO).toPlainDate()
  return dataOggi.until(Temporal.PlainDate.from(iso.slice(0, 10))).days
}

export function puoPresentareDomanda(stato: Stato) {
  return stato === 'aperto' || stato === 'in-scadenza'
}

export function statoBando(bando: Bando, oggi: Date): Stato {
  if (bando.modalita === 'informativa') return 'informativo'
  if (bando.modalita === 'sospesa') return 'sospeso'
  if (bando.modalita === 'non-documentata') return 'incerto'
  if (bando.chiusoManualmente) return 'chiuso'
  if (bando.apertura && oggi.getTime() < istante(bando.apertura)) return 'in-apertura'
  if (bando.modalita === 'scadenza' && bando.scadenza) {
    if (oggi.getTime() > istante(bando.scadenza, true)) return 'chiuso'
    if (giorniA(bando.scadenza, oggi) <= GIORNI_IN_SCADENZA) return 'in-scadenza'
  }
  return bando.modalita === 'scadenza' && !bando.scadenza ? 'incerto' : 'aperto'
}

const fmtData = new Intl.DateTimeFormat('it-IT', { timeZone: FUSO, day: 'numeric', month: 'short', year: 'numeric' })
const fmtOra = new Intl.DateTimeFormat('it-IT', { timeZone: FUSO, hour: '2-digit', minute: '2-digit' })

/** "15 dic 2026" (senza il punto che Intl aggiunge ad alcuni mesi abbreviati) */
export function formatData(iso: string) {
  return fmtData.format(istante(iso)).replace('.', '')
}

function formatDataOra(iso: string) {
  const data = formatData(iso)
  return iso.includes('T') ? `${data}, ore ${fmtOra.format(istante(iso))}` : data
}

function traGiorni(n: number) {
  if (n === 0) return 'oggi'
  if (n === 1) return 'domani'
  return `tra ${n} giorni`
}

/** Riga "Scadenza" della card: testo principale in grassetto + dettaglio */
export function testoScadenza(bando: Bando, oggi: Date): { principale: string; dettaglio?: string } {
  const stato = statoBando(bando, oggi)

  if (stato === 'informativo') return { principale: 'Nessuna candidatura prevista' }
  if (stato === 'incerto') return { principale: 'Disponibilità da verificare' }
  if (stato === 'sospeso') return { principale: 'Presentazione delle domande sospesa' }
  if (stato === 'chiuso') {
    return { principale: 'Chiuso', dettaglio: bando.scadenza ? `· ultimo termine ${formatDataOra(bando.scadenza)}` : undefined }
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
    if (sa === 'chiuso' || sa === 'informativo' || sa === 'incerto') {
      const recente = (item: Bando) => item.scadenza ?? item.pubblicazioni?.[0]?.data ?? item.apertura ?? ''
      return recente(b).localeCompare(recente(a))
    }
    return chiave(a).localeCompare(chiave(b))
  })
}

export const FASCE_BUDGET = [
  { value: 'meno-1m', label: 'Meno di 1 milione di euro' },
  { value: '1m-10m', label: 'Da 1 a meno di 10 milioni di euro' },
  { value: '10m-100m', label: 'Da 10 a meno di 100 milioni di euro' },
  { value: 'da-100m', label: 'Da 100 milioni di euro' },
  { value: 'parziale', label: 'Solo importi parziali o per progetto' },
  { value: 'assente', label: 'Importo non indicato' },
] as const
export type FasciaBudget = (typeof FASCE_BUDGET)[number]['value']

export function fasciaBudget(b: Bando): FasciaBudget {
  if (b.dotazioneEuro === undefined) return b.budget ? 'parziale' : 'assente'
  if (b.dotazioneEuro < 1_000_000) return 'meno-1m'
  if (b.dotazioneEuro < 10_000_000) return '1m-10m'
  if (b.dotazioneEuro < 100_000_000) return '10m-100m'
  return 'da-100m'
}

export interface Filtri {
  ente: string
  tipologia: string
  budget: FasciaBudget | ''
  testo: string
  ambito: AmbitoId | ''
  destinatario: DestinatarioId | ''
  stato: StatoFiltro
  livello: Livello | ''
}

export const FILTRI_VUOTI: Filtri = { testo: '', ente: '', tipologia: '', budget: '', ambito: '', destinatario: '', stato: 'tutti', livello: '' }

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
      return puoPresentareDomanda(stato) || stato === 'in-apertura'
    case 'informative': return stato === 'informativo'
    case 'incerti': return stato === 'incerto'
    case 'sospesi': return stato === 'sospeso'
    case 'chiusi':
      return stato === 'chiuso'
  }
}

/** Minuscole e senza accenti, per una ricerca tollerante */
function normalizza(s: string) {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
}

export function filtraBandi(bandi: Bando[], filtri: Filtri, oggi: Date) {
  const parole = normalizza(filtri.testo).split(/\s+/).filter(Boolean)
  return bandi.filter((b) => {
    if (filtri.ente && filtri.ente !== b.ente) return false
    if (filtri.tipologia && filtri.tipologia !== b.tipologia) return false
    if (filtri.budget && filtri.budget !== fasciaBudget(b)) return false
    if (filtri.ambito && !b.ambiti.includes(filtri.ambito)) return false
    if (filtri.destinatario && !b.destinatari.includes(filtri.destinatario)) return false
    if (filtri.livello && b.livello !== filtri.livello) return false
    if (!corrispondeStato(statoBando(b, oggi), filtri.stato)) return false
    if (parole.length) {
      const testo = normalizza([b.titolo, b.ente, b.livello, b.tipologia ?? '', b.requisiti ?? '', ...(b.pubblicazioni?.map(p => p.titolo) ?? []), ...b.abstract].join(' '))
      if (!parole.every((p) => testo.includes(p))) return false
    }
    return true
  })
}
