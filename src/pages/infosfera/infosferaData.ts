export type InfosferaIssue = {
  id: string
  label: string
  title: string
  cover: string
  /** Link al PDF completo (Google Drive): mostrato solo dopo la compilazione del form */
  url: string
  /**
   * Pagine dell'anteprima libera (dalla copertina all'editoriale compreso), in ordine.
   * Le pagine successive non sono pubblicate sul sito: si leggono solo dal PDF completo.
   */
  previewPages?: string[]
  /** Pagine bianche dell'anteprima (numerate da 1): saltate quando si legge una pagina alla volta */
  blankPages?: number[]
  contents?: string[]
}

export const LATEST_ISSUE: InfosferaIssue = {
  id: '12',
  label: 'n. 12 · Anno VII · Ottobre 2026',
  title: 'Intelligenza Artificiale tra opportunità e cambiamenti',
  cover: '/assets/infosfera/numeri/12/copertina.webp',
  url: 'https://drive.google.com/file/d/16DXWGuhTyzUte16yM81B5dno_wsgOK8L/view',
  // Editoriale alle pagine 5-7 del PDF
  previewPages: Array.from(
    { length: 7 },
    (_, i) => `/assets/infosfera/numeri/12/anteprima/pagina-${String(i + 1).padStart(2, '0')}.webp`,
  ),
  blankPages: [2],
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
  previewPages: LATEST_ISSUE.previewPages,
  blankPages: LATEST_ISSUE.blankPages,
  contents: PLACEHOLDER_CONTENTS,
}))
