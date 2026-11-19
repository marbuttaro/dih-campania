import manifest from './infosferaManifest.json'

export type InfosferaIssue = {
  id: string
  label: string
  title: string
  cover: string
  /**
   * Pagine dell'anteprima libera (dalla copertina all'editoriale compreso), in ordine.
   * Le pagine successive non sono pubblicate sul sito: si leggono solo dal PDF completo.
   */
  previewPages: string[]
  pageCount: number
  /** Pagine bianche dell'anteprima (numerate da 1): saltate quando si legge una pagina alla volta */
  blankPages?: number[]
  /** Testo di presentazione mostrato sotto la copertina */
  description?: string
  authors?: { name: string; role: string }[]
}

function preview(id: keyof typeof manifest) {
  const item=manifest[id]
  return { pageCount:item.pages, previewPages:Array.from({length:item.preview},(_,i)=>`/assets/infosfera/numeri/${id}/anteprima/pagina-${String(i+1).padStart(2,'0')}.webp`) }
}

export const LATEST_ISSUE: InfosferaIssue = {
  id: '12',
    ...preview('12'),
  label: 'n. 12 · Anno VII · Ottobre 2026',
  title: 'Intelligenza Artificiale tra opportunità e cambiamenti',
  cover: '/assets/infosfera/numeri/12/copertina.webp',

  blankPages: [2],
}

export const EDITORIAL_TEAM = [
  { role: 'Direttore responsabile', name: 'Edoardo Imperiale' },
  { role: 'Coordinamento editoriale', name: 'Valentina Monarco' },
]


/**
 * Archivio verificato, dal più recente. La voce 2/2024 su PRIDE duplica il PDF
 * di febbraio 2025: una sola scheda per ogni edizione effettiva.
 * Gli originali completi sono serviti esclusivamente dall'API dopo il modulo.
 */
