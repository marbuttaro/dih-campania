import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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
                  <div className="absolute inset-x-0 top-[22%] bottom-[26%] px-[13%] text-left overflow-hidden">
                    <p className="text-xs sm:text-sm font-semibold text-brand-navy/70 mb-0.5">
                      Ruolo:
                    </p>
                    <p className="text-sm sm:text-base font-bold text-brand-navy mb-4 leading-snug">
                      {card.role}
                    </p>
                    <p className="text-xs sm:text-sm font-light text-brand-dark-navy/80 leading-relaxed">
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
