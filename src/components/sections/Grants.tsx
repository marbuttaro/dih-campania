import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Grants() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      id="bandi"
      ref={ref}
      className="relative bg-cover bg-center overflow-hidden min-h-[400px] flex items-center py-16 lg:py-20"
      style={{ backgroundImage: "url('/assets/sfondo_bandi.png')" }}
    >
      <div className="container-page w-full">
        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[30px] p-8 sm:p-12 lg:px-16 lg:py-10 max-w-[900px] text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-[2.8rem] font-light leading-tight mb-4 text-white"
            style={{ y }}
          >
            Trasforma la tua impresa
            <br />
            con i bandi attivi
          </motion.h2>
          <p className="text-base lg:text-lg leading-snug text-brand-light-blue mb-7 max-w-[600px]">
            Ti aiutiamo a orientarti tra i bandi attivi e a cogliere le migliori opportunità
          </p>
          <a
            href="#bandi"
            className="inline-block px-8 py-3.5 rounded-[8.6px] bg-white/[0.09] border border-white/40 backdrop-blur-md text-white font-semibold shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
          >
            Scopri le opportunità
          </a>
        </div>
      </div>
    </section>
  )
}
