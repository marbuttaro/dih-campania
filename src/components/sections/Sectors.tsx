import type { ComponentType, SVGProps } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
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

const CARD_CLASS = 'rounded-[16px] sm:rounded-[20px] bg-[#E3EAEC]/40 shadow-[-4px_-4px_10px_rgba(255,255,255,0.75),5px_5px_14px_rgba(164,177,188,0.45)]'

// The intro takes the first cells of the grid so the 13 cards fill every row evenly
export function Sectors() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* On desktop title and text sit side by side, so the intro fills the row next to the first card */}
      <div className="sm:col-span-2 lg:col-span-3 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10 pb-4 sm:pb-0 sm:pr-4 lg:pr-8">
        <h2 className="shrink-0 text-[30px] sm:text-[38px] lg:text-[46px] font-light text-[#013167] leading-[1.1] tracking-tight">
          In quali settori
          <br className="hidden lg:block" />
          {' '}opera?
        </h2>
        <p className="lg:border-l lg:border-[#8EBEF7] lg:pl-10 text-lg lg:text-[21px] font-normal text-[#013167]/85 leading-[1.4] text-pretty">
          Il Campania DIH opera trasversalmente affiancando imprese di tutte le dimensioni, settori e filiere produttive
        </p>
      </div>

      {SECTORS.map((sector, index) => {
        const Icon = sector.icon
        return (
          <motion.div
            key={sector.label}
            {...cardReveal(index)}
            className={cn(
              CARD_CLASS,
              'flex sm:flex-col items-center sm:items-start sm:justify-between gap-4 sm:min-h-[120px] lg:min-h-[128px] px-4 py-3 sm:px-5 sm:py-4',
              // On two columns the 13th card would sit alone, so let it span the row
              'sm:last:col-span-2 md:last:col-span-1',
            )}
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
    </div>
  )
}
