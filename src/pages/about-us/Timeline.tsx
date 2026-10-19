import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const TIMELINE: { year: string; title: ReactNode; body: ReactNode }[] = [
  {
    year: '2017',
    title: <>Nasce <br />l’associazione</>,
    body: (
      <>
        Il Campania Digital Innovation Hub nasce il 24 luglio 2017 dall’unione delle territoriali campane di <strong>Confindustria</strong> e <strong>Ance Campania.</strong> Successivamente entrano <strong>TIM, WindTre e Netgroup.</strong>
      </>
    ),
  },
  {
    year: '2021',
    title: <>Nasce la <br />società</>,
    body: (
      <>
        Nasce a Napoli la società Campania DIH, dedicata a <strong>consulenza, digitalizzazione e innovazione</strong> per PMI, imprenditori e professionisti.
      </>
    ),
  },
  {
    year: '2022',
    title: 'Edih PRIDE',
    body: (
      <>
        Campania DIH coordina EDIH PRIDE, <strong>tra i primi European Digital Innovation Hub</strong> italiani finanziati dalla Commissione Europea, insieme a un qualificato partenariato industriale e scientifico.
      </>
    ),
  },
  {
    year: '2025',
    title: 'ConfInHub',
    body: (
      <>
        Campania DIH entra nella rete di ConfINHub, il <strong>Polo Nazionale di Innovazione Digitale di Confindustria,</strong> nato nell’ambito di un progetto <strong>finanziato dal PNRR.</strong>
      </>
    ),
  },
  {
    year: '2026',
    title: <>Nasce <br />Innova.CO</>,
    body: (
      <>
        Il Campania DIH continua la sua evoluzione e dà vita a Innova.Co., <strong>una community dedicata a innovatori, imprese e nuove opportunità di collaborazione.</strong>
      </>
    ),
  },
]

const yearCircle =
  'rounded-full bg-[#E3EAEC] flex items-center justify-center text-[#013167] tracking-[0.12em] shadow-[-6px_-6px_14px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.8)]'
const pillOuter =
  'rounded-full bg-[#E3EAEC]/50 border border-white/50 shadow-[-6px_-6px_16px_rgba(255,255,255,0.7),10px_10px_28px_rgba(164,177,188,0.5)]'
const pillInner =
  'rounded-full bg-gradient-to-b from-[#DCE4E8] to-[#E7EDF0] shadow-[inset_5px_5px_12px_rgba(164,177,188,0.5),inset_-5px_-5px_12px_rgba(255,255,255,0.75)]'
const bodyText =
  'leading-normal font-light text-brand-dark-navy [&_strong]:font-semibold'

// Desktop geometry (px): each row hosts one half ring hugging the pill's rounded end.
// Rows are exactly one ring tall and alternately shifted sideways, so consecutive rings
// are joined by a short horizontal segment; the line opens/closes with a short curl.
const PILL_H = 236
const STROKE = 11
const RING_R = PILL_H / 2 + 1 + STROKE / 2
const ROW = 2 * RING_R
const SHIFT = 24
const CURL = 40
const SVG_W = 2 * (RING_R + STROKE + SHIFT)
const TRACK_H = TIMELINE.length * ROW
const LAST = TIMELINE.length - 1

type Segment = { y0: number; y1: number; length: number; arcCenter?: number }

const rowTop = (i: number) => i * ROW
// Rows with the text on the left sit slightly right of the axis, and vice versa
const rowShift = (i: number) => (i % 2 === 0 ? SHIFT : -SHIFT)
const rowX = (i: number) => SVG_W / 2 + rowShift(i)
// The curls point towards the pill side of their row
const curlX = (i: number) => rowX(i) + (i % 2 === 0 ? -CURL : CURL)

const SEGMENTS: Segment[] = [
  { y0: 0, y1: 0, length: CURL },
  ...TIMELINE.flatMap((_, i): Segment[] => {
    const arc = { y0: rowTop(i), y1: rowTop(i + 1), length: Math.PI * RING_R, arcCenter: rowTop(i) + RING_R }
    if (i === LAST) return [arc]
    return [arc, { y0: rowTop(i + 1), y1: rowTop(i + 1), length: 2 * SHIFT }]
  }),
  { y0: TRACK_H, y1: TRACK_H, length: CURL },
]
const TOTAL_LENGTH = SEGMENTS.reduce((sum, seg) => sum + seg.length, 0)

const TRACK_PATH = TIMELINE.reduce((d, _, i) => {
  const sweep = i % 2 === 0 ? 1 : 0
  return `${d} L ${rowX(i)} ${rowTop(i)} A ${RING_R} ${RING_R} 0 0 ${sweep} ${rowX(i)} ${rowTop(i + 1)}`
}, `M ${curlX(0)} 0`) + ` L ${curlX(LAST)} ${TRACK_H}`

// Converts a vertical position on the track into the path length drawn up to it
function lengthAtY(y: number) {
  let length = 0
  for (const seg of SEGMENTS) {
    if (y >= seg.y1) {
      length += seg.length
      continue
    }
    if (y > seg.y0) {
      length += seg.arcCenter === undefined
        ? y - seg.y0
        : RING_R * Math.acos((seg.arcCenter - y) / RING_R)
    }
    break
  }
  return length
}

