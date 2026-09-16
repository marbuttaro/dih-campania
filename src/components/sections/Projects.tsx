import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FlipHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'

const PROJECT_CARDS = [
  {
    front: '/assets/card_1_front.svg',
    back: '/assets/card_rear.svg',
    role: 'Capofila e coordinatore',
    description:
      "P.R.I.D.E., Polo Regionale per l'Innovazione Digitale Evoluta, rientra tra i primi tredici European Digital Innovation Hub italiani finanziati dalla Commissione Europea.",
    link: 'https://www.edih-pride.eu/',
  },
  {
    front: '/assets/card_2_front.svg',
    back: '/assets/card_rear.svg',
    role: 'Partner / Spoke del network nazionale DIH',
    description:
      "ConfIN‑Hub è il polo nazionale di innovazione digitale promosso da Confindustria e finanziato dal MIMIT – PNRR, al quale il Campania DIH partecipa come spoke del network nazionale dei DIH. Il progetto consente l'erogazione su scala nazionale di servizi standardizzati di assessment digitale, cybersecurity e data readiness, valorizzando un metodo di lavoro comune e rafforzando il coordinamento tra territori, filiere e imprese.",
    link: 'https://innovationhub.confindustria.it/',
  },
  {
    front: '/assets/card_3_front.svg',
    back: '/assets/card_rear.svg',
    role: 'Partner',
    description:
      "Progetto focalizzato sulla digitalizzazione delle filiere Automotive e Aerospace attraverso l'adozione delle tecnologie High Perfomance Computing e Intelligenza Artificiale. L'iniziativa supporta le imprese attraverso assessment di maturità digitale e definizione di roadmap tecnologiche, favorendo l'adozione di soluzioni avanzate e il trasferimento tecnologico in settori industriali ad alta complessità.",
    link: 'https://edih-damas.it/',
  },
]

function CardBack({
  card,
  index,
  compact,
}: {
  card: (typeof PROJECT_CARDS)[number]
  index: number
  compact?: boolean
}) {
  if (compact) {
    return (
      <>
        <img
          src={card.back}
          alt={`Project ${index + 1} back`}
          className="w-full h-full object-cover block"
        />
        <div className="absolute inset-0 flex flex-col p-5 pt-16 text-left">
          <p className="text-xs font-semibold text-brand-navy/70 mb-0.5">
            Ruolo del Campania DIH:
          </p>
          <p className="text-sm font-bold text-brand-navy mb-2 leading-snug">
            {card.role}
          </p>
          <p className="text-xs font-light text-brand-dark-navy/80 leading-snug flex-1 min-h-0 overflow-y-auto">
            {card.description}
          </p>
          <a
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 self-center inline-block whitespace-nowrap bg-brand-ice/30 text-brand-dark-navy px-9 py-2.5 rounded-lg text-sm font-semibold border-0 cursor-pointer shadow-[0_8px_22px_rgba(0,0,0,0.22)] no-underline"
          >
            Scopri di più
          </a>
        </div>
      </>
    )
  }

  return (
    <>
      <img
        src={card.back}
        alt={`Project ${index + 1} back`}
        className="w-full h-full object-cover block"
      />
      <div className="absolute inset-x-0 top-[14%] bottom-[23%] px-[13%] text-left overflow-hidden flex flex-col justify-center">
        <p className="text-xs sm:text-[13px] font-semibold text-brand-navy/70 mb-0.5">
          Ruolo del Campania DIH:
        </p>
        <p className="text-sm sm:text-base font-bold text-brand-navy mb-3 leading-snug">
          {card.role}
        </p>
        <p className="text-xs sm:text-[13px] font-light text-brand-dark-navy/80 leading-snug">
          {card.description}
        </p>
      </div>
      <a
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-1/2 -translate-x-1/2 inline-block bg-brand-ice/30 text-brand-dark-navy px-9 py-3.5 rounded-lg font-semibold border-0 cursor-pointer shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] no-underline"
        style={{ top: '79%' }}
      >
        Scopri di più
      </a>
    </>
  )
}

export function Projects() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closestIndex = 0
    let closestDist = Infinity
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < closestDist) {
        closestDist = dist
        closestIndex = i
      }
    })
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex)
      setFlippedIndex(null)
    }
  }

  return (
    <section
      id="progetti"
      ref={ref}
      className="relative pt-6 pb-16 lg:pt-10 lg:pb-28"
    >
      <div className="container-page">
        <div className="mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-[2.5rem] font-light text-brand-dark-navy"
            style={{ y }}
          >
            Progetti
          </motion.h2>
        </div>

        {/* Mobile: swipeable carousel with center focus + flip button */}
        <div className="sm:hidden -mx-8 mb-12">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[11%] pb-2"
            style={{ perspective: 1000 }}
          >
            {PROJECT_CARDS.map((card, index) => {
              const isActive = index === activeIndex
              const isFlipped = flippedIndex === index

              return (
                <div
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  className={cn(
                    'snap-center shrink-0 w-[83%] aspect-[3/4] transition-opacity duration-300',
                    isActive ? 'opacity-100' : 'opacity-40',
                  )}
                >
                  <div
                    className="relative w-full h-full text-center transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d]"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    <div className="absolute inset-0 rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,25,51,0.15)] [backface-visibility:hidden]">
                      <img
                        src={card.front}
                        alt={`Project ${index + 1} front`}
                        className="w-full h-full object-cover block"
                      />
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => setFlippedIndex(index)}
                          className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/70 text-brand-dark-navy px-3.5 py-2 rounded-lg text-[13px] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                        >
                          <FlipHorizontal className="size-4" />
                          Gira
                        </button>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,25,51,0.15)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <CardBack card={card} index={index} compact />
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => setFlippedIndex(null)}
                          className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/70 text-brand-dark-navy px-3.5 py-2 rounded-lg text-[13px] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                        >
                          <FlipHorizontal className="size-4" />
                          Gira
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tablet/desktop: grid with hover-to-flip */}
        <div
          className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          style={{ perspective: 1000 }}
        >
          {PROJECT_CARDS.map((card, index) => (
            <div
              key={index}
              className="w-full sm:h-[520px] group"
              style={{ perspective: 1000 }}
            >
              <div
                className="relative w-full h-full text-center transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-pointer"
              >
                <div className="absolute inset-0 rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,25,51,0.15)] [backface-visibility:hidden]">
                  <img
                    src={card.front}
                    alt={`Project ${index + 1} front`}
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div className="absolute inset-0 rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,25,51,0.15)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <CardBack card={card} index={index} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <a
            href="/progetti.html"
            className="bg-brand-navy text-white px-10 py-3.5 rounded-lg font-semibold transition-all duration-300 hover:bg-brand-dark-navy hover:-translate-y-0.5 no-underline"
          >
            Vedi tutti i progetti
          </a>
        </div>
      </div>
    </section>
  )
}
