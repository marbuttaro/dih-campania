import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { BlurText } from '@/components/effects/BlurText'
import { ParticleNetwork } from '@/components/effects/ParticleNetwork'
import { articleUrl, listArticles } from '@/lib/articles'

const TICKER_SEPARATOR = '\u00a0\u00a0\u00a0\u00a0|\u00a0\u00a0\u00a0\u00a0'

function TickerItems({ items, hidden = false }: { items: { slug: string; title: string }[]; hidden?: boolean }) {
  return (
    <span className="flex shrink-0" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item.slug} className="flex shrink-0">
          <a
            href={articleUrl(item.slug)}
            tabIndex={hidden ? -1 : undefined}
            className="hover:underline underline-offset-4 decoration-white/70"
          >
            {item.title}
          </a>
          <span className="text-white/60">{TICKER_SEPARATOR}</span>
        </span>
      ))}
    </span>
  )
}

/**
 * Striscia delle news che scorre. Lo scorrimento sposta la posizione di un contenitore
 * (scrollLeft) invece di traslare un unico elemento lungo migliaia di pixel: su iPhone
 * un elemento animato così largo supera i limiti di Safari e una parte delle news spariva.
 */
function NewsTicker({ items }: { items: { slug: string; title: string }[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const halfRef = useRef<HTMLSpanElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const viewport = viewportRef.current
    const half = halfRef.current
    if (!viewport || !half) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let last = performance.now()
    let position = viewport.scrollLeft
    const step = (now: number) => {
      const width = half.getBoundingClientRect().width
      // Stessa durata di prima: un giro completo in 60 s da computer, 30 s da telefono
      const speed = width / (window.innerWidth <= 640 ? 30 : 60)
      if (!pausedRef.current && width > 0) {
        position += (speed * (now - last)) / 1000
        if (position >= width) position -= width
        viewport.scrollLeft = position
      }
      last = now
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [items])

  return (
    <div
      ref={viewportRef}
      className="overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="flex w-max">
        <span ref={halfRef} className="flex shrink-0">
          <TickerItems items={items} />
        </span>
        <TickerItems items={items} hidden />
      </div>
    </div>
  )
}

export function Hero() {
  const [headlines, setHeadlines] = useState<{ slug: string; title: string }[]>([])
  useEffect(() => {
    let alive = true
    listArticles({ limit: 5 }).then(({ articles }) => { if (alive) setHeadlines(articles) }).catch(() => { /* Archive link stays available during an outage. */ })
    return () => { alive = false }
  }, [])
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 sm:pt-28 bg-[linear-gradient(135deg,#001933_0%,#013167_50%,#001933_100%)]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ParticleNetwork />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,25,51,0.7)_0%,rgba(0,25,51,0.3)_60%,transparent_100%)]" />
      </div>

      <div className="container-page relative z-10 w-full flex justify-center text-center">
        <div className="max-w-[950px] flex flex-col items-center">
          <h1 className="mb-8 text-[2.15rem] sm:text-6xl lg:text-[4.2rem] font-medium text-white leading-[1.1] flex flex-col items-center">
            <BlurText
              text="Il punto di riferimento per"
              delay={100}
              stepDuration={0.45}
              animateBy="words"
              direction="top"
              className="font-light text-white/85 mb-2 block"
              startDelay={0}
            />
            <BlurText
              text={'la trasformazione digitale.'}
              delay={100}
              stepDuration={0.45}
              animateBy="words"
              direction="top"
              className="font-bold text-brand-light-blue block"
              startDelay={650}
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 1, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <p className="mb-10 max-w-[720px] text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed text-center">
              Accompagniamo imprese e PMI campane nel percorso verso <br className="hidden sm:inline" />
              l'innovazione tecnologica, la sostenibilità e la competitività.
            </p>
            <a
              href="/servizi"
              className="btn-outline px-8 py-3.5"
            >
              Scopri di più
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap border-t border-white/20 bg-[rgba(100,130,160,0.4)] backdrop-blur-md py-3 text-white text-sm">
        {headlines.length ? (
          <NewsTicker items={headlines} />
        ) : (
          <a href="/news" className="px-8 underline">Scopri tutte le news e le opportunità di Campania DIH ↗</a>
        )}
      </div>
    </section>
  )
}
