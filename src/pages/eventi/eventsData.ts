export type EventItem = {
  id: string
  /** ISO date, YYYY-MM-DD; YYYY-MM when only the month is known */
  date: string
  time?: string
  title: string
  description: string
  location?: string
  image: string
  /** Mostra il pulsante "Partecipa" */
  joinable?: boolean
}

// Dal calendario "Learning by DIH 2026" (locandina in /assets/eventi/): ultimi 4 appuntamenti
export const EVENTS: EventItem[] = [
  {
    id: 'campania-digital-summit-2026',
    date: '2026-10-21',
    title: 'Campania Digital Summit 2026',
    description: 'Organizzato da TIG – The Innovation Group.',
    location: 'Stazione Marittima – Centro Congressi',
    image: '/assets/eventi/campania-digital-summit.webp',
  },
  {
    id: 'sandboxing-innovation',
    date: '2026-11-06',
    time: '15:30',
    title: 'Presentazione del volume “Sandboxing Innovation”',
    description: 'Sandbox regolatorie per AI e cybersecurity e servizi dell’EDIH PRIDE-CETMA. Con l’Università Parthenope.',
    location: 'Palazzo Pacanowski',
    image: '/assets/events_2.jpg',
  },
  {
    id: 'talk-infosfera-napoli',
    date: '2026-11-11',
    time: '11:00',
    title: 'Talk Infosfera',
    description: '«Intelligenza Artificiale tra opportunità e cambiamenti».',
    location: 'Città della Scienza',
    image: '/assets/events_bg.jpg',
    joinable: true,
  },
  {
    id: 'talk-infosfera-roma',
    date: '2026-11',
    title: 'Talk Infosfera',
    description:
      '«Intelligenza Artificiale: rischi, responsabilità e nuovi divide nell’era dell’Intelligenza Artificiale».',
    location: 'Roma',
    image: '/assets/events_bg.jpg',
    joinable: true,
  },
]

/** Evento con il solo mese (data del giorno ancora da definire) */
export const isMonthOnly = (e: EventItem) => e.date.length === 7

// Per l'ordinamento un evento "solo mese" vale come fine mese
const sortKey = (e: EventItem) => (isMonthOnly(e) ? `${e.date}-31` : e.date)

/** Prima i prossimi eventi (dal più vicino), poi quelli passati (dal più recente) */
export function sortEvents(events: EventItem[]) {
  const today = toIso(new Date())
  const upcoming = events.filter((e) => sortKey(e) >= today).sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
  const past = events.filter((e) => sortKey(e) < today).sort((a, b) => sortKey(b).localeCompare(sortKey(a)))
  return [...upcoming, ...past]
}

export const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const MONTHS_SHORT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
const WEEKDAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']

// Dates are parsed as local days so they never shift with the timezone
export const parseDate = (iso: string) => {
  const [y, m, d = 1] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const monthShort = (d: Date) => MONTHS_SHORT[d.getMonth()]

/** "Lunedì 26/10" */
export const dayLabel = (d: Date) => `${WEEKDAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`

/** "26/10/2026" */
export const fullDate = (d: Date) => `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
