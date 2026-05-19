import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { GlareHover } from '@/components/effects/GlareHover'
import { cn } from '@/lib/utils'

const SERVICES = [
  {
    id: '01',
    title: 'Trasformazione Digitale',
    desc: 'Campania DIH supporta le imprese nella loro evoluzione digitale e sostenibile attraverso interventi concreti che partono dalla valutazione dei digital needs aziendali sulla base dei quali costruire una roadmap di implementazione.',
    image: '/assets/slider_servizi_1.png',
  },
  {
    id: '02',
    title: 'Cybersecurity',
    desc: 'Attività volte a rafforzare la sicurezza digitale delle imprese e delle pubbliche amministrazioni, promuovendo conformità normativa, formazione, prevenzione dei rischi e gestione operativa delle minacce informatiche.',
    image: '/assets/slider_servizi_2.png',
  },
  {
    id: '03',
    title: 'Intelligenza Artificiale',
    desc: "Campania DIH supporta le imprese nell'introduzione dell'intelligenza artificiale, fornendo strumenti pratici, formazione e consulenza per integrare l'AI in modo sicuro, etico e utile al business.",
    image: '/assets/slider_servizi_3.png',
  },
  {
    id: '04',
    title: 'ESG',
    desc: "Supporto per integrare criteri ambientali, sociali e di buona governance nei processi aziendali, nelle strategie digitali, nei modelli di produzione e nella sostenibilità delle imprese, con l'obiettivo di migliorare impatto, reputazione, compliance e competitività.",
    image: '/assets/slider_servizi_4.png',
  },
] as const

const AREAS = [
  'Strategia e consulenza',
  'Accesso ai finanziamenti',
  'Assessment maturità digitale',
  'Open innovation',
]

export function Services() {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef<HTMLElement | null>(null)
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
      className="relative py-16 lg:py-24"
    >
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full h-full z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/sfondo_servizi.png')" }}
      />


      <div className="container-page relative z-10">
        <motion.h2
          className="text-4xl sm:text-4xl lg:text-[2.5rem] text-white font-light mb-12 sm:mb-5"
          style={{ y: yTitle }}
        >
          I nostri servizi
        </motion.h2>

        <motion.div
          className="mb-10 flex justify-center sm:block"
          style={{ y: yNav }}
        >
          <div className="grid grid-cols-2 sm:flex sm:flex-1 sm:justify-between gap-y-6 gap-x-4 sm:gap-2">
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
        </motion.div>        <div className="flex flex-col xl:flex-row gap-6 xl:h-[520px]">
          <GlareHover
            className="basis-full xl:basis-[36%] xl:h-full"
            borderRadius="24px"
            glareOpacity={0.4}
            glareSize={200}
          >
            <div
              className="w-full h-full rounded-[24px] p-8 sm:p-10 text-white flex flex-col bg-cover bg-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] overflow-hidden"
              style={{ backgroundImage: "url('/assets/sfondo_card_servizi.png')" }}
            >
              <div className="text-6xl sm:text-[77px] font-normal leading-none mb-6">
                {active.id}
              </div>
              <h3 className="text-2xl sm:text-[25px] font-semibold mb-5 text-white">
                {active.title}
              </h3>
              <p className="text-base sm:text-lg font-normal leading-snug text-white/90 mb-7">
                {active.desc}
              </p>
              {activeTab === 0 ? (
                <a
                  href="/trasformazione-digitale.html"
                  className="mt-auto self-start px-5 py-2.5 rounded-[8.6px] bg-white/[0.09] border border-white/40 backdrop-blur-md text-white font-semibold shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-brand-light-blue hover:text-brand-dark-navy hover:-translate-y-0.5 inline-block text-center"
                >
                  Scopri di più
                </a>
              ) : (
                <button
                  type="button"
                  className="mt-auto self-start px-5 py-2.5 rounded-[8.6px] bg-white/[0.09] border border-white/40 backdrop-blur-md text-white font-semibold shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-brand-light-blue hover:text-brand-dark-navy hover:-translate-y-0.5"
                >
                  Scopri di più
                </button>
              )}
            </div>
          </GlareHover>

          <div className="relative basis-full xl:basis-[64%] xl:h-full rounded-[24px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)] min-h-[400px] bg-brand-dark-navy/20 flex items-center justify-center">
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-contain sm:object-cover block"
            />
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-5 sm:p-6 text-white max-w-[calc(100%-2rem)] sm:max-w-[480px]">
              <h4 className="text-base sm:text-lg font-semibold mb-3 text-brand-grey-blue">
                Aree principali:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {AREAS.map((area) => (
                  <span
                    key={area}
                    className="bg-transparent border border-white/40 px-3 py-1.5 rounded-md text-sm font-bold text-brand-light-blue whitespace-nowrap text-center"
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
