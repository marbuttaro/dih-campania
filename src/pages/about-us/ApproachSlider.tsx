import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const APPROACH_CARDS: { icon: string; title: string; body: ReactNode }[] = [
  {
    icon: '/assets/chi-siamo/approccio/competenze.svg',
    title: 'Connettere competenze, tecnologie e opportunità',
    body: (
      <>
        Il Campania DIH mette in relazione <strong>imprese, startup, fornitori tecnologici, università, centri di ricerca e istituzioni,</strong> favorendo lo scambio di conoscenze e lo sviluppo di collaborazioni. La sua squadra integra competenze tecnologiche, umanistiche e manageriali per affrontare l’innovazione a 360 gradi.
      </>
    ),
  },
  {
    icon: '/assets/chi-siamo/approccio/progetto.svg',
    title: 'Dall’esigenza al progetto',
    body: (
      <>
        Attraverso un approccio data driven, il Campania DIH <strong>trasforma i bisogni delle imprese in opportunità</strong> di innovazione, contribuendo alla definizione di proposte progettuali e facilitando l’accesso a partnership e collaborazioni a livello nazionale ed europeo.
      </>
    ),
  },
  {
    icon: '/assets/chi-siamo/approccio/incontri.svg',
    title: 'Incontri e trasferimento tecnologico',
    body: (
      <>
        Workshop, eventi, attività di technology transfer e iniziative di networking favoriscono la circolazione delle competenze e il confronto tra soggetti diversi, creando <strong>occasioni di collaborazione e contribuendo ad accelerare la doppia transizione digitale e sostenibile.</strong>
      </>
    ),
  },
  {
    icon: '/assets/chi-siamo/approccio/rete.svg',
    title: 'Una rete che cresce',
    body: (
      <>
        Con EDIH PRIDE, coordinato dal Campania DIH con Meditech, Cerict e ICAR-CNR, si consolida una <strong>rete di competenze industriali e scientifiche</strong> che facilita l’accesso delle imprese a servizi avanzati, sperimentazione e opportunità di finanziamento.
      </>
    ),
  },
]

// Cards snap to the scroller's left padding, which aligns them with the page container
const startOffset = (el: HTMLElement) => parseFloat(getComputedStyle(el).paddingLeft)

export function ApproachSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    let closestIndex = 0
    let closestDist = Infinity
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const dist = Math.abs(card.offsetLeft - startOffset(el) - el.scrollLeft)
      if (dist < closestDist) {
        closestDist = dist
        closestIndex = i
      }
    })
    // The last cards can't reach the snap point, so treat the scroll end as the last card
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setActiveIndex(atEnd ? APPROACH_CARDS.length - 1 : closestIndex)
  }

  const goTo = (index: number) => {
    const el = scrollRef.current
    const card = cardRefs.current[index]
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - startOffset(el), behavior: 'smooth' })
  }

  return (
    <section className="relative z-10 w-full pt-16 lg:pt-28 mb-24 reveal-element">
      <div className="container-page">
        <div className="max-w-[1200px] mx-auto mb-12">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[38px] font-light text-[#013167] leading-[1.2]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Un approccio integrato<br />all’innovazione
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pt-4 pb-16 px-8 sm:px-12 lg:px-[max(3.5rem,calc((100vw-1200px)/2+6rem))] scroll-px-8 sm:scroll-px-12 lg:scroll-px-[max(3.5rem,calc((100vw-1200px)/2+6rem))]"
      >
        {APPROACH_CARDS.map((card, index) => (
          <div
            key={card.title}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            className="snap-start shrink-0 w-[85%] sm:w-[550px] sm:h-[330px] rounded-[10px] bg-[#E3EAEC] shadow-neumorphic p-7 sm:px-9 sm:py-8"
          >
            <img src={card.icon} alt="" className="size-14 mb-4" />
            <h3 className="text-lg sm:text-[20px] font-semibold text-[#013167] leading-tight mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {card.title}
            </h3>
            <p className="text-[14px] font-light text-brand-dark-navy leading-[1.45] [&_strong]:font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 -mt-6">
        {APPROACH_CARDS.map((card, index) => (
          <button
            key={card.title}
            type="button"
            aria-label={`Vai a ${card.title}`}
            onClick={() => goTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === activeIndex ? 'w-8 bg-[#013167]' : 'w-2 bg-[#013167]/25',
            )}
          />
        ))}
      </div>
    </section>
  )
}
