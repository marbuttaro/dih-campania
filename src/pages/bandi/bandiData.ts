import { ARCHIVIO_BANDI } from './archivioBandi'

/**
 * Catalogo bandi del Campania DIH.
 *
 * I campi ricalcano le colonne del foglio di lavoro `bandi.xlsx`:
 *   Nome Bando → titolo · Tipologia → livello · Specificare Ente erogatore → ente
 *   Abstract → abstract · Beneficiari → destinatari · Budget → budget
 *   coinvolgimento DIH → coinvolgimentoDih · link → link
 *   Scadenza / tipologia / "se a sportello termini" → modalita, apertura, scadenza, noteTermini
 * Lo stato (aperto, in scadenza, in apertura, chiuso) e i giorni rimanenti si calcolano
 * da soli in base alla data odierna, come le colonne "generate automaticamente" del foglio.
 */

/** Data di ultimo aggiornamento del catalogo, mostrata nella hero (AAAA-MM-GG) */
export const CATALOGO_AGGIORNATO_AL = '2026-11-23'

/** Sotto questa soglia (in giorni) un bando aperto viene segnalato "In scadenza" */
export const GIORNI_IN_SCADENZA = 30

export const AMBITI = [
  { id: 'digitalizzazione', label: 'Digitalizzazione', hint: 'Software, e-commerce, cloud, automazione' },
  { id: 'cybersecurity', label: 'Sicurezza informatica', hint: 'Audit, protezione dei dati, formazione' },
  { id: 'intelligenza-artificiale', label: 'Intelligenza artificiale', hint: 'Dati, automazione intelligente, nuovi servizi' },
  { id: 'innovazione-ricerca', label: 'Innovazione e ricerca', hint: 'Nuovi prodotti, processi, tecnologie' },
  { id: 'sostenibilita', label: 'Sostenibilità ed energia', hint: 'Rinnovabili, consumi, processi green' },
  { id: 'competenze', label: 'Formazione e competenze', hint: 'Upskilling, nuove figure, percorsi per il team' },
] as const

export const DESTINATARI = [
  { id: 'micro-piccole', label: 'Micro e piccole imprese' },
  { id: 'medie', label: 'Medie imprese' },
  { id: 'grandi', label: 'Grandi imprese' },
  { id: 'startup', label: 'Startup e PMI innovative' },
  { id: 'professionisti', label: 'Liberi professionisti' },
  { id: 'solo-micro', label: 'Microimprese' },
  { id: 'midcap', label: 'Imprese a media capitalizzazione' },
  { id: 'imprese', label: 'Imprese (dimensione non specificata)' },
  { id: 'pubblici', label: 'Pubbliche amministrazioni ed enti pubblici' },
  { id: 'ricerca', label: 'Università e organismi di ricerca' },
  { id: 'terzo-settore', label: 'Enti senza scopo di lucro' },
  { id: 'partenariati', label: 'Reti, consorzi e partenariati' },
  { id: 'persone', label: 'Persone fisiche' },
  { id: 'scuole', label: 'Istituti scolastici' },
  { id: 'organizzazioni', label: 'Enti e organizzazioni' },
] as const

/** Colonna "Tipologia" del foglio: livello territoriale del bando */
export const LIVELLI = ['Regionale', 'Nazionale', 'Europeo', 'Internazionale'] as const

export type AmbitoId = (typeof AMBITI)[number]['id']
export type DestinatarioId = (typeof DESTINATARI)[number]['id']
export type Livello = (typeof LIVELLI)[number]

