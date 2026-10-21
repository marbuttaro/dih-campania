import type { ReactNode } from 'react'
import { ExternalLink, Heading } from './ArticleParts'

export interface NewsArticle {
  slug: string
  /** Plain title, used in the ticker, the sidebar and the browser tab */
  title: string
  /** Part of the title shown in bold on the article page */
  titleHighlight?: string
  /** Starts the highlighted part on a new line (from tablet up) */
  breakBeforeHighlight?: boolean
  date: string
  image: string
  /** Paragraphs shown above the image */
  intro: ReactNode
  /** Content shown below the image */
  body: ReactNode
}

export const newsUrl = (slug: string) => `/news/${slug}`

export const NEWS: NewsArticle[] = [
  {
    slug: 'investimenti-sostenibili-4-0',
    title: 'Investimenti Sostenibili 4.0: 448 milioni per le PMI del Mezzogiorno',
    titleHighlight: '448 milioni',
    breakBeforeHighlight: true,
    date: '19 ottobre 2026',
    image: '/assets/news/foto.jpg',
    intro: (
      <>
        <p>
          Dal 10 settembre è possibile compilare le domande. L'invio partirà il 6 ottobre 2026. Per la Campania disponibili nuove risorse per sostenere investimenti digitali, tecnologici e sostenibili.
          <br />
          Le PMI della Campania hanno a disposizione una nuova opportunità per finanziare programmi di investimento finalizzati alla trasformazione tecnologica e digitale, alla crescita sostenibile e al rafforzamento della competitività.
        </p>
        <p>
          Il Ministero delle Imprese e del Made in Italy ha stanziato complessivamente 448 milioni di euro per le PMI di Basilicata, Calabria, Campania, Molise, Puglia, Sicilia e Sardegna nell'ambito del nuovo bando Investimenti Sostenibili 4.0 – 2026.
        </p>
      </>
    ),
    body: (
      <>
        <section>
          <Heading>Cosa finanzia</Heading>
          <p>
            Sono agevolabili programmi di investimento con un valore compreso tra 750.000 euro e 5 milioni di euro, destinati all'acquisto di macchinari, impianti, attrezzature, software e licenze, oltre ad alcune tipologie di opere murarie e servizi di consulenza.
            <br />
            Tra le tecnologie e gli ambiti di investimento rientrano, tra gli altri, cloud, Internet of Things, cybersecurity, big data e analytics, intelligenza artificiale, automazione, additive manufacturing, realtà aumentata e sistemi di integrazione digitale dei processi produttivi. Particolare attenzione viene inoltre riservata ai progetti capaci di migliorare l'efficienza energetica, favorire l'economia circolare e ridurre l'impatto ambientale.
          </p>
        </section>
        <section>
          <Heading>Quanto finanzia</Heading>
          <p>
            Le agevolazioni possono coprire fino al 75% delle spese ammissibili, attraverso una combinazione di contributo a fondo perduto e finanziamento agevolato a tasso zero.
          </p>
        </section>
        <section>
          <Heading>Come presentare la domanda</Heading>
          <p>
            La compilazione della domanda sarà possibile dalle ore 12.00 del 10 settembre 2026, mentre l'invio delle domande sarà aperto dalle ore 12.00 del 6 ottobre 2026.
            <br />
            La procedura è interamente telematica e viene gestita da Invitalia. Per presentare la domanda l'impresa deve disporre di SPID, CIE o CNS, firma digitale e PEC. La misura prevede una procedura a sportello: le domande vengono quindi esaminate secondo l'ordine previsto dalla procedura di presentazione.
          </p>
        </section>
        <section>
          <p className="font-medium">Consulta il bando e verifica requisiti, spese ammissibili e modalità di partecipazione:</p>
          <ul className="links">
            <li>
              <ExternalLink href="https://www.mimit.gov.it/it/incentivi/investimenti-sostenibili-4-0-2026">
                Scheda ufficiale MIMIT – Investimenti Sostenibili 4.0 2026
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.invitalia.it/incentivi-e-strumenti/invsos26/presenta-la-domanda">
                Presenta la domanda – Invitalia
              </ExternalLink>
            </li>
          </ul>
        </section>
        <p className="font-semibold">
          È inoltre disponibile la guida interattiva alla compilazione della domanda predisposta da Invitalia, utile per prendere confidenza con la procedura prima dell'apertura dello sportello.
        </p>
        <p className="italic font-medium">
          Per maggiori informazioni:{' '}
          <ExternalLink href="https://www.mimit.gov.it/it/notizie-stampa/investimenti-sostenibili-4-0-definiti-termini-e-modalita-di-presentazione-delle-domande">
            sito web MIMIT
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    slug: 'sviluppo-competenze-specialistiche',
    title: 'Sviluppo competenze specialistiche: dal 10 settembre nuovi incentivi per le PMI del Mezzogiorno',
    titleHighlight: 'nuovi incentivi',
    date: '19 ottobre 2026',
    image: '/assets/news/foto.jpg',
    intro: (
      <>
        <p>
          Apre il 10 settembre il nuovo sportello per sostenere la formazione del personale delle PMI su innovazione, tecnologie digitali e transizione verde. Domande fino al 21 dicembre 2026.
          <br />
          Le PMI della Campania e delle altre regioni del Mezzogiorno possono accedere a un nuovo incentivo destinato a rafforzare le competenze specialistiche del personale dipendente e accompagnare le imprese nei processi di innovazione e transizione digitale e verde.
        </p>
        <p>
          La misura, promossa dal Ministero delle Imprese e del Made in Italy e gestita da Invitalia, dispone complessivamente di 50 milioni di euro e finanzia progetti di formazione rivolti ai dipendenti delle PMI di Basilicata, Calabria, Campania, Molise, Puglia, Sardegna e Sicilia.
        </p>
      </>
    ),
    body: (
      <>
        <section>
          <Heading>Cosa finanzia</Heading>
          <p>
            I progetti possono riguardare, tra gli altri, digitalizzazione e tecnologie digitali, innovazione tecnologica, processi di transizione verde, tecnologie pulite ed efficienti, industria intelligente e sostenibile, agenda digitale e smart communities.
            <br />
            È previsto un contributo pari al 50% delle spese ammissibili. I progetti possono essere presentati dalla singola PMI oppure nell'ambito di progetti integrati sovraregionali, secondo le modalità previste dalla misura.
          </p>
        </section>
        <section>
          <Heading>Chi può partecipare</Heading>
          <p>
            Possono accedere le PMI con sede nel Mezzogiorno in possesso dei requisiti previsti dalla normativa, tra cui l'iscrizione al Registro delle imprese e almeno un bilancio approvato e depositato.
            <br />
            I percorsi formativi devono essere realizzati da soggetti qualificati e indipendenti e possono avere una durata massima di un anno.
          </p>
        </section>
        <section>
          <Heading>Come presentare la domanda</Heading>
          <p>
            Il secondo sportello è aperto dalle ore 12.00 del 10 settembre 2026 alle ore 12.00 del 21 dicembre 2026, salvo esaurimento delle risorse disponibili.
            <br />
            La domanda deve essere presentata online attraverso la piattaforma di Invitalia. Prima della presentazione, le imprese italiane devono registrarsi nell'area dedicata e indicare, se previsto, un eventuale delegato.
          </p>
        </section>
        <section>
          <p className="font-medium">Dove trovare informazioni e presentare la domanda:</p>
          <ul className="links">
            <li>
              <ExternalLink href="https://www.invitalia.it/incentivi-e-strumenti/sviluppo-competenze-specialistiche-delle-pmi">
                Scheda ufficiale della misura – Invitalia
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.invitalia.it/incentivi-e-strumenti/sviluppo-competenze-specialistiche-delle-pmi/presenta-la-domanda">
                Presenta la domanda – Invitalia
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.mimit.gov.it/it/incentivi/sviluppo-competenze">
                Sviluppo competenze – MIMIT
              </ExternalLink>
            </li>
          </ul>
        </section>
        <p className="font-semibold">
          Le pagine ufficiali contengono anche guida alla registrazione, guida alla presentazione della domanda, modulistica, normativa e FAQ.
        </p>
        <p className="italic font-medium">
          Per maggiori informazioni consultare i siti web del MIMIT e di Invitalia.
        </p>
      </>
    ),
  },
  {
    slug: 'voucher-cloud-cybersecurity',
    title: 'Voucher Cloud & Cybersecurity: 150 milioni di euro per la digitalizzazione delle PMI',
    titleHighlight: '150 milioni di euro',
    date: '19 ottobre 2026',
    image: '/assets/news/foto.jpg',
    intro: (
      <>
        <p>
          Contributi fino a 20.000 euro per acquistare soluzioni cloud e rafforzare la sicurezza informatica. Domande dal 10 novembre 2026.
        </p>
        <p className="font-semibold">
          Prima di compilare la domanda{' '}
          <a href="/#contatti">contattaci</a>, numerosi nostri partner sono nell’
          <ExternalLink href="https://vcc-elencofornitori.npi.invitalia.it/">elenco dei fornitori e dei prodotti ammessi</ExternalLink>.
        </p>
        <p>
          Il <strong>Voucher Cloud &amp; Cybersecurity</strong> sostiene le piccole e medie imprese e i lavoratori autonomi che investono in tecnologie digitali nuove o più avanzate e sicure rispetto a quelle già utilizzate. La misura è promossa dal <strong>Ministero delle Imprese e del Made in Italy (MIMIT)</strong> ed è finanziata con <strong>150 milioni di euro</strong> del Fondo sviluppo e coesione. Di questi, circa <strong>71 milioni di euro</strong> sono riservati ai piani di spesa realizzati in Abruzzo, Basilicata, Calabria, Campania, Molise, Puglia, Sardegna e Sicilia.
        </p>
      </>
    ),
    body: (
      <>
        <section>
          <Heading>Chi può richiedere il voucher</Heading>
          <p>
            Possono presentare domanda le <strong>PMI e i lavoratori autonomi</strong> che operano in Italia e possiedono i requisiti previsti dal bando. Al momento della domanda devono disporre di un contratto di connettività con velocità di download di almeno <strong>30 Mbps</strong>. Ogni richiedente può presentare <strong>una sola domanda</strong>.
          </p>
        </section>
        <section>
          <Heading>Quanto finanzia e come viene erogato</Heading>
          <p>
            L’agevolazione è un <strong>contributo a fondo perduto fino al 50% delle spese ammissibili</strong>, per un massimo di <strong>20.000 euro</strong> per beneficiario. Il piano di spesa deve avere un valore di almeno <strong>4.000 euro</strong>. Il contributo è concesso nel rispetto delle regole de minimis ed è erogato, su richiesta del beneficiario, in <strong>due quote</strong> oppure in <strong>un’unica quota</strong> al completamento del piano. La prima richiesta di erogazione può essere presentata non prima di tre mesi dalla comunicazione della concessione.
          </p>
        </section>
        <section>
          <Heading>Cosa finanzia</Heading>
          <p>
            Sono ammissibili prodotti e servizi acquistati da <strong>fornitori presenti nell’elenco ufficiale MIMIT</strong>, tra cui:
          </p>
          <ul className="bullets">
            <li><strong>Cybersecurity:</strong> firewall, dispositivi di protezione delle reti, antivirus, antimalware, crittografia, monitoraggio e gestione delle vulnerabilità.</li>
            <li><strong>Cloud infrastrutturale e di piattaforma:</strong> macchine virtuali, archiviazione, backup, database e servizi di sicurezza di rete.</li>
            <li><strong>Software cloud:</strong> strumenti per contabilità, gestione del personale, produttività e processi aziendali, e-commerce e gestione dei clienti.</li>
            <li><strong>Servizi collegati:</strong> configurazione, monitoraggio e supporto continuativo, entro il limite del 30% del piano di spesa.</li>
          </ul>
          <p>
            I prodotti e i servizi possono essere acquisiti con acquisto diretto, abbonamento o una combinazione delle due modalità. L’investimento deve introdurre soluzioni nuove o un miglioramento sostanziale: la semplice estensione di licenze o utenze già in uso non è finanziabile.
          </p>
        </section>
        <section>
          <Heading>Come presentare la domanda</Heading>
          <p>La procedura prevede <strong>due fasi</strong>:</p>
          <ol className="steps">
            <li>Precompilazione della domanda dalle ore 12:00 del 20 ottobre 2026.</li>
            <li>Invio formale dalle ore 12:00 del 10 novembre 2026 alle ore 12:00 del 20 gennaio 2027, salvo chiusura anticipata per esaurimento delle risorse.</li>
          </ol>
          <p>
            La domanda si presenta <strong>esclusivamente online</strong>, tramite la procedura informatica indicata nella{' '}
            <ExternalLink href="https://www.mimit.gov.it/it/incentivi/sostegno-alla-domanda-di-servizi-di-cloud-computing-e-cyber-security">
              pagina ufficiale del Voucher Cloud &amp; Cybersecurity sul sito MIMIT
            </ExternalLink>
            . L’accesso richiede <strong>SPID, Carta d’identità elettronica (CIE) o Carta nazionale dei servizi (CNS)</strong> ed è riservato al rappresentante legale o a un delegato.
          </p>
          <p>
            Le domande sono avviate all’istruttoria <strong>in ordine cronologico di presentazione</strong>.
          </p>
        </section>
      </>
    ),
  },
]
