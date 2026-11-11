import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Plus, RotateCcw, Search } from 'lucide-react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { cn } from '@/lib/utils'
import {
  AMBITI,
  BANDI,
  BANDI_DEMO,
  CATALOGO_AGGIORNATO_AL,
  DESTINATARI,
  DOMANDE,
  LIVELLI,
  type AmbitoId,
  type Bando,
  type DestinatarioId,
  type Livello,
  type StatoFiltro,
} from './bandiData'
import {
  FILTRI_VUOTI,
  STATO_LABEL,
  filtraBandi,
  formatData,
  ordinaBandi,
  statoBando,
  testoScadenza,
  type Filtri,
  type Stato,
} from './bandiUtils'

const PER_PAGINA = 9
const CONSULENZA_HREF = '/#contatti'

// I bandi di esempio servono solo a vedere la struttura: in locale o con ?demo nell'URL
const DEMO = import.meta.env.DEV || new URLSearchParams(window.location.search).has('demo')
const CATALOGO: Bando[] = DEMO ? [...BANDI, ...BANDI_DEMO] : BANDI

const STATI_FILTRO: { value: StatoFiltro; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'attivi', label: 'Aperti o in apertura' },
  { value: 'aperti', label: 'Aperti' },
  { value: 'in-scadenza', label: 'In scadenza' },
  { value: 'in-apertura', label: 'In apertura' },
  { value: 'chiusi', label: 'Chiusi' },
]

const GLASS_PANEL =
  'rounded-[20px] bg-[rgba(227,234,236,0.55)] backdrop-blur-md border border-white/70 shadow-[-7px_-7px_18px_rgba(255,255,255,0.9),12px_12px_42px_rgba(164,177,188,0.75)]'

const NEUMORPHIC_BUTTON =
  'inline-flex items-center justify-center rounded-lg bg-brand-ice text-brand-navy shadow-[-4px_-4px_10px_rgba(255,255,255,0.9),6px_6px_16px_rgba(164,177,188,0.7)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer'

const ambitoLabel = (id: AmbitoId) => AMBITI.find((a) => a.id === id)?.label ?? id
const destinatarioLabel = (id: DestinatarioId) => DESTINATARI.find((d) => d.id === id)?.label ?? id

/* -------------------------------------------------------------------------- */
/* Filtri ↔ URL: /bandi?ambito=cybersecurity&stato=aperti è condivisibile      */
/* -------------------------------------------------------------------------- */

function filtriDaUrl(): Filtri {
  const p = new URLSearchParams(window.location.search)
  const ambito = p.get('ambito')
  const destinatario = p.get('destinatari')
  const stato = p.get('stato')
  const livello = p.get('livello')
  return {
    testo: p.get('q') ?? '',
    ambito: AMBITI.some((a) => a.id === ambito) ? (ambito as AmbitoId) : '',
    destinatario: DESTINATARI.some((d) => d.id === destinatario) ? (destinatario as DestinatarioId) : '',
    stato: STATI_FILTRO.some((s) => s.value === stato) ? (stato as StatoFiltro) : 'tutti',
    livello: LIVELLI.includes(livello as Livello) ? (livello as Livello) : '',
  }
}

