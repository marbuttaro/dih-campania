export type EventItem = {
  /** ISO date, YYYY-MM-DD */
  date: string
  time?: string
  title: string
  description: string
  location?: string
  image: string
}

export const EVENTS: EventItem[] = [
  {
    date: '2026-04-30',
    title: 'I numeri di EDIH PRIDE',
    description: 'Oltre 2000 imprese coinvolte, 5 milioni di euro in servizi alle Pmi.',
    image: '/assets/events_1.jpg',
  },
  {
    date: '2026-04-10',
    title: 'Presentata Infosfera',
    description: 'Uno strumento capace di collegare innovazione, impresa e cultura. Sfida sull’AI.',
    image: '/assets/events_2.jpg',
  },
  {
    date: '2026-04-02',
    title: 'L’informazione nell’era digitale',
    description: 'Tra innovazione, nuovi linguaggi e intelligenza artificiale.',
    image: '/assets/events_bg.jpg',
  },
]

const MONTHS_SHORT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
const WEEKDAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']

// Dates are parsed as local days so they never shift with the timezone
export const parseDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const monthShort = (d: Date) => MONTHS_SHORT[d.getMonth()]

/** "Lunedì 26/10" */
export const dayLabel = (d: Date) => `${WEEKDAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`

/** "26/10/2026" */
export const fullDate = (d: Date) => `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
