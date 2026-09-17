import { useRef, useState, type TouchEvent } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { GlareHover } from '@/components/effects/GlareHover'
import { cn } from '@/lib/utils'

const SERVICES = [
  {
    id: '01',
    title: 'Trasformazione Digitale',
    desc: "Supporto alle imprese nei percorsi di trasformazione digitale end-to-end, dalla valutazione della maturità digitale alla definizione di roadmap tecnologiche, favorendo l'adozione di soluzioni innovative e sostenibili lungo l'intera catena del valore.",
    image: '/assets/slider_servizi_1.png',
    link: '/trasformazione-digitale',
    areas: [
      'Strategia e consulenza',
      'Accesso ai finanziamenti',
      'Assessment maturità digitale',
      'Open innovation',
    ],
  },
  {
    id: '02',
    title: 'Cybersecurity',
    desc: "Supporto alle imprese nel rafforzamento della sicurezza informatica e della resilienza digitale, attraverso la valutazione dei rischi cyber, l'analisi della maturità in ambito cybersecurity e la definizione di azioni di remediation in linea con i principali standard e requisiti normativi.",
    image: '/assets/slider_servizi_2.png',
    link: '/cybersecurity',
    areas: [
      'Formazione cybersecurity',
      'Assessment sicurezza',
      'Compliance normativa',
      'Awareness digitale',
    ],
  },
  {
    id: '03',
    title: 'Intelligenza Artificiale',
    desc: "Supporto alle imprese nell'adozione consapevole dell'Intelligenza Artificiale, valutando il livello di data readiness, individuando i casi d'uso a maggiore valore e supportando l'integrazione delle soluzioni AI nei processi aziendali per incrementare efficienza e competitività.",
    image: '/assets/slider_servizi_3.png',
    link: '/intelligenza-artificiale',
    areas: [
      "Formazione sull'IA",
      'Progetti applicativi',
      'Etica e regolamentazione',
      'Innovazione collaborativa',
    ],
  },
  // ESG temporaneamente nascosto: servizio non ancora attivo
  // {
  //   id: '04',
  //   title: 'ESG',
  //   desc: "Supporto per integrare criteri ambientali, sociali e di buona governance nei processi aziendali, nelle strategie digitali, nei modelli di produzione e nella sostenibilità delle imprese, con l'obiettivo di migliorare impatto, reputazione, compliance e competitività.",
  //   image: '/assets/slider_servizi_4.png',
  // },
] as const

