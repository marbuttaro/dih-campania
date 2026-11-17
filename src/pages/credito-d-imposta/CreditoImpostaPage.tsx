import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { cn } from '@/lib/utils'

// Icone provvisorie (già usate nelle altre pagine servizio): da sostituire con quelle definitive
const CARDS = [
  {
    icon: '/assets/analisi.svg',
    title: ['In cosa consiste', 'il servizio'],
    text: 'Il servizio prevede un percorso di valutazione tecnica e documentale finalizzato a verificare la rispondenza dei progetti di ricerca, sviluppo e innovazione ai requisiti previsti dalla normativa e dalle Linee Guida ministeriali.',
  },
  {
    icon: '/assets/credito-d-imposta/finalita.svg',
    title: ['Finalità', 'del servizio'],
    text: "Attraverso l'analisi delle attività realizzate, delle competenze impiegate e della documentazione progettuale, il servizio consente alle imprese di ottenere una certificazione della corretta qualificazione delle attività ai fini del credito d'imposta.",
  },
  {
    icon: '/assets/credito-d-imposta/perche-richiedere.svg',
    title: ['Perché richiedere', 'la certificazione'],
    text: 'La certificazione rappresenta uno strumento di tutela e maggiore certezza per le imprese che investono in ricerca e innovazione.',
  },
]

const STEPS = [
  {
    title: 'Valutazione preliminare',
    text: 'Analisi iniziale del progetto e verifica delle condizioni necessarie per accedere alla procedura di certificazione.',
  },
  {
    title: 'Verifica tecnica e documentale',
    text: 'Esame delle attività progettuali, delle risorse impiegate e della documentazione disponibile, per accertarne la coerenza con i requisiti previsti dalla normativa.',
  },
  {
    title: 'Rilascio della certificazione',
    text: 'In caso di esito positivo delle verifiche, il Consorzio EDIH PRIDE rilascia la certificazione secondo i modelli ministeriali, provvedendo agli adempimenti previsti sulla piattaforma del MIMIT.',
  },
]

/** Quanta parte dello scroll della sezione "bloccata" serve per far comparire ciascuno step */
const SOGLIE = [0.04, 0.36, 0.68]

