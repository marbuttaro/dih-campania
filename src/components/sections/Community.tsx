import { useRef, useEffect, useState, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function remap(v: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  return outLo + Math.max(0, Math.min(1, (v - inLo) / (inHi - inLo))) * (outHi - outLo)
}

const MOBILE_STEPS = 4

export function Community() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardLeftRef = useRef<HTMLDivElement>(null)
  const cardRightRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const touchStartX = useRef<number | null>(null)

  // Desktop only: scroll-jacked animation (cards fly off, title/content cross-fade)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) return
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / totalHeight))

      setStep(p < 0.45 ? 0 : p < 0.68 ? 1 : 2)

      // Scroll 1: cards exit + title fades IN simultaneously (0.05 → 0.45)
      const cardExit = remap(p, 0.05, 0.45, 0, 1)
      const titleFadeIn = remap(p, 0.05, 0.45, 0, 1)

      // Scroll 2: title fades OUT (0.45 → 0.65, no pause), then content fades IN (0.68 → 0.84)
      const titleFadeOut = remap(p, 0.45, 0.65, 0, 1)
      const contentOpacity = remap(p, 0.68, 0.84, 0, 1)

      // Title: grows in during scroll 1, then shrinks out during scroll 2 — never both at once
      const titleOpacity = Math.min(titleFadeIn, 1 - titleFadeOut)

      if (cardLeftRef.current) {
        cardLeftRef.current.style.transform = `translateX(${-cardExit * 150}vw) rotate(${-3 - cardExit * 12}deg)`
        cardLeftRef.current.style.opacity = String(1 - cardExit)
      }
      if (cardRightRef.current) {
        cardRightRef.current.style.transform = `translateX(${cardExit * 150}vw) rotate(${3 + cardExit * 12}deg)`
        cardRightRef.current.style.opacity = String(1 - cardExit)
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = String(titleOpacity)
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(contentOpacity)
        contentRef.current.style.pointerEvents = contentOpacity > 0.1 ? 'auto' : 'none'
      }
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

  const goNext = () => setActiveStep((s) => Math.min(MOBILE_STEPS - 1, s + 1))
  const goPrev = () => setActiveStep((s) => Math.max(0, s - 1))

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 50
    if (deltaX > threshold) goPrev()
    else if (deltaX < -threshold) goNext()
    touchStartX.current = null
  }

  return (
    <section
      id="community"
      data-no-glow
      ref={containerRef}
      className="relative select-none lg:h-[270vh]"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen lg:min-h-[700px] flex items-center justify-center lg:overflow-hidden w-full">
        <div className="container-page w-full flex flex-col items-center relative py-8 lg:py-10 lg:min-h-[380px]">

          {/* Mobile/tablet: swipeable steps, one screen at a time */}
          <div className="lg:hidden relative w-full min-h-[320px] flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeStep === 0}
              aria-label="Indietro"
              className={`shrink-0 z-40 p-1 transition-colors ${
                activeStep === 0 ? 'text-brand-navy/25' : 'text-brand-dark-navy'
              }`}
            >
              <ChevronLeft className="size-8" strokeWidth={2} />
            </button>

            <div
              className="overflow-x-hidden overflow-y-visible flex-1 min-w-0"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ transform: `translateX(-${activeStep * 100}%)` }}
              >
                <div className="w-full shrink-0 flex items-center justify-center px-2">
                  <div className="shadow-box w-full text-center !p-7">
                    <p className="text-lg text-brand-navy leading-snug m-0">
                      Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle
                      imprese?
                    </p>
                  </div>
                </div>

                <div className="w-full shrink-0 flex items-center justify-center px-2">
                  <div className="shadow-box w-full text-center !p-7">
                    <p className="text-lg text-brand-navy leading-snug m-0">
                      Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo
                      digitale?
                    </p>
                  </div>
                </div>

                <div className="w-full shrink-0 flex items-center justify-center px-4 text-center">
                  <h2 className="font-bold text-[32px] text-brand-dark-navy leading-[1.2]">
                    Entra a far parte della{' '}
                    <span className="text-brand-light-blue">
                      Community
                      <br />
                      INNOVA.CO
                    </span>
                  </h2>
                </div>

                <div className="w-full shrink-0 flex flex-col items-center px-3 text-center gap-8">
                  <p className="text-lg text-brand-navy leading-relaxed">
                    Uno spazio aperto dove imprese, professionisti, startup ed enti si incontrano
                    per crescere insieme, scambiarsi competenze e creare soluzioni reali per
                    l'innovazione.
                  </p>
                  <a href="/innova-co" className="shadow-box !py-4 !px-8 inline-block no-underline">
                    <span className="font-bold text-brand-dark-navy">
                      Scopri la nostra community
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={activeStep === MOBILE_STEPS - 1}
              aria-label="Avanti"
              className={`shrink-0 z-40 p-1 transition-colors ${
                activeStep === MOBILE_STEPS - 1 ? 'text-brand-navy/25' : 'text-brand-dark-navy'
              }`}
            >
              <ChevronRight className="size-8" strokeWidth={2} />
            </button>
          </div>

          {/* Desktop: title in flow, cards fly off to the sides, content fades in centered */}
          <div className="hidden lg:flex relative w-full flex-col items-center text-center">
            <h2
              ref={titleRef}
              className="font-light text-5xl lg:text-[64px] text-brand-navy leading-[1.1] z-10"
              style={{ opacity: 0 }}
            >
              Entra a far parte della <br />
              <span className="text-brand-light-blue font-semibold">Community</span>
            </h2>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div
                ref={cardLeftRef}
                className="pointer-events-auto bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-9 w-[440px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] absolute left-[10%] top-[5%]"
                style={{ willChange: 'transform, opacity' }}
              >
                <p className="text-[26px] text-brand-dark-navy leading-snug m-0">
                  Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle
                  imprese?
                </p>
              </div>
              <div
                ref={cardRightRef}
                className="pointer-events-auto bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-9 w-[440px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] absolute right-[10%] bottom-[5%]"
                style={{ willChange: 'transform, opacity' }}
              >
                <p className="text-[26px] text-brand-dark-navy leading-snug m-0">
                  Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo
                  digitale?
                </p>
              </div>
            </div>

            <div
              ref={contentRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-10 text-center flex flex-col items-center z-30"
              style={{ opacity: 0, pointerEvents: 'none' }}
            >
              <p className="text-2xl text-brand-dark-navy leading-relaxed mb-10 max-w-[800px]">
                Un ecosistema dell'innovazione che unisce imprese, università, enti di ricerca e
                professionisti che propongono soluzioni, condividono know-how e sviluppano progetti
              </p>
              <a
                href="/innova-co"
                className="inline-block bg-brand-ice/30 text-brand-dark-navy px-9 py-3.5 rounded-lg font-semibold border-0 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] no-underline"
              >
                Scopri la nostra community
              </a>
            </div>
          </div>

          {/* Step progress indicator (desktop only) */}
          <div className="hidden lg:flex lg:absolute lg:bottom-2 lg:left-0 lg:right-0 justify-center lg:pb-5 z-40">
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