export function Services() {
  const [activeTab, setActiveTab] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const ref = useRef<HTMLElement | null>(null)

  const goToPrev = () => setActiveTab((i) => (i - 1 + SERVICES.length) % SERVICES.length)
  const goToNext = () => setActiveTab((i) => (i + 1) % SERVICES.length)

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 50
    if (deltaX > threshold) goToPrev()
    else if (deltaX < -threshold) goToNext()
    touchStartX.current = null
  }
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yTitle = useTransform(scrollYProgress, (value) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 0
    }
    return 80 - value * 160
  })
  const yNav = useTransform(scrollYProgress, (value) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 0
    }
    return 50 - value * 100
  })

  const active = SERVICES[activeTab]

  return (
    <section
      id="servizi"
      ref={ref}
      className="relative pt-16 lg:pt-24 sm:pb-16 lg:pb-24"
    >
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full h-full z-0 bg-cover bg-center rounded-[24px] sm:rounded-none"
        style={{ backgroundImage: "url('/assets/sfondo_servizi.png')" }}
      />


      <div className="container-page relative z-10">
        <motion.h2
          className="text-4xl sm:text-4xl lg:text-[2.5rem] text-white font-light mb-12 sm:mb-5 text-center sm:text-left"
          style={{ y: yTitle }}
        >
          I nostri servizi
        </motion.h2>

        <div className="sm:hidden mb-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Servizio precedente"
            className="flex size-10 items-center justify-center shrink-0 text-brand-light-blue"
          >
            <ChevronLeft className="size-8" strokeWidth={1.5} />
          </button>
          <span className="text-lg font-medium text-brand-light-blue text-center">
            {active.title}
          </span>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Servizio successivo"
            className="flex size-10 items-center justify-center shrink-0 text-brand-light-blue"
          >
            <ChevronRight className="size-8" strokeWidth={1.5} />
          </button>
        </div>

        <motion.div
          className="mb-10 hidden sm:block"
          style={{ y: yNav }}
        >
          <div data-no-glow className="flex flex-wrap justify-center gap-y-6 gap-x-6 sm:gap-x-10">
            {SERVICES.map((service, index) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  'flex items-center gap-2 sm:gap-3 cursor-pointer transition-opacity duration-300',
                  activeTab === index ? 'opacity-100' : 'opacity-40 hover:opacity-70',
                )}
              >
                <div className="size-10 lg:size-12 rounded-full bg-white/10 border border-brand-light-blue/30 flex items-center justify-center text-base lg:text-lg text-brand-light-blue shrink-0">
                  {service.id}
                </div>
                <span className="text-sm lg:text-xl font-medium text-brand-light-blue whitespace-nowrap">
                  {service.title}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <div
          className="flex flex-col gap-0 sm:gap-6 xl:flex-row xl:h-[520px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="order-2 sm:order-none z-10 -mx-8 sm:mx-0 -mt-8 sm:mt-0 basis-full xl:basis-[36%] xl:h-full rounded-t-none rounded-b-[24px] sm:rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <GlareHover
              className="w-full h-full"
              width="100%"
              height="100%"
              borderRadius="inherit"
              glareOpacity={0.4}
              glareSize={200}
            >
              <div
                className="w-full h-full p-8 sm:p-10 text-white flex flex-col items-center text-center sm:items-start sm:text-left bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/sfondo_card_servizi_v2.png')" }}
              >
                <div className="flex items-center gap-3 mb-5 sm:block sm:mb-0">
                  <div className="text-[67px] sm:text-[77px] font-normal leading-none sm:mb-6">
                    {active.id}
                  </div>
                  <h3 className="text-2xl max-w-[15rem] sm:max-w-none sm:text-[25px] font-semibold sm:mb-5 text-white text-left leading-tight">
                    {active.title}
                  </h3>
                </div>
                <p className="text-base sm:text-lg font-normal leading-snug text-white/90 mb-7">
                  {active.desc}
                </p>
                <a
                  href={active.link}
                  className="mt-auto self-center sm:self-start px-5 py-2.5 rounded-[8.6px] bg-white/[0.09] border border-white/40 backdrop-blur-md text-white font-semibold shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-brand-light-blue hover:text-brand-dark-navy hover:-translate-y-0.5 inline-block text-center"
                >
                  Scopri di più
                </a>
              </div>
            </GlareHover>
          </div>

          <div className="order-1 sm:order-none relative -mx-8 sm:mx-0 aspect-[4/3] sm:aspect-auto basis-full xl:basis-[64%] xl:h-full rounded-t-[24px] rounded-b-none sm:rounded-[24px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)] sm:min-h-[400px] bg-brand-dark-navy/20 flex items-center justify-center">
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-cover block"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-black/50 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute top-[9%] right-[5%] w-[62%] sm:top-auto sm:w-auto sm:right-6 sm:bottom-6 bg-black/40 backdrop-blur-md border border-white/20 rounded-[20px] p-3 sm:p-6 text-white sm:max-w-[480px]">
              <h4 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-3 text-brand-grey-blue">
                Aree principali:
              </h4>
              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:gap-2.5">
                {active.areas.map((area) => (
                  <span
                    key={area}
                    className="bg-transparent border border-white/40 px-1.5 py-1.5 sm:px-3 rounded-md text-[9.5px] leading-tight sm:text-sm font-bold text-brand-light-blue whitespace-normal sm:whitespace-nowrap text-center"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
