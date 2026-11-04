import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { cn } from '@/lib/utils'
import { EDITORIAL_TEAM, LATEST_ISSUE, PAST_ISSUES, type InfosferaIssue } from './infosferaData'

const REASONS = [
  {
    title: 'Scenari e trend futuri',
    text: "Anticipa le tendenze tecnologiche,|dall'Intelligenza Artificiale all'Industria 5.0, per aiutare le imprese a pianificare investimenti a lungo termine.",
  },
  {
    title: 'Casi di successo reali',
    text: 'Testimonianze dirette di aziende che hanno trasformato il proprio modello di business grazie alle tecnologie digitali.',
  },
  {
    title: 'Approccio multidisciplinare',
    text: 'Unisce divulgazione scientifica e visione umanistica, offrendo chiavi di lettura per interpretare il cambiamento.',
  },
  {
    title: "Connessione con l'Europa",
    text: 'Una finestra privilegiata su esperienze, opportunità, bandi e linee guida delle politiche UE e della rete europea degli EDIH per la digitalizzazione delle PMI.',
  },
]

const GLASS_CARD =
  'bg-white/40 backdrop-blur-md border border-white/70 shadow-[0_15px_40px_rgba(1,49,103,0.12)]'

function SfogliaButton({ issue, variant = 'primary' }: { issue: InfosferaIssue; variant?: 'primary' | 'soft' }) {
  return (
    <a
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      title="Si apre in una nuova finestra"
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg no-underline transition-all duration-300 hover:-translate-y-0.5',
        variant === 'primary'
          ? 'bg-gradient-to-r from-brand-navy to-[#0b4a86] text-white text-sm px-10 py-3 shadow-[0_6px_16px_rgba(1,49,103,0.35)] hover:shadow-[0_10px_22px_rgba(1,49,103,0.4)]'
          : 'bg-[#E3EAEC] text-brand-dark-navy text-sm px-6 py-2.5 shadow-[0_4px_10px_rgba(1,49,103,0.18)] hover:shadow-[0_6px_16px_rgba(1,49,103,0.25)]',
      )}
    >
      Sfoglia
    </a>
  )
}

function LatestIssueBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl px-6 py-5 max-w-[560px]',
        GLASS_CARD,
        className,
      )}
    >
      <div>
        <p className="text-xs font-medium text-brand-navy/70">Ultimo numero</p>
        <p className="mt-1 text-[15px] text-brand-navy">{LATEST_ISSUE.label}</p>
      </div>
      <SfogliaButton issue={LATEST_ISSUE} />
    </div>
  )
}

