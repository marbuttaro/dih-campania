import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Experience() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="esperienza" ref={ref} className="relative py-16">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-[1200px] shadow-box">
          <motion.h2
            className="font-light text-3xl sm:text-4xl lg:text-[44px] text-brand-navy leading-tight mb-6 lg:mb-7"
            style={{ y }}
          >
            La nostra esperienza
            <br />a servizio delle aziende
          </motion.h2>
          <p className="text-base lg:text-lg leading-relaxed text-brand-dark-navy/80 mb-8 lg:mb-9">
            Il CampaniaDIH dal 2017 supporta attività di ricerca, orientamento e sviluppo di
            progetti di DT a favore delle imprese. Guidato da un senior strategic PM, il team è
            composto da esperti in innovazione tecnologica ed in settori umanistici per sostenere
            e accompagnare i processi di innovazione, trasformazione tech e digital di imprese e
            PA ed è coadiuvata da specialisti di settore ed innovation manager.
          </p>
          <button
            type="button"
            className="bg-brand-ice/30 text-brand-dark-navy px-9 py-3.5 rounded-lg font-semibold border-0 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
          >
            Scopri il nostro team
          </button>
        </div>
      </div>
    </section>
  )
}
