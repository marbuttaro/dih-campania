import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SECTORS = [
  'Moda, artigianato e design',
  'Industria/manifattura & mobilità',
  'Agro-alimentare e filiere localizzate',
  'Salute, servizi alla persona',
  'Trasporto, logistica e infrastrutture smart',
  'Turismo, cultura e creatività',
]

export function About() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      id="chisiamo"
      ref={ref}
      className="py-20 lg:py-24"
    >
      <div className="container-page">
        <div className="flex flex-col lg:flex-row gap-10 mb-20 lg:mb-28 items-start">
          <motion.div className="flex-1" style={{ y }}>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-light text-brand-navy leading-[1.1] tracking-[-1px]">
              Un facilitatore tra il
              <br className="hidden sm:block" />
              {' '}mondo produttivo
              <br className="hidden sm:block" />
              {' '}e le istituzioni
            </h2>
          </motion.div>
          <div className="flex-1 lg:pt-2.5">
            <p className="text-lg lg:text-xl leading-snug text-brand-navy">
              <span className="text-brand-light-blue font-semibold">
                Il Campania Digital Hub
              </span>{' '}
              agisce come facilitatore tra il mondo produttivo, la ricerca, le startup e le
              istituzioni, offrendo strumenti, competenze e connessioni per aiutare le imprese a
              crescere nell'era digitale.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-20 lg:mb-28">
          <div className="basis-full lg:basis-[40%] bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[30px] shadow-[0_15px_40px_rgba(0,25,51,0.05)] border border-white/80 flex flex-col justify-center">
            <h3 className="text-2xl lg:text-[1.6rem] text-brand-dark-navy mb-6 font-medium leading-tight">
              Cosa può fare DIH Campania per le imprese?
            </h3>
            <p className="text-base text-neutral-600 leading-relaxed">
              Il Campania DIH supporta le aziende in{' '}
              <strong className="text-brand-dark-navy font-semibold">
                tutte le fasi del percorso di trasformazione digitale
              </strong>
              : dall'analisi dello stato di partenza alla realizzazione di progetti concreti, fino
              all'accesso a incentivi e opportunità di finanziamento.
            </p>
          </div>
          <div className="basis-full lg:basis-[60%] rounded-[30px] overflow-hidden shadow-[0_15px_40px_rgba(0,25,51,0.1)] flex">
            <img
              src="/assets/foto_1.png"
              alt="Digital hub working"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="basis-full lg:basis-[40%]">
            <h3 className="text-2xl lg:text-[1.6rem] text-brand-dark-navy mb-4 font-semibold">
              In quali settori opera?
            </h3>
            <p className="max-w-[320px] text-neutral-600">
              Il Campania DIH opera trasversalmente su settori chiave del territorio e
              dell'economia:
            </p>
          </div>
          <div className="basis-full lg:basis-[60%] grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTORS.map((sector) => (
              <div
                key={sector}
                className="px-5 py-3.5 border-2 border-brand-light-blue/30 rounded-xl text-sm font-medium text-brand-dark-navy bg-white/40 flex items-center justify-center text-center transition-all cursor-pointer hover:border-brand-light-blue hover:bg-white/80"
              >
                {sector}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