function PastIssueCard({ issue }: { issue: InfosferaIssue }) {
  const [open, setOpen] = useState(false)
  const listId = `contenuti-${issue.id}`

  return (
    <article className="flex flex-col items-start w-full sm:max-w-[240px] mx-auto reveal-element">
      <img
        src={issue.cover}
        alt={`Copertina Infosfera ${issue.label}`}
        loading="lazy"
        className="w-full aspect-[1061/1501] object-cover shadow-[0_10px_30px_rgba(1,49,103,0.25)]"
      />
      <p className="mt-5 text-sm font-light text-brand-navy">{issue.label}</p>
      <h3 className="mt-1 text-lg font-medium text-brand-navy leading-snug">{issue.title}</h3>
      {issue.contents?.length ? (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
            className="mt-2 inline-flex items-center gap-3 text-xs text-brand-navy/80 hover:text-brand-navy cursor-pointer"
          >
            In questo numero
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-white/60 border border-white shadow-[0_2px_6px_rgba(1,49,103,0.15)]">
              <ChevronRight className={cn('size-3.5 transition-transform duration-300', open && 'rotate-90')} />
            </span>
          </button>
          <ul
            id={listId}
            hidden={!open}
            className="mt-3 space-y-0.5 text-xs text-brand-navy/80 leading-snug list-disc pl-4 marker:text-brand-navy/50"
          >
            {issue.contents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="mt-5">
        <SfogliaButton issue={issue} variant="soft" />
      </div>
    </article>
  )
}

/** Su mobile i numeri precedenti scorrono orizzontalmente (scroll-snap); da sm in su sono una griglia */
function PastIssuesSlider() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const track = trackRef.current
    if (!track || !track.firstElementChild) return
    const slide = (track.firstElementChild as HTMLElement).offsetWidth
    setActive(Math.round(track.scrollLeft / slide))
  }

  const goTo = (i: number) => {
    const track = trackRef.current
    const slide = track?.children[i] as HTMLElement | undefined
    if (track && slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="mt-10 -mx-6 px-6 pt-4 pb-6 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-14 sm:mx-0 sm:px-0 sm:py-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-14 sm:overflow-visible items-start"
      >
        {PAST_ISSUES.map((issue) => (
          <div key={issue.id} className="snap-start shrink-0 w-[72%] sm:w-auto">
            <PastIssueCard issue={issue} />
          </div>
        ))}
      </div>
      <div className="sm:hidden mt-4 flex justify-center gap-2">
        {PAST_ISSUES.map((issue, i) => (
          <button
            key={issue.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Vai al numero ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300 cursor-pointer',
              i === active ? 'w-6 bg-brand-navy' : 'w-2 bg-brand-navy/25',
            )}
          />
        ))}
      </div>
    </>
  )
}

export function InfosferaPage() {
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

      <main className="flex-grow relative pt-32 sm:pt-40 pb-24 overflow-hidden">
        {/* Hero */}
        <section className="mx-auto w-full max-w-[1290px] px-6 sm:px-8 lg:px-[30px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="reveal-element lg:mb-24">
            <p className="text-base sm:text-lg font-light text-brand-navy/80">La rivista del Campania DIH</p>
            <h1 className="mt-3 text-5xl sm:text-6xl lg:text-[4.25rem] font-normal text-brand-navy tracking-tight leading-none">
              Infosfera
            </h1>
            <p className="mt-4 text-xl sm:text-2xl lg:text-[1.65rem] font-light text-brand-navy leading-snug">
              La Rivista dell'Innovazione Digitale
              <br className="hidden sm:block" /> e Strategica
            </p>
            <p className="mt-8 text-sm sm:text-[15px] text-brand-dark-navy/80 leading-relaxed max-w-[560px]">
              Infosfera è la rivista semestrale di approfondimento e divulgazione scientifica sui temi
              dell'innovazione, della tecnologia e della cultura digitale promossa dal{' '}
              <strong className="font-semibold text-brand-dark-navy">
                Campania DIH e strumento dell'European Digital Innovation Hub P.R.I.D.E. e della rete
                dei Digital Innovation Hub di Confindustria.
              </strong>
            </p>

            <LatestIssueBox className="hidden lg:flex mt-10" />
          </div>

          <div className="flex flex-col items-center lg:items-end reveal-element reveal-delay-200">
            <div className="relative w-full max-w-[400px]">
              <span className="absolute -top-5 -left-6 z-10 rounded-md bg-brand-navy px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(1,49,103,0.35)]">
                Ultimo Numero
              </span>
              <a
                href={LATEST_ISSUE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform duration-500 hover:-translate-y-1"
                aria-label={`Sfoglia Infosfera ${LATEST_ISSUE.label}`}
              >
                <img
                  src={LATEST_ISSUE.cover}
                  alt={`Copertina Infosfera ${LATEST_ISSUE.label}: ${LATEST_ISSUE.title}`}
                  className="w-full aspect-[1061/1501] object-cover shadow-[0_20px_50px_rgba(1,49,103,0.3)]"
                />
              </a>
              <LatestIssueBox className="flex lg:hidden mt-8" />
              <dl className="mt-6 text-[15px] text-brand-navy font-light leading-relaxed">
                {EDITORIAL_TEAM.map((member) => (
                  <div key={member.role}>
                    <dt className="inline">{member.role}: </dt>
                    <dd className="inline font-medium">{member.name}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Un ponte tra ricerca e impresa */}
        <section className="mx-auto w-full max-w-[1290px] px-6 sm:px-8 lg:px-[30px] mt-28 sm:mt-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 reveal-element">
          <h2 className="text-4xl sm:text-5xl font-light text-brand-navy leading-[1.1] tracking-tight">
            Un ponte tra
            <br /> ricerca scientifica
            <br /> e impresa
          </h2>
          <p className="text-base sm:text-lg text-brand-navy leading-relaxed lg:pt-3">
            Nata per decodificare le complessità della rivoluzione tecnologica e agevolare la
            comprensione dei nuovi trend dell'innovazione, Infosfera rappresenta un ponte tra la
            ricerca scientifica avanzata e il tessuto imprenditoriale.
          </p>
        </section>

        {/* La nostra mission */}
        <section className="mx-auto w-full max-w-[1290px] px-6 sm:px-8 lg:px-[30px] mt-24 sm:mt-28 reveal-element">
          <div
            className={cn(
              'grid grid-cols-1 lg:grid-cols-[0.7fr_1.5fr] gap-6 lg:gap-12 items-center rounded-2xl px-8 py-10 sm:px-16 sm:py-14',
              GLASS_CARD,
            )}
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-brand-navy leading-[1.05]">
              La nostra
              <br className="hidden lg:block" /> mission
            </h2>
            <p className="text-sm sm:text-[15px] text-brand-dark-navy/75 font-light leading-relaxed">
              In un'epoca in cui i dati e le tecnologie evolvono a ritmo esponenziale, il vero potere
              risiede nella conoscenza consapevole. La finalità di Infosfera è offrire una bussola per
              orientarsi nella transizione digitale ed ecologica. Attraverso il contributo di
              scienziati, economisti, filosofi e imprenditori,{' '}
              <strong className="font-medium text-brand-dark-navy">
                la rivista non si limita a raccontare la tecnologia, ma ne analizza gli impatti
                antropologici, sociali ed economici, promuovendo una cultura dell'innovazione inclusiva
                e sostenibile.
              </strong>
            </p>
          </div>
        </section>

        {/* Perché leggere Infosfera? — misure dal design a 1512px: card 292×344, gap 20 */}
        <section className="mx-auto w-full max-w-[1290px] px-6 sm:px-8 lg:px-[30px] mt-28 sm:mt-32">
          <div className="reveal-element">
            <h2 className="text-[38px] sm:text-[48px] font-light text-brand-navy leading-[1.15]">
              Perché leggere Infosfera?
            </h2>
            <p className="mt-[11px] text-[15px] sm:text-[17px] text-brand-navy/85 leading-[24px] max-w-[660px]">
              Uno strumento di lavoro, ispirazione e crescita per imprenditori, manager, professionisti
              e appassionati di cultura digitale. Su ogni numero troverai:
            </p>
          </div>
          <div className="mt-14 lg:mt-[98px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REASONS.map((reason, i) => (
              <div
                key={reason.title}
                className={cn(
                  'shadow-neumorphic bg-brand-ice rounded-[10px] pl-[30px] pr-[28px] pt-[22px] pb-8 lg:min-h-[344px] reveal-element',
                  `reveal-delay-${(i + 1) * 100}`,
                )}
              >
                <p className="-ml-1.5 text-[72px] font-extralight text-[#6fa3dd] leading-none">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-[21px] h-[52px] flex items-center text-[20.5px] font-semibold text-brand-navy leading-[26px]">
                  {reason.title}
                </h3>
                <p className="mt-[19px] text-[15.8px] text-brand-navy/85 leading-5">
                  {/* "|" = a capo come nel design, solo con le 4 card affiancate */}
                  {reason.text.split('|').map((part, j) => (
                    <span key={j}>
                      {j > 0 && <br className="hidden lg:inline" />}
                      {j > 0 && <span className="lg:hidden"> </span>}
                      {part}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Numeri precedenti */}
        <section className="mx-auto w-full max-w-[1290px] px-6 sm:px-8 lg:px-[30px] mt-28 sm:mt-32">
          <h2 className="text-4xl sm:text-5xl font-light text-brand-navy tracking-tight reveal-element">
            Numeri precedenti
          </h2>
          <PastIssuesSlider />
        </section>
      </main>

      <Footer />
    </>
  )
}
