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
  const cardLeftMobileRef = useRef<HTMLDivElement>(null)
  const cardRightMobileRef = useRef<HTMLDivElement>(null)
  const titleMobileRef = useRef<HTMLHeadingElement>(null)
  const contentMobileRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / totalHeight))

      setStep(p < 0.45 ? 0 : p < 0.68 ? 1 : 2)

      const isDesktop = window.innerWidth >= 1024

      if (isDesktop) {
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
      } else {
        // Mobile/tablet: one element at a time, fixed in place — pure crossfade, no movement.
        // Card 1 → Card 2 → Title → Content, each reached by scrolling, screen never shifts.
        const card1Opacity = 1 - remap(p, 0.18, 0.23, 0, 1)
        const card2Opacity = Math.min(remap(p, 0.18, 0.23, 0, 1), 1 - remap(p, 0.43, 0.48, 0, 1))
        const titleOpacity = Math.min(remap(p, 0.43, 0.48, 0, 1), 1 - remap(p, 0.68, 0.73, 0, 1))
        const contentOpacity = remap(p, 0.68, 0.73, 0, 1)

        if (cardLeftMobileRef.current) {
          cardLeftMobileRef.current.style.opacity = String(card1Opacity)
        }
        if (cardRightMobileRef.current) {
          cardRightMobileRef.current.style.opacity = String(card2Opacity)
        }
        if (titleMobileRef.current) {
          titleMobileRef.current.style.opacity = String(titleOpacity)
        }
        if (contentMobileRef.current) {
          contentMobileRef.current.style.opacity = String(contentOpacity)
          contentMobileRef.current.style.pointerEvents = contentOpacity > 0.1 ? 'auto' : 'none'
        }
        if (containerRef.current) {
          if (contentOpacity > 0.1) {
            containerRef.current.removeAttribute('data-no-glow')
          } else {
            containerRef.current.setAttribute('data-no-glow', '')
          }
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

          {/* Mobile/tablet: single fixed stage, elements cross-fade in place one at a time */}
          <div className="lg:hidden absolute inset-0 grid grid-cols-1 grid-rows-1 place-items-center px-4">
            <div
              ref={cardLeftMobileRef}
              className="[grid-area:1/1] pointer-events-none bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-7 w-[90%] sm:w-[420px] shadow-[0_15px_45px_rgba(0,0,0,0.1)]"
              style={{ opacity: 1 }}
            >
              <p className="text-lg text-brand-dark-navy leading-snug m-0">
                Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle
                imprese?
              </p>
            </div>

            <div
              ref={cardRightMobileRef}
              className="[grid-area:1/1] pointer-events-none bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-7 w-[90%] sm:w-[420px] shadow-[0_15px_45px_rgba(0,0,0,0.1)]"
              style={{ opacity: 0 }}
            >
              <p className="text-lg text-brand-dark-navy leading-snug m-0">
                Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo
                digitale?
              </p>
            </div>

            <h2
              ref={titleMobileRef}
              className="[grid-area:1/1] pointer-events-none font-light text-[40px] sm:text-5xl text-brand-navy leading-[1.1] text-center"
              style={{ opacity: 0 }}
            >
              Entra a far parte della <br />
              <span className="text-brand-light-blue font-semibold">Community</span>
            </h2>

            <div
              ref={contentMobileRef}
              className="[grid-area:1/1] w-full px-2 text-center flex flex-col items-center"
              style={{ opacity: 0, pointerEvents: 'none' }}
            >
              <p className="text-lg sm:text-xl text-brand-dark-navy leading-relaxed mb-8 max-w-[800px]">
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
