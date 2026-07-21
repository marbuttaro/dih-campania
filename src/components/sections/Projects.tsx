import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PROJECT_CARDS = [
  { front: '/assets/card_1_front.svg', back: '/assets/card_rear.svg' },
  { front: '/assets/card_2_front.svg', back: '/assets/card_rear.svg' },
  { front: '/assets/card_3_front.svg', back: '/assets/card_rear.svg' },
]

export function Projects() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

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

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 px-6 sm:px-0"
          style={{ perspective: 1000 }}
        >
          {PROJECT_CARDS.map((card, index) => (
            <div
              key={index}
              className="w-full aspect-[3/4] sm:h-[520px] sm:aspect-auto group"
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
                  <img
                    src={card.back}
                    alt={`Project ${index + 1} back`}
                    className="w-full h-full object-cover block"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            type="button"
            className="bg-brand-navy text-white px-10 py-3.5 rounded-lg font-semibold transition-all duration-300 hover:bg-brand-dark-navy hover:-translate-y-0.5"
          >
            Vedi tutti i progetti
          </button>
        </div>
      </div>
    </section>
  )
}
