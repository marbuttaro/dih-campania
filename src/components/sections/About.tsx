import { useRef, type ComponentType, type SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Anchor,
  Building2,
  Car,
  Cpu,
  Dna,
  Factory,
  HeartPulse,
  Landmark,
  Leaf,
  Rocket,
  Sprout,
  Truck,
} from 'lucide-react'

// Lucide has no clothes hanger, so draw one in the same outline style
function Hanger({ strokeWidth = 2, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 5.5a2 2 0 1 1 2 2v1.5" />
      <path d="M12 9 3.2 15.6a.8.8 0 0 0 .5 1.4h16.6a.8.8 0 0 0 .5-1.4L12 9" />
    </svg>
  )
}

const SECTORS: { label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; iconClassName?: string }[] = [
  { label: 'Agro-alimentare, agritech e filiere localizzate', icon: Sprout },
  { label: 'Moda, Made in Italy e design', icon: Hanger },
  { label: 'Trasporto e logistica', icon: Truck },
  { label: 'Infrastrutture smart', icon: Building2 },
  { label: 'Turismo, patrimonio culturale e industrie creative', icon: Landmark },
  { label: 'Aerospazio e difesa', icon: Rocket },
  { label: 'Biotecnologie', icon: Dna, iconClassName: '-rotate-45' },
  { label: 'Healthcare', icon: HeartPulse },
  { label: 'Industria manifatturiera', icon: Factory },
  { label: 'Energia, ambiente e costruzioni sostenibili', icon: Leaf },
  { label: 'Automotive', icon: Car },
  { label: 'Economia del mare', icon: Anchor },
  { label: 'Tecnologie ICT ed emergenti', icon: Cpu },
]

// Cards rise and fade in as they scroll into view, staggered across each row of four
const cardReveal = (index: number) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -60px 0px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: (index % 4) * 0.08 },
})

export function About() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, (value) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 0
    }
    return 100 - value * 200
  })

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

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-20 lg:mb-28 items-center lg:items-stretch">
          <div className="basis-full lg:basis-[40%] flex flex-col justify-center shadow-box">
            <h3 className="text-[28px] lg:text-[30px] text-brand-dark-navy mb-6 font-semibold leading-tight">
              Cosa può fare Campania DIH per le imprese?
            </h3>
            <p className="text-[18px] lg:text-[20px] text-neutral-600 leading-snug font-light">
              Il Campania DIH supporta le aziende in{' '}
              <strong className="text-brand-dark-navy font-semibold">
                tutte le fasi del percorso di trasformazione digitale
              </strong>
              : dall'analisi dello stato di partenza alla realizzazione di progetti concreti, fino
              all'accesso a incentivi e opportunità di finanziamento.
            </p>
          </div>
          <div className="basis-full lg:basis-[60%] h-[400px] rounded-[30px] overflow-hidden shadow-[0_15px_40px_rgba(0,25,51,0.1)] flex">
            <img
              src="/assets/foto_1.png"
              alt="Digital hub working"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>

        <h2 className="text-[30px] sm:text-[38px] lg:text-[46px] font-light text-[#013167] leading-[1.15] tracking-tight mb-8 lg:mb-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          In quali settori opera?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {SECTORS.map((sector, index) => {
            const Icon = sector.icon
            return (
              <motion.div
                key={sector.label}
                {...cardReveal(index)}
                className="flex sm:flex-col items-center sm:items-start sm:justify-between gap-4 sm:gap-4 sm:min-h-[120px] lg:min-h-[128px] rounded-[16px] sm:rounded-[20px] bg-[#E3EAEC]/40 shadow-[-4px_-4px_10px_rgba(255,255,255,0.75),5px_5px_14px_rgba(164,177,188,0.45)] px-4 py-3 sm:px-5 sm:py-4"
              >
                <span className="flex items-center justify-center shrink-0 size-11 rounded-[10px] bg-white/60 shadow-[0_2px_6px_rgba(164,177,188,0.25)]">
                  <Icon className={cn('size-7 text-[#8EBEF7]', sector.iconClassName)} strokeWidth={1.1} />
                </span>
                <span className="text-[15px] lg:text-base font-medium text-[#013167] leading-[1.25]">
                  {sector.label}
                </span>
              </motion.div>
            )
          })}

          <motion.div
            {...cardReveal(SECTORS.length)}
            className="md:col-span-2 lg:col-span-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 rounded-[20px] bg-[#E3EAEC]/40 shadow-[-4px_-4px_10px_rgba(255,255,255,0.75),5px_5px_14px_rgba(164,177,188,0.45)] p-5 lg:px-8 lg:py-4"
          >
            <p className="text-lg lg:text-[22px] font-medium text-[#013167] leading-[1.25] max-w-[460px]">
              Il Campania DIH opera trasversalmente su settori chiave del territorio e dell’economia.
            </p>
            <div className="flex items-center gap-5 lg:gap-8 lg:pr-6">
              <span className="text-[64px] lg:text-[80px] font-thin leading-none text-[#8EBEF7]/50 tracking-tight">
                {SECTORS.length}
              </span>
              <span className="text-[20px] lg:text-[26px] font-medium text-[#013167] leading-[1.1]">
                settori
                <br />
                strategici
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
