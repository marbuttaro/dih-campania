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

const JOURNEY_STEPS = [
  {
    title: '1. Analisi e orientamento',
    intro:
      "Supporto alle imprese nella definizione e implementazione di strategie di trasformazione digitale, inclusi assessment di maturità, reingegnerizzazione dei processi, identificazione di casi d'uso innovativi e adozione di tecnologie avanzate.",
    bullets: [
      "Assessment della maturità digitale: analizziamo processi, tecnologie e competenze per identificare il livello di digitalizzazione dell'impresa e individuare i principali gap da colmare.",
      "Roadmap di trasformazione: traduciamo i risultati dell'assessment in un piano operativo, con priorità, investimenti e azioni concrete per ogni area aziendale.",
      'Check-up di sicurezza informatica e piani di miglioramento per proteggere dati, infrastrutture e processi.',
      "Supporto nella transizione verde e digitale, integrando innovazione tecnologica e sostenibilità ambientale.",
    ],
    objective:
      "fornire una fotografia chiara della situazione aziendale e una direzione concreta di sviluppo digitale, garantendo un percorso di innovazione graduale, sicuro, resiliente e responsabile.",
  },
  {
    title: '2. Innovation Advisory',
    intro:
      'Supportiamo le imprese nella guida al cambiamento dalla fase strategica ai piani di implementazione operativi, controllando e monitorando gli stati avanzamento lavoro.',
    bullets: [
      "Progettazione e consulenza tecnica: affianchiamo l'impresa nella definizione dei progetti di digitalizzazione (es. automazione, IoT, AI, e-commerce, gestione dati).",
      'Sperimentazione e test: con il supporto dei Competence Center, delle università e di tutti i partner, permettiamo alle imprese di testare nuove tecnologie in ambienti sicuri prima dell\'investimento.',
      'Sviluppo di progetti pilota (Proof of Concept): con il supporto della nostra rete partenariale realizziamo prototipi e sperimentazioni su processi o prodotti digitali.',
    ],
    objective: 'trasformare le idee in soluzioni concrete e sostenibili, con risultati misurabili.',
  },
  {
    title: '3. Incentivi e opportunità',
    intro: 'Supportiamo le imprese che vogliono sviluppare nuovi progetti aziendali nella:',
    bullets: [
      'Ricerca di finanziamenti e bandi (regionali, nazionali, europei, PNRR).',
      'Assistenza nella candidatura e predisposizione della documentazione tecnica necessaria.',
      'Scouting tra i progetti della rete Confindustria e le opportunità di accesso ad agevolazioni attive rese disponibili da parte di partner finanziari per agevolare investimenti in innovazione.',
    ],
    objective: "facilitare l'accesso a risorse economiche per rendere realizzabili i progetti di digitalizzazione.",
  },
  {
    title: '4. Awareness & Training',
    intro:
      "Attività di informazione, sensibilizzazione e diffusione dei temi legati all'innovazione tecnologica. Attività di formazione finalizzate ad accrescere la cultura digitale, sviluppare competenze tecniche e manageriali e favorire l'adozione consapevole dell'innovazione tecnologica. Il Campania DIH è in grado di pianificare e programmare sulla base delle esigenze delle imprese:",
    bullets: [
      'Corsi e workshop tematici su tecnologie abilitanti (AI, Cloud, Big Data, Additive Manufacturing, Cybersecurity).',
      'Percorsi di upskilling e reskilling per imprenditori, manager e dipendenti.',
      'Laboratori esperienziali e visite dimostrative presso aziende e centri tecnologici.',
      "L'attività di awareness si sostanzia anche attraverso «sportelli tematici» (es. NIS2).",
    ],
    objective: 'accrescere la cultura digitale e preparare imprenditori, dirigenti e dipendenti al cambiamento digitale.',
  },
  {
    title: '5. Networking & Community',
    intro:
      "Sviluppo e gestione della Community digitale Innova.CO che aggrega soci e technology solution provider, volta a favorire la collaborazione tra gli attori dell'ecosistema e a facilitare la generazione di valore e le opportunità commerciali attraverso business matching. L'innovazione collaborativa viene agevolata attraverso:",
    bullets: [
      "Connessione con l'ecosistema dell'innovazione: università, startup, centri di ricerca, fornitori tecnologici.",
      'Creazione di partenariati per progetti di ricerca e sviluppo.',
      'Organizzazione di seminari, webinar o meeting tematici per favorire lo scambio di esperienze e buone pratiche.',
    ],
    objective: "far crescere l'impresa all'interno di un ecosistema innovativo, aperto e competitivo.",
  },
  {
    title: '6. Open Innovation',
    intro:
      'Sviluppo e gestione di iniziative di Open Innovation, mentoring, matchmaking tra imprese, PMI innovative, startup o spinoff innovativi, centri di ricerca e grandi player industriali.',
    bullets: [],
    objective: '',
  },
  {
    title: '7. Start up & Acceleratore',
    intro:
      'Supporto allo sviluppo della nuova imprenditoria e delle idee innovative, attraverso percorsi di accompagnamento e valorizzazione delle iniziative imprenditoriali, sviluppo e gestione di programmi di accelerazione per le startup, con particolare attenzione al contesto regionale.',
    bullets: [],
    objective: '',
  },
]