export interface Bando {
  id: string
  titolo: string
  ente: string
  livello: Livello
  ambiti: AmbitoId[]
  destinatari: DestinatarioId[]
  /** Un paragrafo per voce */
  abstract: string[]
  tipologia?: string
  requisiti?: string
  /** Dotazione complessiva in euro. Massimali individuali e importi parziali restano nel testo. */
  dotazioneEuro?: number
  budget?: string
  pubblicazioni?: { wpId: number; titolo: string; slug: string; data: string }[]
  /**
   * scadenza  → domande entro una data (`scadenza` obbligatoria)
   * sportello → domande fino a esaurimento fondi (`chiusoManualmente` quando finiscono)
   * ricorrente → misure sempre attive, es. crediti d'imposta (`noteTermini` obbligatorie)
   */
  modalita: 'scadenza' | 'sportello' | 'ricorrente' | 'informativa' | 'non-documentata' | 'sospesa'
  /** Apertura delle domande, ISO (AAAA-MM-GG oppure AAAA-MM-GGTHH:mm) */
  apertura?: string
  /** Chiusura delle domande, ISO (AAAA-MM-GG oppure AAAA-MM-GGTHH:mm) */
  scadenza?: string
  noteTermini?: string
  /** Per i bandi a sportello quando i fondi sono esauriti */
  chiusoManualmente?: boolean
  coinvolgimentoDih?: string
  /** Pagina ufficiale dell'ente erogatore */
  link?: string
  /** Eventuale approfondimento pubblicato nelle news del sito */
  approfondimento?: string
}

export const BANDI: Bando[] = [
  {
    id: 'investimenti-sostenibili-4-0-2026',
    titolo: 'Investimenti Sostenibili 4.0: 448 milioni per le PMI del Mezzogiorno',
    ente: 'Ministero delle Imprese e del Made in Italy',
    livello: 'Nazionale',
    ambiti: ['digitalizzazione', 'sostenibilita'],
    destinatari: ['micro-piccole', 'medie'],
    abstract: [
      'Il bando finanziava investimenti delle PMI del Mezzogiorno nella trasformazione tecnologica e digitale e nella crescita sostenibile.',
      "Il Ministero delle Imprese e del Made in Italy ha stanziato complessivamente 448 milioni di euro per le PMI di Basilicata, Calabria, Campania, Molise, Puglia, Sicilia e Sardegna nell'ambito del nuovo bando Investimenti Sostenibili 4.0 – 2026.",
      "La presentazione delle domande si è conclusa il 6 ottobre 2026.",
    ],
    tipologia: 'Contributo e finanziamento',
    dotazioneEuro: 448000000,
    budget: '448 milioni di euro',
    modalita: 'scadenza',
    apertura: '2026-10-06T10:00',
    scadenza: '2026-10-06T17:00',
    noteTermini: 'Lo sportello è chiuso dal 7 ottobre 2026 per esaurimento delle risorse.',
    link: 'https://www.invitalia.it/incentivi-e-strumenti/investimenti-sostenibili-40-bando-2026',
    approfondimento: '/news/investimenti-sostenibili-4-0',
  },
  {
    id: 'sviluppo-competenze-secondo-sportello-2026',
    titolo: 'Sviluppo competenze specialistiche delle PMI – Secondo sportello 2026',
    ente: 'Ministero delle Imprese e del Made in Italy',
    livello: 'Nazionale',
    tipologia: 'Formazione',
    ambiti: ['competenze', 'digitalizzazione', 'sostenibilita'],
    destinatari: ['micro-piccole', 'medie'],
    abstract: ['La misura finanzia servizi di formazione per il personale delle PMI del Mezzogiorno. Possono presentare domanda le imprese che non hanno già richiesto le agevolazioni al primo sportello.'],
    dotazioneEuro: 12449676,
    budget: '12.449.676 €, incrementabili con le risorse residue del primo sportello.',
    modalita: 'scadenza',
    apertura: '2026-09-10T12:00',
    scadenza: '2026-12-21T12:00',
    link: 'https://www.invitalia.it/incentivi-e-strumenti/sviluppo-competenze-specialistiche-delle-pmi',
    approfondimento: '/news/sviluppo-competenze-specialistiche',
  },
  ...ARCHIVIO_BANDI,
]

/**
 * Bandi fittizi per vedere filtri, stati e paginazione durante lo sviluppo.
 * Compaiono solo in locale (`npm run dev`) o aggiungendo `?demo` all'URL, mai di default online.
 */
