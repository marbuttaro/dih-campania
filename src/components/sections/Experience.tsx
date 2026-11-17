import { useEffect, useRef } from 'react'

export function Experience() {
  const boxRef = useRef<HTMLDivElement | null>(null)

  // Il blocco compare allo scroll come nelle pagine dei servizi (classi reveal-element / reveal-visible)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="esperienza" className="relative pt-6 pb-16">
      <div className="container-page flex justify-center">
        <div ref={boxRef} className="w-full max-w-[1200px] shadow-box reveal-element">
          <h2 className="font-light text-3xl sm:text-4xl lg:text-[44px] text-brand-navy leading-tight mb-6 lg:mb-7">
            La nostra esperienza
            <br />a servizio delle aziende
          </h2>
          <p className="text-base lg:text-lg leading-relaxed text-brand-dark-navy/80 mb-8 lg:mb-9">
            Il CampaniaDIH dal 2017 supporta attività di ricerca, orientamento e sviluppo di
            progetti di DT a favore delle imprese. Guidato da un senior strategic PM, il team è
            composto da esperti in innovazione tecnologica ed in settori umanistici per sostenere
            e accompagnare i processi di innovazione, trasformazione tech e digital di imprese e
            PA ed è coadiuvata da specialisti di settore ed innovation manager.
          </p>
          <a
            href="/chi-siamo"
            className="block w-fit mx-auto sm:inline-block sm:mx-0 whitespace-nowrap bg-white/80 border border-brand-navy/10 sm:bg-brand-ice/30 sm:border-0 text-brand-dark-navy px-5 sm:px-9 py-3.5 rounded-lg font-semibold cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.1)] sm:shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] no-underline"
          >
            Scopri di più
          </a>
        </div>
      </div>
    </section>
  )
}
