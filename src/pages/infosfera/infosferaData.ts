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
  /** Testo di presentazione mostrato sotto la copertina */
  description?: string
  authors?: { name: string; role: string }[]
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

const PRIDE_UPLOADS = 'https://www.edih-pride.eu/wp-content/uploads'

/**
 * Numeri precedenti, dal più recente. Il n. 2/2024 manca: copertina e testo da recuperare.
 * Senza `previewPages` il pulsante "Sfoglia" apre direttamente il PDF (o lo sfogliatore) sul sito EDIH PRIDE.
 */
export const PAST_ISSUES: InfosferaIssue[] = [
  {
    id: '11',
    label: 'N°1/2026',
    title: 'Underwater, supercalcolo e quanti: economie in trasformazione',
    cover: '/assets/infosfera/numeri/11/copertina.webp',
    url: `${PRIDE_UPLOADS}/2026/04/infosfera_gen26_rev_web.pdf`,
    description:
      "Approfondiamo il ruolo delle infrastrutture digitali e delle tecnologie avanzate nella trasformazione dei sistemi economici, con particolare attenzione alla blue economy, al supercalcolo, all'intelligenza artificiale e alla sovranità tecnologica.",
    authors: [
      { name: 'Marina Calderone', role: 'Ministra del Lavoro e delle Politiche Sociali' },
      { name: 'Pierroberto Folgiero', role: 'Amministratore delegato e Direttore generale di Fincantieri' },
      { name: 'Francesca Rossi', role: 'Ricercatrice ed esperta internazionale di intelligenza artificiale' },
      { name: 'Antonello Testa', role: 'Esperto e interlocutore sui temi della Blue Economy' },
    ],
  },
  {
    id: '10',
    label: 'N°2/2025',
    title: 'The European Way: Innovation, Sovereignty and Peace',
    cover: '/assets/infosfera/numeri/10/copertina.webp',
    url: `${PRIDE_UPLOADS}/2025/09/infosfera_sett25-1-2.pdf`,
    description:
      "Affrontiamo il rapporto tra innovazione, autonomia strategica europea e centralità della persona, analizzando le implicazioni etiche dell'intelligenza artificiale, le priorità per la digitalizzazione italiana e le applicazioni dell'AI e della robotica.",
    authors: [
      {
        name: 'Paolo Benanti',
        role: "Teologo francescano, docente universitario ed esperto di etica delle tecnologie e dell'intelligenza artificiale",
      },
      { name: 'Massimo Dal Checco', role: 'Presidente Anitec-Assinform' },
      { name: 'Guido Scorza', role: 'Componente del Garante per la protezione dei dati personali' },
      { name: 'Fanny Ficuciello', role: 'Professoressa associata in Robotica, Università degli Studi di Napoli Federico II' },
    ],
  },
  {
    id: '9',
    label: 'N°1/2025',
    title: 'Guardiani digitali',
    cover: '/assets/infosfera/numeri/9/copertina.webp',
    url: `${PRIDE_UPLOADS}/2026/05/infosfera_17feb25-indice-smart-.pdf`,
    description:
      'Focus sulla cybersecurity come fattore di crescita e resilienza delle imprese, esaminando la sicurezza delle infrastrutture, la dipendenza tecnologica, la trasformazione industriale e le implicazioni sociali e politiche della digitalizzazione.',
    authors: [
      { name: 'Nunzia Ciardi', role: 'Vice Direttore Generale ACN' },
      { name: 'Marco Nocivelli', role: 'Vicepresidente Confindustria' },
      { name: 'Sebastiano Maffettone', role: 'Filosofo politico e docente universitario' },
      { name: 'Paola Girdinio e Georgia Cesarone', role: 'Competence Center Start4.0' },
    ],
  },
  {
    id: '7',
    label: 'N°1/2024',
    title: 'Il potere della conoscenza: evoluzione del capitale umano',
    cover: '/assets/infosfera/numeri/7/copertina.webp',
    url: `${PRIDE_UPLOADS}/2026/04/infosfera_lug24_web.pdf`,
    description:
      "Analizziamo il valore della conoscenza e delle competenze nell'era digitale, approfondendo l'impatto dell'intelligenza artificiale sui processi produttivi, l'evoluzione del capitale umano, le tecnologie dei microchip e i nuovi modelli di innovazione.",
    authors: [
      { name: 'Sergio Dompè', role: 'Presidente Comitato Leonardo' },
      { name: 'Stefania Matrone', role: 'Manager di WINDTRE' },
      { name: 'Cesare Alemanni', role: 'Giornalista e scrittore, esperto di industria e tecnologia' },
      { name: 'Martina Lascialfari', role: 'Direttrice Fondo per la Repubblica Digitale' },
    ],
  },
  {
    id: '6',
    label: 'N°2/2023',
    title: 'Green Tech, sostenibilità e transizione competitiva',
    cover: '/assets/infosfera/numeri/6/copertina.webp',
    url: 'https://www.edih-pride.eu/infosfera-n-2-23/',
    description:
      "Approfondiamo la transizione ecologica come opportunità di sviluppo industriale, affrontando la sostenibilità ambientale, economica e sociale, esaminando le transizioni energetica e digitale, l'innovazione nei trasporti, le infrastrutture intelligenti e i nuovi modelli di sviluppo industriale.",
    authors: [
      { name: 'Gilberto Pichetto Fratin', role: "Ministro dell'Ambiente e della Sicurezza Energetica" },
      { name: "Antonio D'Amato", role: 'Presidente Cavalieri del Lavoro' },
      { name: 'Agostino Re Rebaudengo', role: 'Presidente di Elettricità Futura' },
      { name: 'Ulderigo Zona', role: 'Direttore Hitachi Rail' },
    ],
  },
  {
    id: '5',
    label: 'N°1/2023',
    title: 'Driving Innovation(s)',
    cover: '/assets/infosfera/numeri/5/copertina.webp',
    url: 'https://www.edih-pride.eu/infosfera-n-1-23/',
    description:
      "Approfondiamo l'evoluzione del rapporto tra persone e tecnologie, con particolare attenzione all'intelligenza artificiale e alla digitalizzazione dei processi industriali. Esaminiamo il ruolo degli European Digital Innovation Hub, le applicazioni del supercalcolo alle PMI e il modello degli smart port, attraverso l'esperienza del porto di Trieste.",
    authors: [
      {
        name: 'Lucilla Sioli',
        role: "Direttrice per l'Intelligenza artificiale e l'industria digitale presso la Commissione europea",
      },
      { name: 'Federico Cabitza', role: "Professore associato di Interazione Uomo-Macchina all'Università di Milano Bicocca" },
      { name: "Zeno D'Agostino", role: 'Presidente Autorità di Sistema Portuale del Mare Adriatico Orientale' },
      { name: 'Antonio Zoccoli', role: 'Professore di fisica, Università degli Studi di Bologna' },
    ],
  },
]