function StepCircle({ index, attivo }: { index: number; attivo: boolean }) {
  return (
    <div
      className={cn(
        'relative z-10 shrink-0 flex size-14 lg:size-[88px] items-center justify-center rounded-full bg-brand-ice shadow-neumorphic',
      )}
    >
      <span
        className={cn(
          'text-2xl lg:text-[40px] font-extralight leading-none transition-colors duration-500',
          attivo ? 'text-[#6fa3dd]' : 'text-brand-navy/20',
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}

function StepCard({ index, className }: { index: number; className?: string }) {
  const step = STEPS[index]
  const last = index === STEPS.length - 1
  return (
    <div className={cn('rounded-[10px] bg-brand-ice shadow-neumorphic px-5 py-6 lg:px-7 lg:py-7', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6fa3dd]">
        {last ? 'Traguardo' : `Step ${index + 1}`}
      </p>
      <h3 className="mt-2 text-[20.5px] font-semibold text-brand-navy leading-[26px]">{step.title}</h3>
      <p className="mt-3 text-[15px] text-brand-navy/85 leading-relaxed">{step.text}</p>
    </div>
  )
}

function PercorsoIntro() {
  return (
    <div className="max-w-[720px]">
      <h2 className="text-[34px] sm:text-[48px] font-light text-brand-navy leading-[1.15]">Come funziona il servizio</h2>
      <p className="mt-3 text-[15px] sm:text-[17px] text-brand-navy/85 leading-relaxed">
        Il percorso si articola in tre principali momenti.
      </p>
    </div>
  )
}

/**
 * Percorso a step "bloccato": la sezione è alta 3 schermate e il contenuto resta fisso (sticky) mentre
 * si scorre; ogni porzione di scroll fa comparire lo step successivo e riempie la linea che li unisce.
 * Desktop: gli step restano affiancati. Mobile: fila 01-02-03 in alto e sotto una card alla volta.
 * Con "riduci movimento" attivo la sezione è statica, con tutti gli step visibili.
 */
function Percorso() {
  const ref = useRef<HTMLElement>(null)
  const riduciMovimento = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [visibili, setVisibili] = useState(0)
  const linea = useTransform(scrollYProgress, [SOGLIE[0], SOGLIE[SOGLIE.length - 1]], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setVisibili(SOGLIE.filter((soglia) => v >= soglia).length)
  })

  if (riduciMovimento) {
    return (
      <section ref={ref} className="mb-24">
        <PercorsoIntro />
        <ol className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-5">
              <StepCircle index={i} attivo />
              <StepCard index={i} className="flex-1" />
            </li>
          ))}
        </ol>
      </section>
    )
  }

  const corrente = Math.max(0, visibili - 1)

  return (
    <section ref={ref} className="relative h-[300vh]" aria-label="Come funziona il servizio">
      <div className="sticky top-0 h-screen flex flex-col justify-center pt-24 pb-8">
        <PercorsoIntro />

        <ol className="relative mt-10 lg:mt-16 grid grid-cols-3 gap-4 lg:gap-8">
          {/* Linea che unisce i cerchi, stesso stile della timeline di Chi siamo:
              binario azzurro tenue con bagliore, riempimento #8EBEF7 → #2F7BE0 che avanza con lo scroll */}
          <span
            aria-hidden
            className="absolute left-[calc(100%/6)] right-[calc(100%/6)] top-[25px] lg:top-[38.5px] h-[6px] lg:h-[11px] rounded-full bg-[#8EBEF7]/40 shadow-[0_0_8px_rgba(142,190,247,0.45)]"
          >
            <motion.span
              style={{ scaleX: linea }}
              className="block h-full w-full rounded-full origin-left bg-gradient-to-r from-[#8EBEF7] to-[#2F7BE0] shadow-[0_0_10px_rgba(142,190,247,0.7)]"
            />
          </span>

          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center" aria-current={i === corrente ? 'step' : undefined}>
              <StepCircle index={i} attivo={i < visibili} />
              {/* Desktop: le card restano affiancate e compaiono una dopo l'altra */}
              <motion.div
                className="hidden lg:block w-full mt-10"
                initial={false}
                animate={i < visibili ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <StepCard index={i} className="min-h-[230px]" />
              </motion.div>
            </li>
          ))}
        </ol>

        {/* Mobile: una card alla volta, quella dello step corrente */}
        <div className="lg:hidden relative mt-8 min-h-[280px]">
          <AnimatePresence mode="wait" initial={false}>
            {visibili > 0 && (
              <motion.div
                key={corrente}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <StepCard index={corrente} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Invito a scorrere, sparisce al primo step */}
        <motion.p
          aria-hidden
          initial={false}
          animate={{ opacity: visibili === 0 ? 1 : 0 }}
          className="mt-6 lg:mt-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-navy/50"
        >
          <ChevronDown className="size-4 animate-bounce" /> Scorri per scoprire il percorso
        </motion.p>
      </div>
    </section>
  )
}

