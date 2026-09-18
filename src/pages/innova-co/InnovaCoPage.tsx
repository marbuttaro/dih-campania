import { useEffect, useRef, useState } from 'react'
import { GlowCursor } from '@/components/effects/GlowCursor'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { ContactPrefooter } from '@/components/sections/ContactPrefooter'
import { GatewayFlow } from '@/components/effects/GatewayFlow'
import { PartnerFormModal } from './PartnerFormModal'
import { SolutionRequestModal } from './SolutionRequestModal'

function remap(v: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  return outLo + Math.max(0, Math.min(1, (v - inLo) / (inHi - inLo))) * (outHi - outLo)
}

const STACK_CARDS = [
  { label: 'Un primo orientamento' },
  { label: 'La rete dei partner' },
  { label: "L'elenco dei servizi attivi" },
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
  {
    name: 'Infosfera srls',
    logo: '/assets/innova-co/partner-logos/infosfera.png',
    description:
      'Infosfera S.r.l.s. è una PMI innovativa che sviluppa piattaforme software e soluzioni di intelligenza artificiale per trasformare dati, documenti e processi in conoscenza condivisa. Aiutiamo imprese ed enti a valorizzare il proprio patrimonio informativo e a prendere decisioni più consapevoli.',
    url: 'https://memoria.infosfera.win/',
  },
  {
    name: "TIME VISION SOCIETA' COOPERATIVA A R.L.",
    logo: '/assets/innova-co/partner-logos/timevision.png',
    description:
      "Time Vision è un'Agenzia per il Lavoro e Ente di Formazione che supporta le imprese nell'innovazione. Offriamo soluzioni su misura di recruiting, upskilling e consulenza HR per trasformare l'evoluzione delle competenze e delle risorse umane in crescita aziendale.",
    url: 'https://www.timevision.it',
  },
  {
    name: 'WARIAN SRL',
    logo: '/assets/innova-co/partner-logos/warian.png',
    description:
      'Warian SRL supporta imprese e PA nei percorsi di trasformazione digitale attraverso soluzioni di cloud, connettività, cybersecurity e infrastrutture ICT evolute, contribuendo alla Community INNOVA.CO con competenze tecniche e capacità progettuale.',
    url: 'https://www.warian.net',
  },
  {
    name: 'Strategic Management Partners srl',
    logo: '/assets/innova-co/partner-logos/strategic-management-partners.png',
    description:
      'Società di Management Consulting, a matrice Italiana, fondata nel 2000 e specializzata in attività di Digital Transformation e Governance.',
    url: 'https://www.strategicmp.it',
  },
  {
    name: 'SMARTFAB SOLUTIONS S.R.L.',
    logo: '/assets/innova-co/partner-logos/smartfab.svg',
    description:
      'Smartfab Solutions è il partner per la Smart Factory. Offriamo consulenza, implementazione e sviluppo di soluzioni Industry 4.0 e 5.0, integrando macchine, sistemi e dati per trasformare le informazioni in valore e rendere i processi più efficienti e sostenibili.',
    url: 'https://www.smartfabsolutions.it/',
  },
  {
    name: 'VJLAB SRL',
    logo: '/assets/innova-co/partner-logos/vjlab.png',
    description:
      'VJLAB S.r.l. è una società multidisciplinare che offre consulenza strategica, compliance, certificazioni ISO, cybersecurity, informatica forense, sviluppo software, marketing, formazione e innovazione, supportando imprese ed enti nella crescita, digitalizzazione e gestione dei processi aziendali.',
    url: 'https://vjdigital.it',
  },
  {
    name: 'Flugantia Lab s.r.l.',
    logo: null,
    description:
      "Forniamo tecnologie innovative per il monitoraggio e la movimentazione ottimale dei contenitori industriali fissi o scarrabili. Sfruttiamo l'Intelligenza Artificiale, l'IoT e il cloud per creare un gemello digitale dell'intera raccolta rifiuti e supportare le decisioni operative in tempo reale.",
    url: 'https://www.flugantia.it/',
  },
  {
    name: 'ENJOIP Srl',
    logo: '/assets/innova-co/partner-logos/enjoip.png',
    description:
      'Azienda di telecomunicazioni e servizi IT, parte del Gruppo Planetel. Affianchiamo le imprese del Centro-Sud Italia con soluzioni su misura in ambito connettività, cybersecurity, cloud e Microsoft 365 — con un approccio consulenziale e un unico interlocutore dedicato.',
    url: 'https://enjoip.it/',
  },
  {
    name: 'Qualitas Spa',
    logo: null,
    description:
      'Qualitas Spa è una software house consolidata nel settore industriale che offre soluzioni per ottimizzare i processi produttivi, la produzione, la pianificazione e la logistica migliorandone i risultati grazie ai software proprietari: la suite NET@PRO e il software Movisped.',
    url: 'https://www.qualitas.it/',
  },
  {
    name: 'Data Felix SRL',
    logo: '/assets/innova-co/partner-logos/datafelix.png',
    description: 'Regional Data Center della Campania.',
    url: 'https://www.datafelix.it/',
  },
  {
    name: 'CC START 4.0',
    logo: '/assets/innova-co/partner-logos/ccstart.png',
    description:
      "Centro di Competenza nazionale ad alta specializzazione START4.0 del Ministero delle Imprese e del Made in Italy sulla sicurezza e l'ottimizzazione delle infrastrutture strategiche.",
    url: 'https://www.start4-0.it',
  },
  {
    name: 'MEDITERRANEO LAB 4.0 SRL',
    logo: '/assets/innova-co/partner-logos/mediterraneo-lab.png',
    description:
      'PMI innovativa specializzata in Digital Transformation, Data Governance, AI e Blockchain. Supporta PMI, PA e organismi formativi nello sviluppo di strategie data-driven, competenze digitali e soluzioni innovative per la Twin Transition, in linea con le priorità europee.',
    url: 'https://www.mediterraneolab.it',
  },
  {
    name: 'FORM RETAIL S.R.L.',
    logo: '/assets/innova-co/partner-logos/form-retail.png',
    description:
      'Form Retail s.r.l. realizza attività di formazione e consulenza, e servizi di politiche attive del lavoro. Quattro i suoi principi ispiratori: attenzione alle esigenze del cliente, ricerca e sperimentazione continua, implementazione di strumenti innovativi, attenzione ai temi della sostenibilità.',
    url: 'https://www.formretail.it',
  },
  {
    name: 'Kynetic S.r.l.',
    logo: '/assets/innova-co/partner-logos/kynetic.png',
    description:
      'Kynetic supporta imprese e PA nei percorsi di innovazione digitale, AI e trasformazione tecnologica, sviluppando soluzioni software, piattaforme cloud, strategie digitali e servizi di comunicazione evoluta per migliorare processi, competitività e crescita.',
    url: 'https://www.kynetic.it',
  },
  {
    name: 'Logogramma S.r.l.',
    logo: '/assets/innova-co/partner-logos/logogramma.png',
    description:
      "Logogramma sviluppa soluzioni AI e NLP per l'ottimizzazione dei processi aziendali, sulla base della piattaforma proprietaria AI.CODIUM®. Dal trattamento automatico del linguaggio naturale ai sistemi di dialogo, fornisce soluzioni per aziende, PA ed Enti culturali.",
    url: 'https://www.logogramma.com/',
  },
  {
    name: 'Progressive Systems Srl',
    logo: '/assets/innova-co/partner-logos/progressive-systems.png',
    description:
      "Progressive Systems è specializzata nella progettazione e gestione di architetture digitali avanzate e nell'orchestrazione di grandi moli di dati (Big Data). Gestiamo ecosistemi di dati su larga scala fornendo soluzioni pronte all'uso per il settore privato, la ricerca e la Pubblica Amministrazione.",
    url: 'https://progressivesystems.it/',
  },
]