function scriviFiltriInUrl(f: Filtri) {
  const p = new URLSearchParams(window.location.search)
  const set = (k: string, v: string, vuoto = '') => (v && v !== vuoto ? p.set(k, v) : p.delete(k))
  set('q', f.testo.trim())
  set('ambito', f.ambito)
  set('destinatari', f.destinatario)
  set('stato', f.stato, 'tutti')
  set('livello', f.livello)
  const qs = p.toString()
  window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`)
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

function Hero({ oggi }: { oggi: Date }) {
  const attivi = CATALOGO.filter((b) => statoBando(b, oggi) !== 'chiuso').length

  return (
    <section className="relative overflow-hidden rounded-b-[30px] bg-[url('/assets/sfondo_form.png')] bg-cover bg-center text-white pt-36 sm:pt-44 pb-16 sm:pb-20">
      <div className="container-page grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-16 items-end">
        <div className="reveal-element">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-light text-brand-light-blue leading-[1.12] tracking-tight">
            Bandi e opportunità
            <br /> per innovare
          </h1>
          <p className="mt-6 text-sm sm:text-base text-brand-light-blue/85 leading-relaxed max-w-[520px]">
            Selezioniamo i bandi di enti pubblici e privati per digitalizzazione, cybersecurity, innovazione,
            ricerca e sostenibilità. Li riassumiamo in modo chiaro e ti aiutiamo a capire se fanno per la tua
            realtà.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={CONSULENZA_HREF}
              className="inline-flex items-center rounded-[8.6px] border border-white/40 bg-brand-dark-navy/50 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-brand-light-blue hover:text-brand-dark-navy hover:-translate-y-0.5 no-underline"
            >
              Richiedi una consulenza
            </a>
            <a
              href="#catalogo"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('catalogo')
              }}
              className="inline-flex items-center rounded-[8.6px] border border-white/40 bg-brand-light-blue/80 px-5 py-2.5 text-sm font-semibold text-brand-dark-navy shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white hover:-translate-y-0.5 no-underline"
            >
              Esplora tutti i bandi
            </a>
          </div>
        </div>

        <div className="reveal-element reveal-delay-200 lg:justify-self-end lg:max-w-[400px] border-l border-white/30 pl-6 py-2 text-white/90">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
            Catalogo aggiornato al {formatData(CATALOGO_AGGIORNATO_AL)}
          </p>
          <p className="mt-3 text-sm">
            <strong className="font-semibold text-white">
              {CATALOGO.length} {CATALOGO.length === 1 ? 'bando' : 'bandi'}
            </strong>{' '}
            in catalogo · <strong className="font-semibold text-white">{attivi}</strong>{' '}
            {attivi === 1 ? 'aperto o in apertura' : 'aperti o in apertura'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Ogni bando riporta sintesi, requisiti, budget e link alla fonte ufficiale.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Tre domande per orientarsi                                                  */
/* -------------------------------------------------------------------------- */

type Risposte = Partial<Record<(typeof DOMANDE)[number]['id'], string>>

function filtriDaRisposte(r: Risposte): Filtri {
  return {
    ...FILTRI_VUOTI,
    ambito: (r.ambito as AmbitoId) ?? '',
    destinatario: (r.destinatario as DestinatarioId) ?? '',
    stato: (r.tempi as StatoFiltro) ?? 'attivi',
  }
}

function Orientamento({ oggi, onApplica }: { oggi: Date; onApplica: (f: Filtri) => void }) {
  const [step, setStep] = useState(0)
  const [risposte, setRisposte] = useState<Risposte>({})
  const inTransizione = useRef(false)
  const finito = step >= DOMANDE.length
  const domanda = DOMANDE[Math.min(step, DOMANDE.length - 1)]
  const risultati = finito ? filtraBandi(CATALOGO, filtriDaRisposte(risposte), oggi).length : 0

  const rispondi = (value: string | undefined) => {
    if (inTransizione.current) return
    inTransizione.current = true
    setRisposte((r) => ({ ...r, [domanda.id]: value }))
    // Piccola pausa per far vedere la selezione prima di passare alla domanda successiva
    window.setTimeout(
      () => {
        setStep((s) => s + 1)
        inTransizione.current = false
      },
      value ? 220 : 0,
    )
  }

  const ricomincia = () => {
    setRisposte({})
    setStep(0)
  }

  return (
    <section id="orientamento" className="container-page relative z-10 -mt-6 sm:-mt-4 scroll-mt-28">
      <div className={cn(GLASS_PANEL, 'grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 px-6 py-9 sm:px-12 sm:py-12 reveal-element')}>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl sm:text-[1.65rem] font-semibold text-brand-navy leading-tight">
            Troviamo insieme le opportunità più adatte a te
          </h2>
          <p className="mt-3 text-sm text-brand-dark-navy/75 leading-relaxed">
            Tre domande, un clic per risposta.
            <br /> Puoi fermarti quando vuoi.
          </p>
          <div className="mt-7 pt-7 border-t border-brand-navy/10">
            <button
              type="button"
              onClick={() => {
                onApplica(FILTRI_VUOTI)
                scrollTo('catalogo')
              }}
              className={cn(NEUMORPHIC_BUTTON, 'px-5 py-2.5 text-sm font-semibold')}
            >
              Preferisco vedere tutti i bandi
            </button>
          </div>
        </div>

        <div aria-live="polite">
          {!finito ? (
            <div key={domanda.id} role="group" aria-labelledby={`domanda-${domanda.id}`}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-brand-dark-navy">
                  {step + 1} di {DOMANDE.length}
                </span>
                <div className="flex gap-1.5" aria-hidden>
                  {DOMANDE.map((d, i) => (
                    <span
                      key={d.id}
                      className={cn(
                        'h-1 w-7 rounded-full transition-colors duration-300',
                        i <= step ? 'bg-[#6fa3dd]' : 'bg-brand-navy/10',
                      )}
                    />
                  ))}
                </div>
              </div>
              <h3 id={`domanda-${domanda.id}`} className="mt-4 text-xl sm:text-[1.4rem] font-medium text-brand-dark-navy">
                {domanda.titolo}
              </h3>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {domanda.opzioni.map((opzione) => {
                  const selezionata = risposte[domanda.id] === opzione.value
                  return (
                    <button
                      key={opzione.value}
                      type="button"
                      aria-pressed={selezionata}
                      onClick={() => rispondi(opzione.value)}
                      className={cn(
                        'group flex items-start gap-3 rounded-[10px] border px-4 py-3 text-left transition-all duration-300 cursor-pointer',
                        'bg-white/70 shadow-[0_6px_18px_rgba(1,49,103,0.10)] hover:-translate-y-0.5 hover:bg-white',
                        selezionata ? 'border-[#6fa3dd] bg-white' : 'border-white',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                          selezionata ? 'border-brand-navy bg-brand-navy' : 'border-brand-navy/30 group-hover:border-brand-navy/60',
                        )}
                      >
                        {selezionata && <Check className="size-2.5 text-white" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-brand-navy">{opzione.label}</span>
                        <span className="block mt-0.5 text-xs text-brand-navy/70 leading-snug">{opzione.hint}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy/70 hover:text-brand-navy cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" /> Indietro
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => rispondi(undefined)}
                  className="text-xs font-semibold text-brand-dark-navy hover:text-brand-navy underline-offset-4 hover:underline cursor-pointer"
                >
                  Salta questa domanda
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6fa3dd]">Le tue risposte</p>
              <h3 className="mt-3 text-xl sm:text-[1.4rem] font-medium text-brand-dark-navy">
                {risultati === 0
                  ? 'Al momento nessun bando corrisponde alle tue risposte'
                  : risultati === 1
                    ? 'Abbiamo trovato 1 bando per te'
                    : `Abbiamo trovato ${risultati} bandi per te`}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {DOMANDE.map((d) => {
                  const scelta = d.opzioni.find((o) => o.value === risposte[d.id])
                  return (
                    <li key={d.id} className="rounded-full bg-white/70 border border-white px-3 py-1 text-xs text-brand-navy">
                      {scelta?.label ?? 'Qualsiasi'}
                    </li>
                  )
                })}
              </ul>
              <p className="mt-4 text-sm text-brand-dark-navy/75 leading-relaxed max-w-[520px]">
                {risultati === 0
                  ? 'Nuovi bandi vengono aggiunti di continuo. Raccontaci il tuo progetto: ti segnaliamo noi le opportunità in arrivo.'
                  : 'Verifica i dettagli di ciascun bando o chiedi ai nostri consulenti se la tua impresa ha i requisiti.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {risultati > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      onApplica(filtriDaRisposte(risposte))
                      scrollTo('catalogo')
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-navy to-[#0b4a86] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(1,49,103,0.35)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  >
                    Vedi i bandi <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <a
                    href={CONSULENZA_HREF}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-navy to-[#0b4a86] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(1,49,103,0.35)] transition-all duration-300 hover:-translate-y-0.5 no-underline"
                  >
                    Chiedi una consulenza <ArrowRight className="size-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={ricomincia}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy/70 hover:text-brand-navy cursor-pointer"
                >
                  <RotateCcw className="size-3.5" /> Ricomincia
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Catalogo                                                                    */
/* -------------------------------------------------------------------------- */

function SelectFiltro<T extends string>({
  id,
  label,
  value,
  onChange,
  opzioni,
}: {
  id: string
  label: string
  value: T
  onChange: (v: T) => void
  opzioni: { value: T; label: string }[]
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-brand-navy">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none rounded-md border border-white/80 bg-white/60 px-3.5 py-2.5 pr-9 text-sm text-brand-dark-navy focus:outline-none focus:ring-2 focus:ring-brand-light-blue cursor-pointer"
        >
          {opzioni.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-navy/60" />
      </div>
    </div>
  )
}

const BADGE: Record<Stato, string> = {
  'in-scadenza': 'bg-brand-dark-navy text-white',
  aperto: 'bg-brand-pale-blue text-brand-navy',
  'in-apertura': 'border border-dashed border-brand-dark-navy/60 text-brand-dark-navy',
  chiuso: 'bg-brand-ice text-brand-dark-navy/50',
}

function BandoCard({ bando, oggi }: { bando: Bando; oggi: Date }) {
  const [aperto, setAperto] = useState(false)
  const stato = statoBando(bando, oggi)
  const chiuso = stato === 'chiuso'
  const scadenza = testoScadenza(bando, oggi)
  const dettagliId = `dettagli-${bando.id}`

  const voci: [string, string | undefined][] = [
    ['Ente erogatore', bando.ente],
    ['Livello', bando.livello],
    ['Ambiti', bando.ambiti.map(ambitoLabel).join(', ')],
    ['Destinatari', bando.destinatari.map(destinatarioLabel).join(', ')],
    ['Budget', bando.budget],
    ['Termini', bando.noteTermini && bando.modalita !== 'ricorrente' ? bando.noteTermini : undefined],
    ['Il supporto del DIH', bando.coinvolgimentoDih],
  ]

  return (
    <article
      className={cn(
        'flex flex-col rounded-[10px] border px-5 pt-4 pb-4 transition-shadow duration-300',
        chiuso
          ? 'bg-white/45 border-white/70 shadow-[0_6px_20px_rgba(1,49,103,0.06)]'
          : 'bg-white border-white shadow-[0_10px_30px_rgba(1,49,103,0.10)] hover:shadow-[0_14px_36px_rgba(1,49,103,0.16)]',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none', BADGE[stato])}>
          {STATO_LABEL[stato]}
        </span>
        <button
          type="button"
          onClick={() => setAperto((v) => !v)}
          aria-expanded={aperto}
          aria-controls={dettagliId}
          aria-label={aperto ? `Chiudi i dettagli di ${bando.titolo}` : `Apri i dettagli di ${bando.titolo}`}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-brand-dark-navy/25 bg-white text-brand-dark-navy transition-all duration-300 hover:border-brand-navy hover:bg-brand-ice cursor-pointer"
        >
          <Plus className={cn('size-3.5 transition-transform duration-300', aperto && 'rotate-45')} strokeWidth={2.5} />
        </button>
      </div>

      <h3
        className={cn(
          'mt-3 text-[15px] sm:text-base font-semibold leading-snug',
          chiuso ? 'text-brand-dark-navy/60' : 'text-brand-dark-navy',
        )}
      >
        {bando.titolo}
      </h3>

      <div id={dettagliId} hidden={!aperto} className="mt-3 text-sm text-brand-dark-navy/80 leading-relaxed">
        {bando.abstract.map((p) => (
          <p key={p} className="mb-2 last:mb-0">
            {p}
          </p>
        ))}
        <dl className="mt-4 space-y-2 text-[13px]">
          {voci
            .filter((v): v is [string, string] => Boolean(v[1]))
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-dark-navy/50">{k}</dt>
                <dd className="text-brand-dark-navy">{v}</dd>
              </div>
            ))}
        </dl>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href={bando.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-navy to-[#0b4a86] px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(1,49,103,0.3)] transition-all duration-300 hover:-translate-y-0.5 no-underline"
          >
            Vai al sito dell'ente <ArrowUpRight className="size-3.5" />
          </a>
          {!chiuso && (
            <a
              href={CONSULENZA_HREF}
              className="inline-flex items-center rounded-lg bg-brand-ice px-4 py-2 text-xs font-semibold text-brand-dark-navy shadow-[0_4px_10px_rgba(1,49,103,0.15)] transition-all duration-300 hover:-translate-y-0.5 no-underline"
            >
              Chiedi una consulenza
            </a>
          )}
        </div>
        {bando.approfondimento && (
          <a
            href={bando.approfondimento}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline underline-offset-4"
          >
            Leggi l'approfondimento nelle news <ArrowRight className="size-3" />
          </a>
        )}
      </div>

      <div className="mt-auto pt-4">
        <div className="border-t border-brand-dark-navy/10 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-dark-navy/60">Scadenza</p>
          <p className={cn('mt-0.5 text-sm', chiuso ? 'text-brand-dark-navy/55' : 'text-brand-dark-navy')}>
            <strong className="font-semibold">{scadenza.principale}</strong>
            {scadenza.dettaglio && <span className="ml-1.5 text-xs text-brand-dark-navy/60">{scadenza.dettaglio}</span>}
          </p>
        </div>
      </div>
    </article>
  )
}

function Paginazione({ pagina, totale, onCambia }: { pagina: number; totale: number; onCambia: (p: number) => void }) {
  if (totale <= 1) return null

  // Prima, ultima e le pagine vicine a quella corrente; i salti diventano "…"
  const pagine = Array.from({ length: totale }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totale || Math.abs(p - pagina) <= 1,
  )

  return (
    <nav aria-label="Paginazione bandi" className="mt-12 flex items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={() => onCambia(pagina - 1)}
        disabled={pagina === 1}
        aria-label="Pagina precedente"
        className={cn(NEUMORPHIC_BUTTON, 'size-11 text-[#6fa3dd] disabled:opacity-40 disabled:pointer-events-none')}
      >
        <ArrowLeft className="size-5" />
      </button>
      {pagine.map((p, i) => (
        <span key={p} className="flex items-center gap-3 sm:gap-4">
          {i > 0 && p - pagine[i - 1] > 1 && <span className="text-sm text-brand-navy">…</span>}
          <button
            type="button"
            onClick={() => onCambia(p)}
            aria-current={p === pagina ? 'page' : undefined}
            className={cn(
              'text-2xl font-normal transition-colors cursor-pointer',
              p === pagina ? 'text-[#6fa3dd] font-light' : 'text-brand-navy hover:text-[#6fa3dd]',
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onCambia(pagina + 1)}
        disabled={pagina === totale}
        aria-label="Pagina successiva"
        className={cn(NEUMORPHIC_BUTTON, 'size-11 text-[#6fa3dd] disabled:opacity-40 disabled:pointer-events-none')}
      >
        <ArrowRight className="size-5" />
      </button>
    </nav>
  )
}

function Catalogo({
  oggi,
  filtri,
  setFiltri,
}: {
  oggi: Date
  filtri: Filtri
  setFiltri: (f: Filtri) => void
}) {
  // La pagina corrente vale solo per i filtri con cui è stata scelta: nuovi filtri = pagina 1
  const [scelta, setScelta] = useState({ filtri, pagina: 1 })
  const pagina = scelta.filtri === filtri ? scelta.pagina : 1
  const gridRef = useRef<HTMLDivElement>(null)

  const risultati = useMemo(() => ordinaBandi(filtraBandi(CATALOGO, filtri, oggi), oggi), [filtri, oggi])
  const totalePagine = Math.max(1, Math.ceil(risultati.length / PER_PAGINA))
  const visibili = risultati.slice((pagina - 1) * PER_PAGINA, pagina * PER_PAGINA)
  const filtriAttivi = JSON.stringify(filtri) !== JSON.stringify(FILTRI_VUOTI)

  const aggiorna = (parziale: Partial<Filtri>) => setFiltri({ ...filtri, ...parziale })

  const cambiaPagina = (p: number) => {
    setScelta({ filtri, pagina: p })
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="catalogo" className="container-page mt-24 sm:mt-28 scroll-mt-28">
      <div className="reveal-element sm:px-[38px]">
        <h2 className="text-3xl sm:text-[2.2rem] font-medium text-brand-navy">Esplora tutti i bandi</h2>
        <p className="mt-2 text-sm sm:text-[15px] text-brand-navy/90 leading-relaxed max-w-[640px]">
          Il catalogo completo, con ricerca libera e filtri. Apri un bando con + per vederne sintesi, requisiti,
          budget e scadenza.
        </p>
      </div>

      {DEMO && (
        <p className="mt-6 sm:mx-[38px] rounded-lg border border-dashed border-brand-navy/40 bg-white/40 px-4 py-2.5 text-xs text-brand-navy">
          <strong>Modalità anteprima:</strong> oltre ai bandi reali sono mostrati {BANDI_DEMO.length} bandi di esempio.
          Online, senza <code>?demo</code> nell'indirizzo, compaiono solo i bandi reali.
        </p>
      )}

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className={cn(GLASS_PANEL, 'mt-8 px-6 py-8 sm:px-[38px] sm:py-10 reveal-element')}
      >
        <label htmlFor="cerca-bandi" className="block text-sm text-brand-navy">
          Cerca
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-navy/50" />
          <input
            id="cerca-bandi"
            type="search"
            value={filtri.testo}
            onChange={(e) => aggiorna({ testo: e.target.value })}
            placeholder="Titolo, ente o parola chiave"
            className="w-full rounded-md border border-white/80 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-brand-dark-navy placeholder:text-brand-navy/40 focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SelectFiltro
            id="filtro-ambito"
            label="Ambito"
            value={filtri.ambito}
            onChange={(v) => aggiorna({ ambito: v })}
            opzioni={[{ value: '', label: 'Tutti gli ambiti' }, ...AMBITI.map((a) => ({ value: a.id, label: a.label }))]}
          />
          <SelectFiltro
            id="filtro-destinatari"
            label="Destinatari"
            value={filtri.destinatario}
            onChange={(v) => aggiorna({ destinatario: v })}
            opzioni={[{ value: '', label: 'Tutti' }, ...DESTINATARI.map((d) => ({ value: d.id, label: d.label }))]}
          />
          <SelectFiltro
            id="filtro-stato"
            label="Stato"
            value={filtri.stato}
            onChange={(v) => aggiorna({ stato: v })}
            opzioni={STATI_FILTRO}
          />
          <SelectFiltro
            id="filtro-livello"
            label="Livello"
            value={filtri.livello}
            onChange={(v) => aggiorna({ livello: v })}
            opzioni={[{ value: '', label: 'Tutti' }, ...LIVELLI.map((l) => ({ value: l, label: l }))]}
          />
        </div>
      </form>

      <div ref={gridRef} className="mt-12 sm:px-[38px] scroll-mt-28">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm text-brand-navy">
            {risultati.length === 1 ? '1 bando' : `${risultati.length} bandi`}
            {filtriAttivi ? ' corrispondono ai filtri' : ' in catalogo'}
          </p>
          {filtriAttivi && (
            <button
              type="button"
              onClick={() => setFiltri(FILTRI_VUOTI)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy/70 hover:text-brand-navy cursor-pointer"
            >
              <RotateCcw className="size-3.5" /> Azzera filtri
            </button>
          )}
        </div>

        {visibili.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {visibili.map((b) => (
              <BandoCard key={b.id} bando={b} oggi={oggi} />
            ))}
          </div>
        ) : (
          <div className="rounded-[10px] border border-white bg-white/60 px-6 py-10 text-center">
            <p className="text-base font-semibold text-brand-dark-navy">Nessun bando corrisponde ai filtri scelti</p>
            <p className="mt-2 text-sm text-brand-dark-navy/70">
              Prova ad allargare la ricerca oppure chiedi ai nostri consulenti: ti segnaliamo le opportunità in arrivo.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setFiltri(FILTRI_VUOTI)}
                className={cn(NEUMORPHIC_BUTTON, 'px-5 py-2.5 text-sm font-semibold')}
              >
                Azzera filtri
              </button>
              <a
                href={CONSULENZA_HREF}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-brand-navy to-[#0b4a86] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(1,49,103,0.35)] transition-all duration-300 hover:-translate-y-0.5 no-underline"
              >
                Chiedi una consulenza
              </a>
            </div>
          </div>
        )}

        <Paginazione pagina={pagina} totale={totalePagine} onCambia={cambiaPagina} />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Banner consulenza                                                           */
/* -------------------------------------------------------------------------- */

const SUPPORTO = [
  { titolo: 'Verifica dei requisiti', testo: 'Una prima valutazione della tua idoneità.' },
  { titolo: 'Preparazione della domanda', testo: 'Documenti, scadenze e passaggi da seguire.' },
  { titolo: 'Interpretazione del bando', testo: 'Spese ammissibili, vincoli e punti critici.' },
  { titolo: 'Le opportunità giuste', testo: 'Quali bandi conviene seguire per la tua impresa.' },
]

function ConsulenzaBanner() {
  return (
    <section
      data-no-glow
      className="mt-24 sm:mt-32 rounded-t-[20px] bg-[url('/assets/sfondo_form.png')] bg-cover bg-center py-14 sm:py-[70px]"
    >
      <div className="container-page">
        <div className="glass-stroke-container rounded-[12px] backdrop-blur-[3px] px-7 py-10 sm:px-10 sm:py-12 grid grid-cols-1 lg:grid-cols-[1.15fr_1.3fr] gap-10 lg:gap-12 items-center text-white reveal-element">
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-brand-light-blue">Servizio di consulenza</p>
            <h2 className="mt-3 text-3xl sm:text-[2.1rem] font-medium text-white leading-[1.15] max-w-[440px]">
              Non sai se la tua impresa ha i requisiti?
            </h2>
            <p className="mt-5 text-[15px] text-white/85 leading-relaxed max-w-[360px]">
              I bandi sono scritti in linguaggio tecnico e cambiano spesso. I nostri consulenti ti aiutano a capire,
              prima di investire tempo nella domanda.
            </p>
            <a
              href={CONSULENZA_HREF}
              className="mt-6 inline-flex rounded-md bg-brand-pale-blue px-5 py-2 text-[15px] font-semibold text-brand-navy transition-all duration-300 hover:bg-white hover:-translate-y-0.5 no-underline"
            >
              Contattaci
            </a>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
            {SUPPORTO.map((s) => (
              <div key={s.titolo}>
                <dt className="text-sm font-semibold text-white">{s.titolo}</dt>
                <dd className="mt-1 text-[13px] text-brand-light-blue/90 leading-snug">{s.testo}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Pagina                                                                      */
/* -------------------------------------------------------------------------- */

export function BandiPage() {
  const oggi = useMemo(() => new Date(), [])
  const [filtri, setFiltri] = useState<Filtri>(filtriDaUrl)

  useEffect(() => scriviFiltriInUrl(filtri), [filtri])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.1 },
    )
    document.querySelectorAll('.reveal-element').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        <Hero oggi={oggi} />
        <div className="pt-10 sm:pt-14">
          <Orientamento oggi={oggi} onApplica={setFiltri} />
        </div>
        <Catalogo oggi={oggi} filtri={filtri} setFiltri={setFiltri} />
        <ConsulenzaBanner />
      </main>

      <Footer />
    </>
  )
}
