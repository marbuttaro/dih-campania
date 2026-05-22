import { useState, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

export function Community() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return

      // progress goes from 0 to 1
      const p = -rect.top / totalHeight
      const clampedP = Math.max(0, Math.min(1, p))
      setProgress(clampedP)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Run once initially

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Map progress to steps
  const step = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2

  // Progress width goes from 15% to 100%
  const currentWidth = 15 + progress * 85

  return (
    <section
      id="community"
      ref={containerRef}
      className="relative bg-[#F0F4F8] h-[250vh] select-none"
    >
      <div className="sticky top-0 h-screen min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden w-full">
        <div className="container-page w-full flex flex-col items-center relative min-h-[380px] py-10">
          <div className="relative w-full flex flex-col items-center text-center">
            <h2
              className={cn(
                'font-light text-[40px] sm:text-5xl lg:text-[64px] text-brand-navy leading-[1.1] z-10 transition-all duration-700',
                step === 2 && 'opacity-0 scale-90',
              )}
            >
              Entra a far parte della <br />
              <span className="text-brand-light-blue font-semibold">Community</span>
            </h2>

            {/* Floating glass cards: positioned absolutely on lg+, stacked on small */}
            <div
              className={cn(
                'pointer-events-none lg:absolute inset-0 z-20 flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-center mt-8 lg:mt-0',
                step >= 1 && 'lg:pointer-events-none',
              )}
            >
              <div
                className={cn(
                  'pointer-events-auto bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-7 lg:p-9 w-[90%] sm:w-[420px] lg:w-[440px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] transition-all duration-1000',
                  'lg:absolute lg:left-[10%] lg:top-[5%] lg:-rotate-3',
                  step >= 1 && 'lg:-translate-x-[150vw] lg:-rotate-[15deg] max-lg:-translate-y-[200%] max-lg:opacity-0',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <p className="text-lg lg:text-[26px] text-brand-dark-navy leading-snug m-0">
                  Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle
                  imprese?
                </p>
              </div>
              <div
                className={cn(
                  'pointer-events-auto bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-7 lg:p-9 w-[90%] sm:w-[420px] lg:w-[440px] shadow-[0_15px_45px_rgba(0,0,0,0.1)] transition-all duration-1000',
                  'lg:absolute lg:right-[10%] lg:bottom-[5%] lg:rotate-3',
                  step >= 1 && 'lg:translate-x-[150vw] lg:rotate-[15deg] max-lg:-translate-y-[200%] max-lg:opacity-0',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <p className="text-lg lg:text-[26px] text-brand-dark-navy leading-snug m-0">
                  Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo
                  digitale?
                </p>
              </div>
            </div>

            <div
              className={cn(
                'lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 mt-10 lg:mt-0 w-full px-4 lg:px-10 text-center flex flex-col items-center transition-all duration-700 z-30',
                step === 2
                  ? 'opacity-100 lg:scale-100 visible'
                  : 'opacity-0 lg:scale-90 invisible',
              )}
            >
              <p className="text-lg sm:text-xl lg:text-2xl text-brand-dark-navy leading-relaxed mb-8 lg:mb-10 max-w-[800px]">
                Uno spazio aperto dove imprese, professionisti, startup ed enti si incontrano per
                crescere insieme, scambiarsi competenze e creare soluzioni reali per l'innovazione.
              </p>
              <button
                type="button"
                className="bg-[#E3EAEC] text-brand-dark-navy px-10 sm:px-12 py-4 sm:py-[18px] rounded-xl font-semibold text-lg sm:text-2xl border-0 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow:
                    '6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                Scopri la nostra community
              </button>
            </div>
          </div>

          {/* Dynamic glassmorphic progress bar */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-5 z-40">
            <div 
              className="relative w-[90%] max-w-[600px] h-5 rounded-full bg-white/35 backdrop-blur-sm border-2 border-white/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_24px_rgba(0,0,0,0.05)] flex items-center p-[2px] overflow-hidden"
              aria-label="Community step progress"
            >
              <div
                className="h-full rounded-full bg-white/95 border border-white shadow-[0_0_12px_rgba(255,255,255,0.8),0_4px_16px_rgba(114,138,183,0.5)] transition-[width] duration-300 ease-out"
                style={{ width: `${currentWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