export function InnovaCoPage() {
  const [tab, setTab] = useState<ParticipationTab>('offro')
  const [formOpen, setFormOpen] = useState(false)
  const [solutionFormOpen, setSolutionFormOpen] = useState(false)
  const [showAllMembers, setShowAllMembers] = useState(false)

  const questionsSectionRef = useRef<HTMLDivElement>(null)
  const q1WrapRef = useRef<HTMLDivElement>(null)
  const q2WrapRef = useRef<HTMLDivElement>(null)
  const q3WrapRef = useRef<HTMLDivElement>(null)

  const stackSectionRef = useRef<HTMLDivElement>(null)
  const stackCardRefs = useRef<(HTMLDivElement | null)[]>([])

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

      // The first question is already in place the moment the section is
      // reached (no rise/fade-in). The next two rise in from below with a
      // quick fade as their window starts, hold in place, then fade out (no
      // movement) before the next one enters. A small gap (both at opacity 0)
      // is kept between questions so outgoing and incoming text never overlap
      // on screen at the same time.
      const RISE = 26
      const q1Enter = 1
      const q1Opacity = 1 - remap(p, 0.3, 0.36, 0, 1)
      const q2Enter = remap(p, 0.38, 0.44, 0, 1)
      const q2Opacity = q2Enter * (1 - remap(p, 0.6, 0.66, 0, 1))
      const q3Enter = remap(p, 0.68, 0.74, 0, 1)
      const q3Opacity = q3Enter

      if (q1WrapRef.current) {
        q1WrapRef.current.style.opacity = String(q1Opacity)
        q1WrapRef.current.style.transform = `translateY(${RISE * (1 - q1Enter)}px)`
      }
      if (q2WrapRef.current) {
        q2WrapRef.current.style.opacity = String(q2Opacity)
        q2WrapRef.current.style.transform = `translateY(${RISE * (1 - q2Enter)}px)`
      }
      if (q3WrapRef.current) {
        q3WrapRef.current.style.opacity = String(q3Opacity)
        q3WrapRef.current.style.transform = `translateY(${RISE * (1 - q3Enter)}px)`
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

  // "Cosa troverai" — the heading is already visible the moment the blue
  // screen is reached (no fade-in gap), then the three cards stack on top of
  // each other as the user keeps scrolling, each new arrival pushing the
  // previous ones slightly back (smaller scale, shifted up).
  useEffect(() => {
    const STACK_WINDOWS: [number, number][] = [
      [0.08, 0.2],
      [0.4, 0.52],
      [0.72, 0.84],
    ]
    const RECEDE_SCALE_STEP = 0.06
    const RECEDE_Y_STEP = 18

    const handleScroll = () => {
      if (!stackSectionRef.current) return
      const rect = stackSectionRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / totalHeight))

      stackCardRefs.current.forEach((el, i) => {
        if (!el) return
        const [start, end] = STACK_WINDOWS[i]
        const enter = remap(p, start, end, 0, 1)

        let recede = 0
        for (let j = i + 1; j < STACK_WINDOWS.length; j++) {
          recede += remap(p, STACK_WINDOWS[j][0], STACK_WINDOWS[j][1], 0, 1)
        }

        const slideY = 60 * (1 - enter)
        const recedeY = -RECEDE_Y_STEP * recede
        const scale = 1 - RECEDE_SCALE_STEP * recede

        el.style.opacity = String(enter)
        el.style.transform = `translateY(${slideY + recedeY}px) scale(${scale})`
      })
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

      <main className="flex-grow relative">
        {/* 1. Hero — full viewport, dark gradient, rounded bottom corners */}
        <section
          className="relative z-10 w-full min-h-dvh sm:min-h-[68vh] flex items-center pt-24 sm:pt-28 pb-10 sm:pb-12 rounded-b-[40px] sm:rounded-b-[56px] overflow-hidden"
          style={{
            background:
              'linear-gradient(120deg, #001933 0%, #013a6b 35%, #0e568b 65%, #3a82b8 100%)',
          }}
        >
          <div className="container-page relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-center text-center lg:text-left reveal-element">
            <h1 className="text-4xl lg:text-[2.75rem] leading-[1.25] tracking-tight">
              <span className="font-light text-white/90">Benvenuto in Innova.CO:</span>
              <br />
              <span className="font-bold text-brand-light-blue">
                la community del
                <br />
                Campania DIH
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
          {/* 2. Scroll-triggered questions, typed in one at a time.
                 Pinned to the viewport (sticky) so it holds still while
                 the section is stuck, instead of scrolling underneath the text. */}
          <section ref={questionsSectionRef} className="relative z-10 h-[300vh] select-none">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden w-full">
              <GatewayFlow />
              <div className="container-page relative w-full text-center">
                <div
                  ref={q1WrapRef}
                  className="absolute inset-0 flex items-center justify-center px-4"
                  style={{ opacity: 1, transform: 'translateY(0px)' }}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-light text-brand-navy max-w-[1100px] lg:max-w-[1320px] leading-tight text-balance">
                    Cerchi una soluzione o hai un'idea o un progetto da affrontare nel mondo digitale?
                  </h2>
                </div>
                <div
                  ref={q2WrapRef}
                  className="absolute inset-0 flex items-center justify-center px-4"
                  style={{ opacity: 0, transform: 'translateY(26px)' }}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-light text-brand-navy max-w-[1100px] lg:max-w-[1320px] leading-tight">
                    Offri soluzioni innovative e vuoi metterle al servizio delle imprese?
                  </h2>
                </div>
                <div
                  ref={q3WrapRef}
                  className="absolute inset-0 flex items-center justify-center px-4"
                  style={{ opacity: 0, transform: 'translateY(26px)' }}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-light text-brand-navy max-w-[1100px] lg:max-w-[1320px] leading-tight">
                    Allora sei nel posto giusto.
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cosa troverai — heading fades in, then the three cards stack on
                 top of each other while scrolling, reusing the same
                 scroll-linked opacity/transform approach as the questions above. */}
          <section
            ref={stackSectionRef}
            className="relative z-10 w-full h-[280vh] select-none"
          >
            <div
              className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden w-full"
              style={{
                background: 'linear-gradient(120deg, #001933 0%, #013a6b 35%, #0e568b 65%, #3a82b8 100%)',
              }}
            >
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-light text-white/90 px-6 text-center mb-10 sm:mb-14"
              >
                Cosa troverai in Innova.CO
              </h2>

              <div className="relative w-[90%] sm:w-full max-w-[600px] h-[260px] sm:h-[300px]">
                {STACK_CARDS.map((card, i) => (
                  <div
                    key={card.label}
                    ref={(el) => {
                      stackCardRefs.current[i] = el
                    }}
                    className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-md border border-white/30 shadow-[0_15px_45px_rgba(0,0,0,0.25)] flex items-center justify-center p-8 text-center"
                    style={{ opacity: 0, transform: 'translateY(60px) scale(1)', zIndex: i, willChange: 'transform, opacity' }}
                  >
                    <p className="text-3xl sm:text-4xl font-light text-white">
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        <div className="container-page relative z-10">
          {/* 4. Come puoi partecipare */}
          <div className="pt-20 sm:pt-28 pb-20 reveal-element">
            <h2 className="text-4xl sm:text-5xl font-light text-brand-navy mb-10">
              Come puoi partecipare?
            </h2>

            <div className="max-w-[900px] mx-auto">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setTab('offro')}
                  className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl py-3 px-3 sm:py-4 sm:px-6 transition-all duration-300 ${
                    tab === 'offro'
                      ? 'bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.55)]'
                      : 'bg-[#E3EAEC]/85 shadow-[-3px_-3px_10px_rgba(255,255,255,0.5),4px_4px_12px_rgba(164,177,188,0.25)] hover:bg-[#E3EAEC]'
                  }`}
                >
                  <img src="/assets/innova-co/servizio.svg" alt="" aria-hidden="true" className="size-5 sm:size-7" />
                  <span
                    className={`font-semibold text-sm sm:text-lg text-center leading-tight ${
                      tab === 'offro' ? 'text-brand-navy' : 'text-brand-navy/50'
                    }`}
                  >
                    Offro un servizio
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab('cerco')}
                  className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl py-3 px-3 sm:py-4 sm:px-6 transition-all duration-300 ${
                    tab === 'cerco'
                      ? 'bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.55)]'
                      : 'bg-[#E3EAEC]/85 shadow-[-3px_-3px_10px_rgba(255,255,255,0.5),4px_4px_12px_rgba(164,177,188,0.25)] hover:bg-[#E3EAEC]'
                  }`}
                >
                  <img src="/assets/innova-co/discovery.svg" alt="" aria-hidden="true" className="size-5 sm:size-7" />
                  <span
                    className={`font-semibold text-sm sm:text-lg text-center leading-tight ${
                      tab === 'cerco' ? 'text-brand-navy' : 'text-brand-navy/50'
                    }`}
                  >
                    Cerco una soluzione
                  </span>
                </button>
              </div>

              <div className="shadow-box !bg-[#E3EAEC]/90 flex flex-col items-center text-center">
                <p className="text-base sm:text-lg text-brand-dark-navy/85 leading-relaxed mb-8 max-w-[640px]">
                  {active.text}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (tab === 'offro') setFormOpen(true)
                    else setSolutionFormOpen(true)
                  }}
                  className="inline-flex items-center gap-2 bg-[#E3EAEC] text-brand-dark-navy font-semibold px-7 py-3.5 rounded-2xl shadow-[-4px_-4px_10px_rgba(255,255,255,0.9),6px_6px_16px_rgba(164,177,188,0.6)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {active.cta}
                </button>
              </div>
            </div>
          </div>

          {/* 5. La community oggi */}
          <div className="pb-20 reveal-element">
            <h2 className="text-4xl sm:text-5xl font-light text-brand-navy pb-4">
              La community oggi
            </h2>
            <div className="border-b border-brand-navy/10 mb-6" />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-brand-navy/15 text-left">
                    <th className="pb-4 pr-4 font-semibold text-brand-navy text-sm w-32">Azienda</th>
                    <th className="pb-4 pr-4 font-semibold text-brand-navy text-sm">Descrizione</th>
                    <th className="pb-4 font-semibold text-brand-navy text-sm whitespace-nowrap">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllMembers ? COMMUNITY_MEMBERS : COMMUNITY_MEMBERS.slice(0, 3)).map((member, i) => (
                    <tr key={i} className="border-b border-brand-navy/10">
                      <td className="py-5 pr-8 align-top">
                        <div className="h-16 w-28 flex items-center justify-center">
                          {member.logo ? (
                            <img
                              src={member.logo}
                              alt={member.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-brand-navy text-center leading-tight">
                              {member.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 pr-8 max-w-[440px] text-brand-dark-navy/80 text-xs leading-snug">
                        {member.description}
                      </td>
                      <td className="py-5 text-right align-middle whitespace-nowrap">
                        <a
                          href={member.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center whitespace-nowrap bg-[#E3EAEC] text-brand-dark-navy font-semibold text-sm px-5 py-2.5 rounded-lg shadow-[0_4px_10px_rgba(1,49,103,0.18)] hover:shadow-[0_6px_16px_rgba(1,49,103,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Visita il sito
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {COMMUNITY_MEMBERS.length > 3 && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => setShowAllMembers((v) => !v)}
                  className="inline-flex items-center bg-[#E3EAEC] text-brand-dark-navy font-semibold text-sm px-6 py-2.5 rounded-lg shadow-[0_4px_10px_rgba(1,49,103,0.18)] hover:shadow-[0_6px_16px_rgba(1,49,103,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {showAllMembers ? 'Mostra meno' : 'Mostra tutti'}
                </button>
              </div>
            )}
          </div>

          {/* 6. Un ecosistema che cresce con te */}
          <div className="pt-16 sm:pt-20 pb-12 reveal-element">
            <div className="grid grid-cols-1 lg:grid-cols-[36fr_64fr] gap-6 lg:gap-8 items-stretch">
              <div
                className="rounded-[24px] p-10 sm:p-12 flex flex-col justify-center text-white"
                style={{
                  background: 'linear-gradient(120deg, #001933 0%, #013a6b 35%, #0e568b 65%, #3a82b8 100%)',
                }}
              >
                <h2 className="text-4xl sm:text-5xl font-normal mb-6 leading-[1.05]" style={{ color: '#CDE4FF' }}>
                  Un ecosistema
                  <br />
                  che cresce con te
                </h2>
                <p className="text-base sm:text-lg text-white/85 leading-relaxed">
                  Ogni nuova azienda, ogni nuova competenza rende questa community più forte.
                  Siamo ancora all'inizio, ma il valore è già tutto qui: connessioni vere, idee
                  concrete, voglia di fare.
                </p>
              </div>
              <div className="rounded-[24px] overflow-hidden min-h-[280px]">
                <img
                  src="/assets/innova-co/ecosistema-meeting.jpg"
                  alt=""
                  className="w-full h-full object-cover block"
                />
              </div>
            </div>
          </div>

          {/* 7. Hai domande */}
          <div className="pb-24 reveal-element">
            <div className="shadow-box grid grid-cols-1 lg:grid-cols-2 gap-8 items-center !p-10 sm:!p-14">
              <h2 className="text-4xl sm:text-5xl font-light text-brand-navy">Hai domande?</h2>
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

        <ContactPrefooter />
      </main>

      <Footer />

      <PartnerFormModal open={formOpen} onOpenChange={setFormOpen} />
      <SolutionRequestModal open={solutionFormOpen} onOpenChange={setSolutionFormOpen} />
    </>
  )
}