export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<SVGSVGElement>(null)
  const fillPathRef = useRef<SVGPathElement>(null)
  const mobileLineRef = useRef<HTMLDivElement>(null)
  const mobileFillRef = useRef<HTMLDivElement>(null)
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      // The line's tip follows a marker slightly above the middle of the viewport
      const marker = window.innerHeight * 0.55
      const track = trackRef.current?.getBoundingClientRect()
      const circles = Array.from(section.querySelectorAll<HTMLElement>('[data-year-circle]'))
        .filter((el) => el.offsetParent !== null)
      // The mobile line runs from the first year circle to the last one, not past it
      const mobileLineEl = mobileLineRef.current
      if (mobileLineEl && mobileLineEl.offsetParent !== null && circles.length > 1) {
        const span = circles[circles.length - 1].getBoundingClientRect().top - circles[0].getBoundingClientRect().top
        mobileLineEl.style.height = `${span}px`
      }
      const mobileLine = mobileLineEl?.getBoundingClientRect()
      // The line is written straight to the DOM on every frame, so it tracks the scroll
      // without re-rendering React; only the circle highlight goes through state
      const fillPath = fillPathRef.current
      if (fillPath && track) {
        const length = marker > track.top ? lengthAtY(Math.min(marker - track.top, TRACK_H)) : 0
        fillPath.style.strokeDashoffset = String(TOTAL_LENGTH - length)
        fillPath.style.opacity = length > 0 ? '1' : '0'
      }
      const mobileFill = mobileFillRef.current
      if (mobileFill && mobileLine && mobileLine.height > 0) {
        const progress = Math.min(Math.max((marker - mobileLine.top) / mobileLine.height, 0), 1)
        mobileFill.style.transform = `scaleY(${progress})`
      }
      setActiveCount(circles.filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.top + rect.height / 2 <= marker
      }).length)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="w-full max-w-[1200px] mx-auto mb-40 lg:mb-56 reveal-element">
      <h2 className="text-[28px] sm:text-[32px] lg:text-[38px] font-light text-[#013167] leading-[1.2] mb-14 lg:mb-20" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        L’hub che evolve a<br className="hidden sm:block" /> supporto della transizione<br className="hidden sm:block" /> sicura delle imprese
      </h2>

      {/* Desktop: alternating pills joined by a continuous snake line around the year circles */}
      <div className="hidden lg:block relative max-w-[1100px] mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <svg
          ref={trackRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 overflow-visible pointer-events-none"
          width={SVG_W}
          height={TRACK_H}
          viewBox={`0 0 ${SVG_W} ${TRACK_H}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="timeline-fill" x1="0" y1="0" x2="0" y2={TRACK_H} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8EBEF7" />
              <stop offset="1" stopColor="#2F7BE0" />
            </linearGradient>
          </defs>
          <path d={TRACK_PATH} fill="none" stroke="#8EBEF7" strokeOpacity={0.4} strokeWidth={STROKE} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(142,190,247,0.45)]" />
          <path
            ref={fillPathRef}
            d={TRACK_PATH}
            fill="none"
            stroke="url(#timeline-fill)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={TOTAL_LENGTH}
            className="drop-shadow-[0_0_10px_rgba(142,190,247,0.7)]"
            style={{ strokeDashoffset: TOTAL_LENGTH, opacity: 0 }}
          />
        </svg>

        {TIMELINE.map((item, index) => {
          const textLeft = index % 2 === 0
          return (
            <div key={item.year} className="relative" style={{ height: ROW }}>
              <div
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 p-4',
                  pillOuter,
                  textLeft ? 'left-0' : 'right-0',
                )}
                style={{
                  height: PILL_H,
                  [textLeft ? 'right' : 'left']: `calc(50% - ${SHIFT + PILL_H / 2}px)`,
                }}
              >
                <div
                  className={cn(
                    'h-full flex items-center',
                    pillInner,
                    textLeft ? 'pl-12 pr-[222px]' : 'pr-12 pl-[222px]',
                  )}
                >
                  <p className={cn(bodyText, 'text-[15px] xl:text-[16px]')}>{item.body}</p>
                </div>
              </div>

              <div
                data-year-circle
                className={cn(
                  'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-[180px] text-[38px] transition-[box-shadow,color] duration-500',
                  yearCircle,
                  index < activeCount && 'text-[#013167] shadow-[-6px_-6px_14px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.8),0_0_0_3px_rgba(142,190,247,0.9)]',
                  index >= activeCount && 'text-[#013167]/55',
                )}
                style={{ left: `calc(50% + ${rowShift(index)}px)` }}
              >
                {item.year}
              </div>

              <h3
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 text-[30px] font-medium text-[#013167] leading-[1.1]',
                  !textLeft && 'text-right',
                )}
                style={{ [textLeft ? 'left' : 'right']: `calc(50% + ${SHIFT + RING_R + 30}px)` }}
              >
                {item.title}
              </h3>
            </div>
          )
        })}
      </div>

      {/* Mobile/tablet: vertical timeline */}
      <div className="lg:hidden relative pl-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div ref={mobileLineRef} className="absolute left-[44px] top-[38px] w-[4px] rounded-full bg-[#8EBEF7]/35 overflow-hidden">
          <div ref={mobileFillRef} className="h-full w-full rounded-full bg-gradient-to-b from-[#8EBEF7] to-[#2F7BE0] origin-top will-change-transform" style={{ transform: 'scaleY(0)' }} />
        </div>
        <ol className="relative space-y-12">
          {TIMELINE.map((item, index) => (
            <li key={item.year} className="relative flex gap-5 items-start">
              <div
                data-year-circle
                className={cn(
                  'relative shrink-0 size-[76px] text-[17px] transition-[box-shadow,color] duration-500',
                  yearCircle,
                  index < activeCount && 'shadow-[-6px_-6px_14px_rgba(255,255,255,0.9),8px_8px_20px_rgba(164,177,188,0.8),0_0_0_3px_rgba(142,190,247,0.9)]',
                  index >= activeCount && 'text-[#013167]/55',
                )}
              >
                {item.year}
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-medium text-[#013167] leading-tight mb-3 [&_br]:hidden">{item.title}</h3>
                <p className={cn(bodyText, 'text-[15px]')}>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
