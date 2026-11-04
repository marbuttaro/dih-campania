export type InfosferaIssue = {
  id: string
  label: string
  title: string
  cover: string
  /** Link al PDF sfogliabile (Google Drive), aperto in una nuova finestra */
  url: string
  contents?: string[]
}

export const LATEST_ISSUE: InfosferaIssue = {
  id: '12',
  label: 'n. 12 · Anno VII · Ottobre 2026',
  title: 'Intelligenza Artificiale tra opportunità e cambiamenti',
  cover: '/assets/infosfera/numeri/12/copertina.webp',
  url: 'https://drive.google.com/file/d/10kDLIen62t09ZNSVnk0ZQk8FdxCW2Iy4/view',
}

export const EDITORIAL_TEAM = [
  { role: 'Direttore responsabile', name: 'Edoardo Imperiale' },
  { role: 'Coordinamento editoriale', name: 'Valentina Monarco' },
]

// Placeholder dal design: da sostituire con i numeri recuperati dal sito attuale
const PLACEHOLDER_CONTENTS = [
  'Underwater, supercalcolo e quanti',
  'Economia in trasformazione',
  "Paolo D'Amico: sotto la superficie digitale",
  'Pierroberto Folgiero: Mediterraneo laboratorio naturale',
  'Marina Calderone: tecnologie, dignità e lavoro',
]

export const PAST_ISSUES: InfosferaIssue[] = [1, 2, 3].map((n) => ({
  id: `placeholder-${n}`,
  label: 'N°1/2026',
  title: 'Gli algoritmi sono forme di potere',
  cover: '/assets/infosfera/placeholder-copertina.webp',
  url: LATEST_ISSUE.url,
  contents: PLACEHOLDER_CONTENTS,
}))
