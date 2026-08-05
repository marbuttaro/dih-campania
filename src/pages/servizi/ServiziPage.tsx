import { useEffect, useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { Services } from '@/components/sections/Services'

const VALUE_ITEMS = [
  {
    icon: '/assets/servizi/maturita.svg',
    text: 'Conoscere il proprio livello di maturità digitale',
  },
  {
    icon: '/assets/servizi/finanziamenti.svg',
    text: 'Accedere a competenze e finanziamenti',
  },
  {
    icon: '/assets/servizi/strategie.svg',
    text: "Definire strategie e priorità d'investimento",
  },
  {
    icon: '/assets/servizi/competenze-chiave.svg',
    text: 'Formare persone e team su competenze chiave',
  },
  {
    icon: '/assets/servizi/sperimentazione.svg',
    text: 'Sperimentare nuove tecnologie senza rischi',
  },
  {
    icon: '/assets/servizi/sostenibilita.svg',
    text: 'Diventare più competitive e sostenibili nel lungo periodo',
  },
]

const SECTORS = [
  'Moda, artigianato e design',
  'Industria/manifattura & mobilità',
  'Agro-alimentare e filiere localizzate',
  'Salute, servizi alla persona',
  'Trasporto, logistica e infrastrutture smart',
  'Turismo, cultura e creatività',
]

// TODO: contenuti reali in arrivo per gli step 2-6 (Accompagnamento, Incentivi e
// opportunità, Formazione, Networking, Sicurezza e sostenibilità)
const JOURNEY_STEPS = [
  {
    title: '1. Analisi e orientamento',
    bullets: [
      "Assessment della maturità digitale: analizziamo processi, tecnologie e competenze per identificare il livello di digitalizzazione dell'impresa e individuare i principali gap da colmare.",
      "Roadmap di trasformazione: traduciamo i risultati dell'assessment in un piano operativo, con priorità, investimenti e azioni concrete per ogni area aziendale.",
      'Check-up mirati: cybersecurity, efficienza energetica, sostenibilità, gestione dati e competenze.',
    ],
    objective:
      'fornire una fotografia chiara della situazione aziendale e una direzione concreta di sviluppo digitale.',
  },
  { title: '2. Accompagnamento', bullets: [], objective: '' },
  { title: '3. Incentivi e opportunità', bullets: [], objective: '' },
  { title: '4. Formazione', bullets: [], objective: '' },
  { title: '5. Networking', bullets: [], objective: '' },
  { title: '6. Sicurezza e sostenibilità', bullets: [], objective: '' },
]

export function ServiziPage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { root: null, rootMargin: '0px', threshold: 0.1 },
    )

    const elements = document.querySelectorAll('.reveal-element')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const step = JOURNEY_STEPS[activeStep]
  const hasContent = step.bullets.length > 0

  return (
    <>
      <Navbar />

      <main
        className="flex-grow pt-32 sm:pt-36 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{ backgroundImage: "url('/assets/sfondo.svg')" }}
      >
        {/* 1. Hero */}
        <div className="relative mb-20 sm:mb-28">
          <div className="absolute inset-0 bg-white/20 pointer-events-none" />
          <div className="container-page relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center reveal-element">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] font-light text-brand-navy leading-[1.2] tracking-tight mb-6">
                  Un facilitatore tra il
                  <br />
                  mondo produttivo
                  <br />e le istituzioni
                </h1>
                <p className="text-sm sm:text-base text-brand-dark-navy/80 leading-relaxed font-normal">
                  Il Campania DIH supporta le aziende in <strong>tutte</strong> le fasi del percorso
                  di trasformazione digitale.
                </p>
              </div>
              <div className="rounded-[24px] overflow-hidden shadow-neumorphic aspect-[4/3]">
                <img
                  src="/assets/foto_1.png"
                  alt="Trasformazione digitale"
                  className="w-full h-full object-cover block"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. I nostri servizi (riuso della sezione homepage) */}
        <div className="reveal-element">
          <Services />
        </div>

        {/* 3. Il nostro percorso di innovazione digitale */}
        <div className="container-page relative z-10 py-20 sm:py-28">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-light text-brand-navy mb-10 sm:mb-14 tracking-tight reveal-element">
            Il nostro percorso di
            <br />
            innovazione digitale
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-stretch reveal-element">
            <div className="shadow-box !p-6 flex flex-col gap-1">
              {JOURNEY_STEPS.map((s, index) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`text-left px-3 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                    index === activeStep
                      ? 'text-brand-navy font-medium'
                      : 'text-brand-dark-navy/35 hover:text-brand-dark-navy/60'
                  }`}
                >
                  {s.title}
                  {index === activeStep && <span aria-hidden="true">↗</span>}
                </button>
              ))}
            </div>

            <div className="shadow-box flex flex-col">
              <h3 className="text-2xl sm:text-[28px] font-light text-brand-navy mb-6 tracking-tight">
                {step.title}
              </h3>

              {hasContent ? (
                <>
                  <ul className="flex flex-col gap-3 mb-6 list-none p-0 m-0">
                    {step.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2 text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed">
                        <span aria-hidden="true">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed mb-8">
                    <strong>Obiettivo:</strong> {step.objective}
                  </p>
                </>
              ) : (
                <p className="text-sm sm:text-base text-brand-dark-navy/50 italic leading-relaxed mb-8">
                  Contenuti in arrivo.
                </p>
              )}

              <div className="mt-auto flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  disabled={activeStep === 0}
                  className={`font-semibold text-brand-navy px-7 py-3.5 rounded-2xl transition-all duration-300 ${
                    activeStep === 0
                      ? 'bg-[#E3EAEC]/40 shadow-[-3px_-3px_10px_rgba(255,255,255,0.5),4px_4px_12px_rgba(164,177,188,0.25)] opacity-40 cursor-not-allowed'
                      : 'bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.55)] hover:-translate-y-0.5'
                  }`}
                >
                  ← Indietro
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStep((s) => Math.min(JOURNEY_STEPS.length - 1, s + 1))
                  }
                  disabled={activeStep === JOURNEY_STEPS.length - 1}
                  className={`font-semibold text-brand-navy px-7 py-3.5 rounded-2xl transition-all duration-300 ${
                    activeStep === JOURNEY_STEPS.length - 1
                      ? 'bg-[#E3EAEC]/40 shadow-[-3px_-3px_10px_rgba(255,255,255,0.5),4px_4px_12px_rgba(164,177,188,0.25)] opacity-40 cursor-not-allowed'
                      : 'bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.55)] hover:-translate-y-0.5'
                  }`}
                >
                  Avanti →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Il valore per le imprese */}
        <div
          className="w-full relative overflow-hidden reveal-element"
          style={{
            background: 'linear-gradient(120deg, #001933 0%, #013167 55%, #2f6fb8 100%)',
          }}
        >
          <div className="container-page relative z-10 py-20 sm:py-24">
            <h2 className="text-3xl sm:text-4xl font-light text-brand-light-blue/90 mb-3 tracking-tight">
              Il valore per le imprese
            </h2>
            <p className="text-sm sm:text-base text-white/70 mb-12 sm:mb-16">
              Grazie alla rete del Campania DIH, le aziende possono:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 sm:gap-y-14">
              {VALUE_ITEMS.map((item) => (
                <div key={item.text} className="flex items-center gap-5">
                  <img src={item.icon} alt="" aria-hidden="true" className="size-14 sm:size-16 shrink-0" />
                  <p className="text-base sm:text-lg text-white/90 leading-snug font-normal">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. In quali settori opera? */}
        <div className="container-page relative z-10 py-20 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start reveal-element">
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-brand-navy mb-4 tracking-tight">
                In quali settori opera?
              </h2>
              <p className="text-sm sm:text-base text-brand-dark-navy/70 leading-relaxed">
                Il Campania DIH opera trasversalmente su settori chiave del territorio e
                dell'economia:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTORS.map((sector) => (
                <div
                  key={sector}
                  className="flex items-center justify-center text-center border border-brand-navy/15 bg-white/40 rounded-xl px-6 py-5 font-semibold text-brand-navy"
                >
                  {sector}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Pronto per iniziare? */}
        <div className="container-page relative z-10 pb-24 sm:pb-28">
          <div className="reveal-element">
            <h2 className="text-3xl sm:text-4xl font-light text-brand-navy mb-3 tracking-tight">
              Pronto per iniziare?
            </h2>
            <p className="text-sm sm:text-base text-brand-dark-navy/70">
              Contattaci a questi indirizzi:
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
