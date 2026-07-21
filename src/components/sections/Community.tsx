import { useRef, useEffect, useState } from 'react'

function remap(v: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  return outLo + Math.max(0, Math.min(1, (v - inLo) / (inHi - inLo))) * (outHi - outLo)
}

export function Community() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardLeftRef = useRef<HTMLDivElement>(null)
  const cardRightRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / totalHeight))

      setStep(p < 0.33 ? 0 : p < 0.66 ? 1 : 2)

      // Scroll 1: cards exit + title fades IN simultaneously (0.05 → 0.45)
      const cardExit    = remap(p, 0.05, 0.45, 0, 1)
      const titleFadeIn = remap(p, 0.05, 0.45, 0, 1)

      // Scroll 2: title fades OUT (0.45 → 0.65, no pause), then content fades IN (0.68 → 0.84)
      const titleFadeOut   = remap(p, 0.45, 0.65, 0, 1)
      const contentOpacity = remap(p, 0.68, 0.84, 0, 1)

      // Title: grows in during scroll 1, then shrinks out during scroll 2 — never both at once
      const titleOpacity = Math.min(titleFadeIn, 1 - titleFadeOut)

      const isDesktop = window.innerWidth >= 1024

      if (cardLeftRef.current) {
        cardLeftRef.current.style.transform = isDesktop
          ? `translateX(${-cardExit * 150}vw) rotate(${-3 - cardExit * 12}deg)`
          : `translateY(${-cardExit * 200}%)`
        cardLeftRef.current.style.opacity = String(1 - cardExit)
      }
      if (cardRightRef.current) {
        cardRightRef.current.style.transform = isDesktop
          ? `translateX(${cardExit * 150}vw) rotate(${3 + cardExit * 12}deg)`
          : `translateY(${-cardExit * 200}%)`
        cardRightRef.current.style.opacity = String(1 - cardExit)
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = String(titleOpacity)
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(contentOpacity)
        contentRef.current.style.pointerEvents = contentOpacity > 0.1 ? 'auto' : 'none'
      }
      // Enable glow cursor only when the button is visible
      if (containerRef.current) {
        if (contentOpacity > 0.1) {
          containerRef.current.removeAttribute('data-no-glow')
        } else {
          containerRef.current.setAttribute('data-no-glow', '')
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <section
      id="community"
      data-no-glow
      ref={containerRef}
      className="relative h-[270vh] select-none"
    >
      <div className="sticky top-0 h-screen min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden w-full">
        <div className="container-page w-full flex flex-col items-center relative min-h-[380px] py-10">
          <div className="relative w-full flex flex-col items-center text-center">

            {/* Title — starts invisible, appears during scroll 1, exits during scroll 2 */}
            <h2
              ref={titleRef}
              className="font-light text-[40px] sm:text-5xl lg:text-[64px] text-brand-navy leading-[1.1] z-10"
              style={{ opacity: 0 }}
            >
              Entra a far parte della <br />
              <span className="text-brand-light-blue font-semibold">Community</span>
            </h2>

            {/* Cards — exit during scroll 1 */}
            <div className="pointer-events-none lg:absolute inset-0 z-20 flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-center mt-8 lg:mt-0">
              <div
                ref={cardLeftRef}
                className="pointer-events-auto bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-7 lg:p-9 w-[90%] sm:w-[420px] lg:w-[440px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] lg:absolute lg:left-[10%] lg:top-[5%]"
                style={{ willChange: 'transform, opacity' }}
              >
                <p className="text-lg lg:text-[26px] text-brand-dark-navy leading-snug m-0">
                  Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle
                  imprese?
                </p>
              </div>
              <div
                ref={cardRightRef}
                className="pointer-events-auto bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-7 lg:p-9 w-[90%] sm:w-[420px] lg:w-[440px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] lg:absolute lg:right-[10%] lg:bottom-[5%]"
                style={{ willChange: 'transform, opacity' }}
              >
                <p className="text-lg lg:text-[26px] text-brand-dark-navy leading-snug m-0">
                  Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo
                  digitale?
                </p>
              </div>
            </div>

            {/* Content — enters during scroll 2, only after title is fully gone */}
            <div
              ref={contentRef}
              className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 mt-10 lg:mt-0 w-full px-4 lg:px-10 text-center flex flex-col items-center z-30"
              style={{ opacity: 0, pointerEvents: 'none' }}
            >
              <p className="text-lg sm:text-xl lg:text-2xl text-brand-dark-navy leading-relaxed mb-8 lg:mb-10 max-w-[800px]">
                Un ecosistema dell'innovazione che unisce imprese, università, enti di ricerca e
                professionisti che propongono soluzioni, condividono know-how e sviluppano progetti
              </p>
              <a
                href="/innova-co.html"
                className="text-white px-10 sm:px-12 py-4 sm:py-[18px] rounded-xl font-semibold text-lg sm:text-2xl border-0 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 inline-block"
                style={{
                  backgroundColor: '#013167',
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                Scopri la nostra community
              </a>
            </div>
          </div>

          {/* Step progress indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-5 z-40">
            <img
              src={`/assets/barra${step + 1}.svg`}
              alt=""
              aria-hidden="true"
              className="w-[90%] max-w-[600px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