export const BANDI_DEMO: Bando[] = [
  {
    id: 'demo-cyber-resilienza',
    titolo: 'Bando Cyber Resilienza Imprese',
    ente: 'Regione Campania',
    livello: 'Regionale',
    ambiti: ['cybersecurity'],
    destinatari: ['micro-piccole', 'medie'],
    abstract: ['Contenuto di esempio. Contributi per audit di sicurezza, protezione dei dati e formazione del personale.'],
    budget: '5 milioni di euro',
    modalita: 'scadenza',
    apertura: '2026-09-01',
    scadenza: '2026-11-20T12:00',
    coinvolgimentoDih: 'Supporto alla redazione della domanda e cyber assessment preliminare',
    link: 'https://www.regione.campania.it',
  },
  {
    id: 'demo-voucher-digitalizzazione',
    titolo: 'Voucher Digitalizzazione PMI 2026',
    ente: 'Camera di Commercio di Napoli',
    livello: 'Regionale',
    ambiti: ['digitalizzazione', 'competenze'],
    destinatari: ['micro-piccole', 'medie'],
    abstract: ['Contenuto di esempio. Voucher a fondo perduto per software gestionali, e-commerce, cloud e formazione digitale.'],
    budget: '2 milioni di euro',
    modalita: 'scadenza',
    apertura: '2026-10-01',
    scadenza: '2026-12-15',
    link: 'https://www.na.camcom.it',
  },
  {
    id: 'demo-fondo-startup',
    titolo: 'Fondo Innovazione Startup',
    ente: 'Invitalia',
    livello: 'Nazionale',
    ambiti: ['innovazione-ricerca', 'intelligenza-artificiale'],
    destinatari: ['startup'],
    abstract: ['Contenuto di esempio. Finanziamenti agevolati per startup innovative che sviluppano prodotti ad alto contenuto tecnologico.'],
    modalita: 'sportello',
    apertura: '2026-03-01',
    link: 'https://www.invitalia.it',
  },
  {
    id: 'demo-credito-rsi',
    titolo: "Credito d'imposta Ricerca, Sviluppo e Innovazione",
    ente: 'Ministero delle Imprese e del Made in Italy',
    livello: 'Nazionale',
    ambiti: ['innovazione-ricerca', 'digitalizzazione', 'sostenibilita'],
    destinatari: ['micro-piccole', 'medie', 'grandi', 'startup'],
    abstract: ["Contenuto di esempio. Credito d'imposta per attività di ricerca, sviluppo, innovazione tecnologica e design."],
    modalita: 'ricorrente',
    noteTermini: 'in dichiarazione dei redditi',
    link: 'https://www.mimit.gov.it',
  },
  {
    id: 'demo-beni-40',
    titolo: 'Finanziamento agevolato Beni 4.0',
    ente: 'Ministero delle Imprese e del Made in Italy',
    livello: 'Nazionale',
    ambiti: ['digitalizzazione', 'intelligenza-artificiale'],
    destinatari: ['micro-piccole', 'medie'],
    abstract: ['Contenuto di esempio. Finanziamenti per macchinari, impianti e tecnologie digitali 4.0.'],
    modalita: 'scadenza',
    apertura: '2026-06-01',
    scadenza: '2027-03-31',
    link: 'https://www.mimit.gov.it',
  },
  {
    id: 'demo-transizione-green',
    titolo: 'Transizione Green PMI',
    ente: 'Regione Campania',
    livello: 'Regionale',
    ambiti: ['sostenibilita'],
    destinatari: ['micro-piccole', 'medie'],
    abstract: ['Contenuto di esempio. Contributi per efficientamento energetico, rinnovabili e processi produttivi a basso impatto.'],
    budget: '12 milioni di euro',
    modalita: 'scadenza',
    apertura: '2026-12-01',
    scadenza: '2027-02-28',
    link: 'https://www.regione.campania.it',
  },
  {
    id: 'demo-digital-europe',
    titolo: 'Digital Europe – Competenze digitali avanzate',
    ente: 'Commissione Europea',
    livello: 'Europeo',
    ambiti: ['competenze', 'intelligenza-artificiale', 'cybersecurity'],
    destinatari: ['medie', 'grandi'],
    abstract: ['Contenuto di esempio. Progetti di formazione specialistica su AI, cybersecurity e calcolo ad alte prestazioni.'],
    modalita: 'scadenza',
    apertura: '2026-05-01',
    scadenza: '2027-01-20T17:00',
    link: 'https://digital-strategy.ec.europa.eu',
  },
  {
    id: 'demo-ricerca-collaborativa',
    titolo: 'Programma Ricerca Collaborativa 2026',
    ente: 'Ministero dell’Università e della Ricerca',
    livello: 'Nazionale',
    ambiti: ['innovazione-ricerca'],
    destinatari: ['medie', 'grandi'],
    abstract: ['Contenuto di esempio. Progetti di ricerca industriale in partenariato tra imprese e università.'],
    modalita: 'scadenza',
    apertura: '2026-04-01',
    scadenza: '2026-09-30',
    link: 'https://www.mur.gov.it',
  },
  {
    id: 'demo-professionisti-digitali',
    titolo: 'Professionisti Digitali',
    ente: 'Regione Campania',
    livello: 'Regionale',
    ambiti: ['digitalizzazione', 'competenze'],
    destinatari: ['professionisti'],
    abstract: ['Contenuto di esempio. Contributi a liberi professionisti per strumenti digitali e formazione.'],
    modalita: 'scadenza',
    apertura: '2026-02-01',
    scadenza: '2026-07-15',
    link: 'https://www.regione.campania.it',
  },
  {
    id: 'demo-ai-manifattura',
    titolo: 'AI per la manifattura',
    ente: 'Commissione Europea',
    livello: 'Europeo',
    ambiti: ['intelligenza-artificiale', 'innovazione-ricerca'],
    destinatari: ['micro-piccole', 'medie', 'startup'],
    abstract: ["Contenuto di esempio. Cascade funding per sperimentare soluzioni di intelligenza artificiale nei processi produttivi."],
    budget: 'Fino a 60.000 euro per impresa',
    modalita: 'scadenza',
    apertura: '2027-01-15',
    scadenza: '2027-04-15',
    link: 'https://digital-strategy.ec.europa.eu',
  },
]

