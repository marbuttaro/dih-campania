import { useEffect, useRef, useState } from 'react'
import { GlowCursor } from '@/components/effects/GlowCursor'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { TextType } from '@/components/effects/TextType'
import { PartnerFormModal } from './PartnerFormModal'

function remap(v: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  return outLo + Math.max(0, Math.min(1, (v - inLo) / (inHi - inLo))) * (outHi - outLo)
}

// Positions/sizes lifted straight from the source artwork's viewBox (widened to
// 1415x703 so a ring that bled past the original 1361 edge is no longer clipped),
// converted to percentages so the hotspots stay locked onto their node
// regardless of how large the network graphic is rendered.
const NETWORK_HOTSPOTS = [
  { label: 'Un primo orientamento', xPct: 28.09, yPct: 10.85, wPct: 7.99, hPct: 16.07, align: 'right' as const },
  { label: 'La rete dei partner', xPct: 29.93, yPct: 55.38, wPct: 9.05, hPct: 18.21, align: 'right' as const },
  { label: "L'elenco dei servizi attivi", xPct: 55.51, yPct: 41.86, wPct: 4.73, hPct: 9.53, align: 'left' as const },
]

type ParticipationTab = 'offro' | 'cerco'

const PARTICIPATION_CONTENT: Record<
  ParticipationTab,
  { text: string; cta: string }
> = {
  offro: {
    text: "Che tu sia una startup, un fornitore tecnologico o un esperto, puoi proporre il tuo contributo alla rete. Compila il form dedicato: raccontaci cosa fai, a chi ti rivolgi e come possiamo collaborare.",
    cta: 'Invia la tua proposta',
  },
  cerco: {
    text: 'Non sai da dove iniziare? Nessun problema. Ti guidiamo passo dopo passo: compilando un form con alcune semplici domande, potremo capire di cosa hai bisogno e metterti in contatto con i partner giusti.',
    cta: 'Invia la tua richiesta',
  },
}

const COMMUNITY_MEMBERS = [
  { name: 'WARIAN SRL', location: 'Mercato San Severino', url: '#' },
  { name: 'WARIAN SRL', location: 'Mercato San Severino', url: '#' },
  { name: 'WARIAN SRL', location: 'Mercato San Severino', url: '#' },
  { name: 'WARIAN SRL', location: 'Mercato San Severino', url: '#' },
  { name: 'WARIAN SRL', location: 'Mercato San Severino', url: '#' },
  { name: 'WARIAN SRL', location: 'Mercato San Severino', url: '#' },
]