export const PAST_ISSUES: InfosferaIssue[] = [
  {
    id: '11',
    ...preview('11'),
    label: 'N°1/2026',
    title: 'Underwater, supercalcolo e quanti: economie in trasformazione',
    cover: '/assets/infosfera/numeri/11/copertina.webp',

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
    ...preview('10'),
    label: 'N°2/2025',
    title: 'The European Way: Innovation, Sovereignty and Peace',
    cover: '/assets/infosfera/numeri/10/copertina.webp',

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
    ...preview('9'),
    label: 'N°1/2025',
    title: 'Guardiani digitali',
    cover: '/assets/infosfera/numeri/9/copertina.webp',

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
    ...preview('7'),
    label: 'N°1/2024',
    title: 'Il potere della conoscenza: evoluzione del capitale umano',
    cover: '/assets/infosfera/numeri/7/copertina.webp',

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
    ...preview('6'),
    label: 'N°2/2023',
    title: 'Green Tech, sostenibilità e transizione competitiva',
    cover: '/assets/infosfera/numeri/6/copertina.webp',

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
    ...preview('5'),
    label: 'N°1/2023',
    title: 'Driving Innovation(s)',
    cover: '/assets/infosfera/numeri/5/copertina.webp',

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
  {
    id: '4',
    ...preview('4'),
    label: 'N°2/2022',
    title: "Cambiamento d'epoca – Green is Blue: scenari di sostenibilità digitale",
    cover: '/assets/infosfera/numeri/4/copertina.webp',

    description:
      "Esploriamo l'intreccio tra transizione ecologica e trasformazione digitale (twin transition) come risposta alle sfide energetiche, industriali e ambientali del presente. Scopriamo il potenziale trasformativo delle energie pulite (rinnovabili e nucleare), i paradigmi dell'Open Innovation e l'impatto filosofico e sociale dell'intelligenza artificiale e del cloud.",
    authors: [
      { name: 'Franco Bernabè', role: 'Cavaliere del Lavoro' },
      { name: 'Nicola Lanzetta', role: 'Direttore Italia di Enel' },
      { name: 'Umberto Minopoli', role: "Presidente dell'Associazione Nucleare Italiana" },
      { name: 'Anthony Elliott', role: "Sociologo e pensatore sui temi dell'impatto sociale delle nuove tecnologie" },
      { name: 'Henry Chesbrough', role: "Teorico dell'Open Innovation" },
      { name: 'Federico Maffezzoli', role: "Ricercatore dell'Osservatorio Smart Agrifood" },
      { name: 'Silvia Petrone e Marco Pini', role: "Ricercatori dell'Istituto Tagliacarne" },
    ],
  },
  {
    id: '3',
    ...preview('3'),
    label: 'N°1/2022',
    title: 'Tecnologia e innovazione, la forza che unisce',
    cover: '/assets/infosfera/numeri/3/copertina.webp',

    description:
      "Analizziamo l'innovazione e la transizione digitale come leve strategiche e politiche indispensabili per la competitività. Approfondiamo l'internazionalizzazione del Made in Italy, lo stato della ricerca scientifica italiana, le filiere 4.0, la nascita dell'acceleratore Terra Next per la bioeconomia e le nuove frontiere del Fintech.",
    authors: [
      { name: 'Anna Ascani', role: 'Sottosegretario di Stato al Ministero dello Sviluppo Economico' },
      { name: 'Mauro Alfonso', role: 'Amministratore Delegato e Direttore Generale di SIMEST' },
      { name: 'Carlo Ferro', role: "Presidente dell'Agenzia ICE" },
      { name: 'Nicola Lener', role: "Ambasciatore d'Italia negli Emirati Arabi Uniti" },
      {
        name: 'Doris Messina',
        role: 'Chief Digital Transformation Officer di Banca Sella e co-founder del Fintech District',
      },
      { name: 'Francesca Bria', role: 'Presidente di CDP Venture Capital' },
      { name: 'Riccardo Porro', role: 'Chief Operating Officer di Cariplo Factory' },
    ],
  },
  {
    id: '2',
    ...preview('2'),
    label: 'N°2/2021',
    title: 'La forza magnetica della città',
    cover: '/assets/infosfera/numeri/2/copertina.webp',

    description:
      'Affrontiamo il ripensamento del paradigma urbano e delle smart city nell\'era della transizione digitale ed ecologica. Analizziamo i modelli di sviluppo delle grandi metropoli globali, unendo le potenzialità delle nuove tecnologie (5G, IoT, intelligenza artificiale) con la sostenibilità ambientale e la centralità del capitale umano.',
    authors: [
      { name: 'Maria Cristina Messa', role: "Ministro dell'Università e della Ricerca" },
      {
        name: 'Carlo Robiglio',
        role: 'Presidente di Piccola Industria Confindustria e Vicepresidente di Confindustria',
      },
      {
        name: 'Carlo Ratti',
        role: 'Architetto, ingegnere e direttore del Senseable City Lab presso il MIT di Boston',
      },
      { name: 'Juhana Mikael Vartiainen', role: 'Sindaco di Helsinki' },
      { name: 'Alison Gilliland', role: 'Sindaca di Dublino (Lord Mayor)' },
    ],
  },
  {
    id: '1',
    ...preview('1'),
    label: 'N°1/2021',
    title: 'Aumentare il futuro',
    cover: '/assets/infosfera/numeri/1/copertina.webp',

    description:
      "Affrontiamo il tema della transizione digitale e culturale delle PMI italiane verso l'Industria 4.0 e la preparazione all'Industria 5.0, con un forte focus sul ruolo strategico del Mezzogiorno, del PNRR, del capitale umano e della sicurezza informatica.",
    authors: [
      { name: 'David Weinberger', role: "Tecnologo e filosofo dell'informazione" },
      { name: 'Marco Taisch', role: 'Presidente Competence Center MADE' },
      { name: 'Gianluigi Viscardi', role: 'Presidente Rete Nazionale DIH Confindustria' },
      { name: 'Paolo Rostirolla ed Enrico Mercadante', role: 'Leonardo e Cisco' },
      { name: 'Paolo Prinetto', role: 'Laboratorio CINI Cybersecurity' },
    ],
  },
  {
    id: '0',
    ...preview('0'),
    label: 'N°1/2020',
    title: 'Perché il digitale è un destino',
    cover: '/assets/infosfera/numeri/0/copertina.webp',

    description:
      "Il numero d'esordio del magazine esplora la pervasività della rivoluzione digitale e dell'Industria 4.0, mostrando come l'innovazione tecnologica, l'intelligenza artificiale e la robotica non siano opzioni accessorie, ma leve strategiche indispensabili per la competitività delle imprese.",
    authors: [
      { name: 'Luigi Nicolais', role: 'Presidente Campania Digital Innovation Hub' },
      { name: 'Elio Catania', role: 'Consigliere per la politica industriale del MISE' },
      {
        name: 'Andrea Bianchi',
        role: 'Responsabile pianificazione strategica e politiche industriali di Invitalia',
      },
      { name: 'Luciano Floridi', role: "Professore di Filosofia ed Etica dell'informazione all'Università di Oxford" },
      { name: 'Piero Salatino', role: 'Presidente MedITech e Preside Scuola Politecnica Federico II' },
      { name: 'Bruno Siciliano', role: "Ordinario di Controlli e Robotica all'Università Federico II" },
    ],
  },
]