/* -------------------------------------------------------------------------- */
/* Tre domande per orientarsi (testi provvisori)                              */
/* -------------------------------------------------------------------------- */

export type StatoFiltro = 'tutti' | 'aperti' | 'in-scadenza' | 'in-apertura' | 'attivi' | 'chiusi' | 'informative' | 'incerti' | 'sospesi'

export interface Domanda {
  id: 'ambito' | 'destinatario' | 'tempi'
  titolo: string
  opzioni: { value: string; label: string; hint: string }[]
}

export const DOMANDE: Domanda[] = [
  {
    id: 'ambito',
    titolo: 'Su cosa vuoi investire?',
    opzioni: AMBITI.map((a) => ({ value: a.id, label: a.label, hint: a.hint })),
  },
  {
    id: 'destinatario',
    titolo: 'Che tipo di realtà rappresenti?',
    opzioni: [
      { value: 'micro-piccole', label: 'Micro o piccola impresa', hint: 'Fino a 49 dipendenti' },
      { value: 'medie', label: 'Media impresa', hint: 'Da 50 a 249 dipendenti' },
      { value: 'grandi', label: 'Grande impresa', hint: '250 dipendenti o più' },
      { value: 'startup', label: 'Startup o PMI innovativa', hint: 'Iscritta alla sezione speciale' },
      { value: 'professionisti', label: 'Libero professionista', hint: 'Studi e attività con partita IVA' },
    ],
  },
  {
    id: 'tempi',
    titolo: 'Quando vorresti partire?',
    opzioni: [
      { value: 'aperti', label: 'Il prima possibile', hint: 'Solo bandi già aperti' },
      { value: 'attivi', label: 'Nei prossimi mesi', hint: 'Bandi aperti o in apertura' },
      { value: 'in-apertura', label: 'Voglio prepararmi in anticipo', hint: 'Bandi che apriranno a breve' },
    ],
  },
]