export function ServiziPage() {
  const [activeStep, setActiveStep] = useState(0)

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: '',
      })
    }, 3000)
  }

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

  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hash !== '#contatti') return

    const scrollToContact = () => {
      document.getElementById('contatti')?.scrollIntoView({ block: 'start' })
    }

    scrollToContact()
    window.addEventListener('load', scrollToContact)
    const timeout = window.setTimeout(scrollToContact, 600)

    return () => {
      window.removeEventListener('load', scrollToContact)
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <Navbar />

      <main
        className="flex-grow relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{ backgroundImage: "url('/assets/sfondo.svg')" }}
      >
        {/* 1. Hero */}
        <div className="relative pt-32 sm:pt-36 pb-20 sm:pb-28">
          <div
            className="absolute inset-0 bg-white/20 pointer-events-none"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            }}
          />
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
                  Il Campania DIH supporta le aziende <strong>in tutte le fasi del percorso
                  di trasformazione digitale.</strong>
                </p>
              </div>
              <div className="rounded-[24px] overflow-hidden shadow-neumorphic aspect-[4/3]">
                <img
                  src="/assets/foto_1.jpg"
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
              <div className="grid">
                {JOURNEY_STEPS.map((s, index) => {
                  const stepHasBullets = s.bullets.length > 0
                  const stepHasContent = Boolean(s.intro) || stepHasBullets
                  return (
                    <div
                      key={s.title}
                      aria-hidden={index !== activeStep}
                      className={`col-start-1 row-start-1 ${
                        index === activeStep ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'
                      }`}
                    >
                      <h3 className="text-2xl sm:text-[28px] font-light text-brand-navy mb-6 tracking-tight">
                        {s.title}
                      </h3>

                      {stepHasContent ? (
                        <>
                          {s.intro && (
                            <p className="text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed mb-6">
                              {s.intro}
                            </p>
                          )}
                          {stepHasBullets && (
                            <ul className="flex flex-col gap-3 mb-6 list-none p-0 m-0">
                              {s.bullets.map((bullet, i) => (
                                <li key={i} className="flex gap-2 text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed">
                                  <span aria-hidden="true">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {s.objective && (
                            <p className="text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed mb-8">
                              <strong>Obiettivo:</strong> {s.objective}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm sm:text-base text-brand-dark-navy/50 italic leading-relaxed mb-8">
                          Contenuti in arrivo.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

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

        {/* 6. Pronto per iniziare */}
        <div id="contatti" className="w-full relative bg-cover bg-center py-20 reveal-element scroll-mt-28" style={{ backgroundImage: "url('/assets/sfondo_form.png')" }}>
          <div className="container-page relative z-10">
            <div className="max-w-[760px] mx-auto rounded-[30px] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-[3px] glass-stroke-container">

              {/* Ambient inner glow */}
              <div className="absolute -top-40 -right-40 size-80 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 text-center mb-8">
                <h2 className="text-3xl sm:text-[2.1rem] font-light mb-2 text-white tracking-tight">
                  Pronto per iniziare?
                </h2>
                <p className="text-sm sm:text-base text-brand-light-blue/80 font-normal">
                  Compila il form per richiedere informazioni
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="size-16 rounded-full bg-brand-light-blue/20 flex items-center justify-center mb-4 border border-brand-light-blue/40">
                    <svg className="size-8 text-brand-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Richiesta Inviata!</h3>
                  <p className="text-brand-light-blue/80">Grazie, ti contatteremo il prima possibile per fissare l'assessment.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col glass-stroke-input-wrapper">
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                      />
                    </div>
                    <div className="flex flex-col glass-stroke-input-wrapper">
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="glass-stroke-input-wrapper">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                    />
                  </div>

                  <div className="glass-stroke-input-wrapper">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                    />
                  </div>

                  <div className="glass-stroke-input-wrapper">
                    <textarea
                      placeholder="Message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full block glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#013167] text-white hover:bg-brand-light-blue hover:text-brand-dark-navy transition-all duration-300 font-semibold py-4 rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 border border-white/10 cursor-pointer"
                    >
                      Invia Richiesta
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