export function InnovaCoPage() {
  const [tab, setTab] = useState<ParticipationTab>('offro')
  const [formOpen, setFormOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [q1Active, setQ1Active] = useState(false)
  const [q2Active, setQ2Active] = useState(false)
  const [q3Active, setQ3Active] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)

  const questionsSectionRef = useRef<HTMLDivElement>(null)
  const q1WrapRef = useRef<HTMLDivElement>(null)
  const q2WrapRef = useRef<HTMLDivElement>(null)
  const q3WrapRef = useRef<HTMLDivElement>(null)
  const q1ActiveRef = useRef(false)
  const q2ActiveRef = useRef(false)
  const q3ActiveRef = useRef(false)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          obs.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.reveal-element')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!questionsSectionRef.current) return
      const rect = questionsSectionRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / totalHeight))

      const q1Opacity = 1 - remap(p, 0.18, 0.26, 0, 1)
      const q2Opacity =
        remap(p, 0.26, 0.34, 0, 1) * (1 - remap(p, 0.58, 0.66, 0, 1))
      const q3Opacity = remap(p, 0.66, 0.74, 0, 1)

      if (q1WrapRef.current) q1WrapRef.current.style.opacity = String(q1Opacity)
      if (q2WrapRef.current) q2WrapRef.current.style.opacity = String(q2Opacity)
      if (q3WrapRef.current) q3WrapRef.current.style.opacity = String(q3Opacity)

      if (p > 0.01 && !q1ActiveRef.current) {
        q1ActiveRef.current = true
        setQ1Active(true)
      }
      if (p > 0.26 && !q2ActiveRef.current) {
        q2ActiveRef.current = true
        setQ2Active(true)
      }
      if (p > 0.66 && !q3ActiveRef.current) {
        q3ActiveRef.current = true
        setQ3Active(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const active = PARTICIPATION_CONTENT[tab]

  return (
    <>
      <GlowCursor />
      <Navbar />

      <main className="flex-grow relative bg-cover bg-top bg-no-repeat bg-brand-surface">
        {/* 1. Hero — full viewport, dark gradient, rounded bottom corners */}
        <section
          className="relative z-10 w-full min-h-dvh flex items-center pt-28 sm:pt-32 pb-16 rounded-b-[40px] sm:rounded-b-[56px] overflow-hidden"
          style={{
            background:
              'linear-gradient(120deg, #001933 0%, #013a6b 35%, #0e568b 65%, #3a82b8 100%)',
          }}
        >
          <div className="container-page relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-center reveal-element">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.25] tracking-tight">
              <span className="font-light text-white/90">Benvenuto in Innova.CO:</span>
              <br />
              <span className="font-bold text-brand-light-blue">
                la community del Campania DIH
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
              Il cuore pulsante di Campania DIH: uno spazio dinamico dove imprenditori,
              professionisti, startupper, ricercatori si incontrano per crescere insieme,
              condividere know-how e progettare soluzioni concrete per l'innovazione.
            </p>
          </div>
        </section>

        {/* Everything below the hero shares the same light atmosphere background */}
        <div className="relative">
          <div
            className="absolute inset-0 bg-white/20 pointer-events-none"
            style={{ backgroundImage: "url('/assets/sfondo.svg')", backgroundSize: 'cover' }}
          />

          {/* 2. Scroll-triggered questions, typed in one at a time.
                 Same light atmosphere as the rest of the page, but pinned to the
                 viewport (background-attachment: fixed) so it holds still while
                 the section is stuck, instead of scrolling underneath the text. */}
          <section ref={questionsSectionRef} className="relative z-10 h-[300vh] select-none">
            <div
              className="sticky top-0 h-screen flex items-center justify-center overflow-hidden w-full bg-white/20"
              style={{
                backgroundImage: "url('/assets/sfondo.svg')",
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
              }}
            >
              <div className="container-page relative w-full text-center">
                <div
                  ref={q1WrapRef}
                  className="lg:absolute inset-0 flex items-center justify-center px-4"
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-brand-navy max-w-[900px] lg:max-w-[1080px] leading-snug text-balance">
                    <TextType
                      text="Cerchi una soluzione o hai un'idea o un progetto da affrontare nel mondo digitale?"
                      typingSpeed={32}
                      cursorCharacter="|"
                      active={q1Active}
                    />
                  </h2>
                </div>
                <div
                  ref={q2WrapRef}
                  className="lg:absolute inset-0 flex items-center justify-center px-4"
                  style={{ opacity: 0 }}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-brand-navy max-w-[900px] leading-snug">
                    <TextType
                      text="Offri soluzioni innovative e vuoi metterle al servizio delle imprese?"
                      typingSpeed={32}
                      cursorCharacter="|"
                      active={q2Active}
                    />
                  </h2>
                </div>
                <div
                  ref={q3WrapRef}
                  className="lg:absolute inset-0 flex items-center justify-center px-4"
                  style={{ opacity: 0 }}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-brand-navy max-w-[900px] leading-snug">
                    <TextType
                      text="Allora sei nel posto giusto."
                      typingSpeed={32}
                      cursorCharacter="|"
                      active={q3Active}
                    />
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cosa troverai — full-bleed dark card with the interactive network artwork.
                 The three dotted nodes are real buttons, so the site-wide glow cursor
                 already lights up near them; hovering also reveals their label. */}
          <section
            className="relative z-10 w-full overflow-hidden reveal-element"
            style={{
              backgroundColor: '#001933',
              backgroundImage: "url('/assets/innova-co/sfondo-cosa-troverai.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="p-6 sm:p-10 lg:p-14 pt-24 sm:pt-28 lg:pt-32">
              <div className="relative w-full aspect-[1415/703]">
                {/* 3% inset so nodes/lines that bleed to the edge of the source
                    artwork's own viewBox get breathing room instead of being
                    cut off by the section boundary. */}
                <div className="absolute inset-[3%]">
                  {/* Static backdrop — lines and decorative nodes never move,
                      so hovering one sphere never drags the rest along with it. */}
                  <img
                    src="/assets/innova-co/cosa-troverai.svg"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full"
                  />
                  {NETWORK_HOTSPOTS.map((node, i) => (
                    <div
                      key={node.label}
                      className="absolute"
                      style={{
                        left: `${node.xPct}%`,
                        top: `${node.yPct}%`,
                        width: `${node.wPct}%`,
                        height: `${node.hPct}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Independent overlay: only this one sphere scales up on hover/focus. */}
                      <img
                        src="/assets/innova-co/element.svg"
                        alt=""
                        aria-hidden="true"
                        className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${
                          hoveredNode === i ? 'scale-115' : 'scale-100'
                        }`}
                      />
                      <button
                        type="button"
                        aria-label={node.label}
                        className="absolute inset-0 rounded-full"
                        onMouseEnter={() => setHoveredNode(i)}
                        onMouseLeave={() => setHoveredNode((v) => (v === i ? null : v))}
                        onFocus={() => setHoveredNode(i)}
                        onBlur={() => setHoveredNode((v) => (v === i ? null : v))}
                      />
                      <span
                        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-10 w-44 sm:w-60 text-sm sm:text-lg font-light text-white leading-snug rounded-xl bg-brand-dark-navy/70 backdrop-blur-sm px-4 py-2.5 shadow-lg transition-opacity duration-300 ${
                          hoveredNode === i ? 'opacity-100 delay-150' : 'opacity-0'
                        } ${node.align === 'right' ? 'left-full ml-6 sm:ml-8' : 'right-full mr-6 sm:mr-8 text-right'}`}
                      >
                        {node.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <h2 className="absolute inset-x-0 top-6 sm:top-8 lg:top-10 z-10 text-center text-2xl sm:text-3xl font-light text-white/90 px-6 pointer-events-none">
              Cosa troverai in Innova.CO
            </h2>
          </section>

        <div className="container-page relative z-10">
          {/* 4. Come puoi partecipare */}
          <div className="pt-20 sm:pt-28 pb-20 reveal-element">
            <h2 className="text-2xl sm:text-3xl font-light text-brand-navy mb-10">
              Come puoi partecipare?
            </h2>

            <div className="max-w-[900px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setTab('offro')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-4 px-6 transition-all duration-300 ${
                    tab === 'offro'
                      ? 'bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.55)]'
                      : 'bg-[#E3EAEC]/40 shadow-[-3px_-3px_10px_rgba(255,255,255,0.5),4px_4px_12px_rgba(164,177,188,0.25)] opacity-60 hover:opacity-80'
                  }`}
                >
                  <img src="/assets/innova-co/servizio.svg" alt="" aria-hidden="true" className="size-7" />
                  <span
                    className={`font-semibold text-lg ${
                      tab === 'offro' ? 'text-brand-navy' : 'text-brand-navy/50'
                    }`}
                  >
                    Offro un servizio
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab('cerco')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-4 px-6 transition-all duration-300 ${
                    tab === 'cerco'
                      ? 'bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.55)]'
                      : 'bg-[#E3EAEC]/40 shadow-[-3px_-3px_10px_rgba(255,255,255,0.5),4px_4px_12px_rgba(164,177,188,0.25)] opacity-60 hover:opacity-80'
                  }`}
                >
                  <img src="/assets/innova-co/discovery.svg" alt="" aria-hidden="true" className="size-7" />
                  <span
                    className={`font-semibold text-lg ${
                      tab === 'cerco' ? 'text-brand-navy' : 'text-brand-navy/50'
                    }`}
                  >
                    Cerco una soluzione
                  </span>
                </button>
              </div>

              <div className="shadow-box">
                <p className="text-base sm:text-lg text-brand-dark-navy/85 leading-relaxed mb-8 max-w-[640px]">
                  {active.text}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (tab === 'offro') setFormOpen(true)
                  }}
                  className="inline-flex items-center gap-2 bg-[#E3EAEC] text-brand-dark-navy font-semibold px-7 py-3.5 rounded-2xl shadow-[-4px_-4px_10px_rgba(255,255,255,0.9),6px_6px_16px_rgba(164,177,188,0.6)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {active.cta}
                </button>
              </div>
            </div>
          </div>

          {/* 5. La community oggi — accordion */}
          <div className="pb-20 reveal-element">
            <button
              type="button"
              onClick={() => setCommunityOpen((v) => !v)}
              aria-expanded={communityOpen}
              className="flex items-center justify-between w-full pb-4 group"
            >
              <h2 className="text-4xl sm:text-5xl font-light text-brand-navy">
                La community oggi
              </h2>
              <img
                src="/assets/innova-co/arrow.png"
                alt=""
                aria-hidden="true"
                className={`size-10 shrink-0 transition-transform duration-300 ${
                  communityOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className="border-b border-brand-navy/10" />

            <div
              className={`grid transition-all duration-500 ease-in-out ${
                communityOpen ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse">
                    <thead>
                      <tr className="border-b border-brand-navy/15 text-left">
                        <th className="pb-4 pr-4 font-semibold text-brand-navy text-sm w-16">&nbsp;</th>
                        <th className="pb-4 pr-4 font-semibold text-brand-navy text-sm">Nome</th>
                        <th className="pb-4 pr-4 font-semibold text-brand-navy text-sm">Località</th>
                        <th className="pb-4 font-semibold text-brand-navy text-sm">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMMUNITY_MEMBERS.map((member, i) => (
                        <tr key={i} className="border-b border-brand-navy/10">
                          <td className="py-5 pr-4 text-brand-navy/30 text-sm tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </td>
                          <td className="py-5 pr-4 text-brand-navy font-medium">{member.name}</td>
                          <td className="py-5 pr-4 text-brand-dark-navy/80">{member.location}</td>
                          <td className="py-5 text-right">
                            <a
                              href={member.url}
                              className="inline-flex items-center bg-[#E3EAEC] text-brand-dark-navy font-semibold text-sm px-5 py-2.5 rounded-lg shadow-[0_4px_10px_rgba(1,49,103,0.18)] hover:shadow-[0_6px_16px_rgba(1,49,103,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                            >
                              Visita il sito
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Un ecosistema che cresce con te */}
          <div className="pt-16 sm:pt-20 pb-20 sm:pb-24 max-w-[900px] mx-auto reveal-element">
            <div className="text-center shadow-box p-10 sm:p-12 lg:p-16">
              <h2 className="text-5xl sm:text-6xl font-semibold text-brand-navy mb-6 leading-tight">
                Un ecosistema
                <br />
                che cresce con te
              </h2>
              <p className="text-xl sm:text-2xl text-brand-dark-navy/90 leading-relaxed">
                Ogni nuova azienda, ogni nuova competenza rende questa community più forte.
                Siamo ancora all'inizio, ma il valore è già tutto qui: connessioni vere, idee
                concrete, voglia di fare.
              </p>
            </div>
          </div>

          {/* 7. Hai domande */}
          <div className="pb-24 reveal-element">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <h2 className="text-3xl sm:text-4xl font-light text-brand-navy">Hai domande?</h2>
              <div>
                <p className="text-base sm:text-lg text-brand-dark-navy/80 leading-relaxed mb-4">
                  Scrivici, chiamaci o vieni a trovarci: la trasformazione digitale non è un
                  percorso da fare da soli.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
                  <a
                    href="mailto:info@campaniadih.it"
                    className="text-brand-light-blue font-medium hover:underline"
                  >
                    info@campaniadih.it
                  </a>
                  <a
                    href="tel:+390815836404"
                    className="text-brand-dark-navy/80 hover:text-brand-navy transition-colors"
                  >
                    +39 081 5836404 – 501
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />

      <PartnerFormModal open={formOpen} onOpenChange={setFormOpen} />
    </>
  )
}