export function CreditoImpostaPage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

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
      { root: null, rootMargin: '0px', threshold: 0.15 },
    )
    document.querySelectorAll('.reveal-element').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ lastName: '', firstName: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow relative bg-brand-surface">
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />

        {/* Sfondo con le linee solo sulla parte alta: se coprisse anche il percorso (alto 3 schermate)
            verrebbe ingrandito e le linee scenderebbero fino al riquadro EDIH PRIDE */}
        <div className="pt-36 pb-12 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: "url('/assets/sfondo.svg')" }}>
        <div className="container-page relative z-10">
          <a
            href="/servizi#servizi"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy/70 hover:text-brand-navy transition-colors mb-6 reveal-element no-underline"
          >
            <ArrowLeft className="size-4" />
            Torna ai servizi
          </a>

          {/* 1. Hero */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
            <div className="flex-[1.1] text-left reveal-element">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-light text-brand-dark-navy leading-[1.2] mb-6 tracking-tight">
                Certificazione<br />
                del credito d'imposta
              </h1>
              <p className="text-sm sm:text-base text-brand-dark-navy/85 font-normal leading-relaxed max-w-[540px]">
                <strong className="font-semibold text-brand-dark-navy">
                  Il Campania DIH, attraverso il Consorzio EDIH PRIDE, supporta le imprese nel percorso di certificazione
                  delle attività di Ricerca e Sviluppo, Innovazione Tecnologica, Design e Ideazione Estetica
                </strong>
                , ai fini dell'accesso ai benefici fiscali previsti dalla normativa vigente.
              </p>
            </div>

            <div className="flex-1 w-full flex justify-center lg:justify-end reveal-element reveal-delay-200">
              <div className="relative rounded-[20px] overflow-hidden shadow-box max-w-[420px] w-full aspect-[4/5] bg-brand-dark-navy/10" style={{ padding: 0 }}>
                <img
                  src="/assets/slider_servizi_credito.jpg"
                  alt="Certificazione del credito d'imposta"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="block"
                />
              </div>
            </div>
          </div>

          {/* 2. Consorzio EDIH PRIDE */}
          <div className="shadow-box mb-12 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center reveal-element">
            <div className="md:basis-[38%] shrink-0">
              <h2 className="text-3xl md:text-[42px] font-medium text-[#013167] leading-[1.15] mb-3 tracking-tight">
                Consorzio<br /> EDIH PRIDE
              </h2>
              <p className="text-lg md:text-[22px] font-light text-[#013167] leading-tight">
                Certificatore abilitato dal Ministero delle Imprese e del Made in Italy
              </p>
            </div>
            <div className="md:basis-[62%]">
              <p className="text-sm sm:text-base text-brand-dark-navy/80 leading-relaxed font-normal">
                Il Consorzio EDIH PRIDE, di cui il Campania DIH è socio, è iscritto all'Albo dei certificatori del
                Ministero delle Imprese e del Made in Italy (MIMIT) ed è abilitato al rilascio delle certificazioni
                attestanti la qualificazione delle attività svolte dalle imprese.
              </p>
            </div>
          </div>

          {/* 3. Tre card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS.map((card, i) => (
              <div
                key={card.icon}
                className={cn(
                  'h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1 reveal-element',
                  `reveal-delay-${(i + 1) * 100}`,
                )}
              >
                <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)] overflow-hidden">
                  <img src={card.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="block" />
                </div>
                <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                  {card.title[0]}
                  <br />
                  {card.title[1]}
                </h3>
                <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">{card.text}</p>
              </div>
            ))}
          </div>

        </div>
        </div>

        {/* 4. Percorso a step */}
        <div className="container-page relative z-10">
          <Percorso />
        </div>

        {/* 5. Form richiesta (a tutta larghezza, come nelle altre pagine servizio) */}
        <div id="contatti" className="w-full relative sm:bg-[url('/assets/sfondo_form.png')] sm:bg-cover sm:bg-center mt-20 lg:mt-28 pt-20 pb-0 sm:pb-20 reveal-element scroll-mt-28">
          <div className="container-page relative z-10">
            <div className="-mx-8 sm:mx-auto sm:max-w-[920px] rounded-none sm:rounded-[30px] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-[3px] glass-stroke-container bg-[url('/assets/sfondo_contatti_mobile.png')] bg-cover bg-center sm:bg-none">
              
              {/* Ambient inner glow */}
              <div className="absolute -top-40 -right-40 size-80 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 text-center mb-8">
                <h2 className="text-[48px] sm:text-[2.1rem] leading-[1.1] sm:leading-normal font-light mb-2 text-white tracking-tight">
                  Richiedi la certificazione
                </h2>
                <p className="text-sm sm:text-base text-brand-light-blue/80 font-normal">
                  Compila il form: ti ricontattiamo per una prima valutazione
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
                  <p className="text-brand-light-blue/80">Grazie, ti contatteremo il prima possibile per una prima valutazione del tuo progetto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      rows={6}
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
