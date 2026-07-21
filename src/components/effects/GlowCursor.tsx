import { useEffect, useRef } from 'react'

const PROXIMITY = 50 // px from button edge

export function GlowCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const isNear = useRef(false)
  const rafId = useRef<number>(0)
  const buttonsCache = useRef<Element[]>([])
  const lastCacheTime = useRef(0)

  useEffect(() => {
    // Only enable on mouse devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    const el = cursorRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const now = Date.now()
      // Refresh button list every 600ms instead of every frame
      if (now - lastCacheTime.current > 600) {
        buttonsCache.current = Array.from(
          document.querySelectorAll('button, a[href], [role="button"]')
        ).filter(el => !el.closest('[data-no-glow]') && !el.closest('[aria-hidden="true"]'))
        lastCacheTime.current = now
      }

      const { x, y } = mouse.current
      let near = false

      for (const btn of buttonsCache.current) {
        const r = btn.getBoundingClientRect()
        const cx = Math.max(r.left, Math.min(x, r.right))
        const cy = Math.max(r.top, Math.min(y, r.bottom))
        if (Math.hypot(x - cx, y - cy) < PROXIMITY) {
          near = true
          break
        }
      }

      if (near !== isNear.current) {
        isNear.current = near
        el.style.opacity = near ? '1' : '0'
        document.body.style.cursor = near ? 'none' : ''
      }

      el.style.left = `${x}px`
      el.style.top = `${y}px`

      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed pointer-events-none select-none z-[9999]"
      style={{
        opacity: 0,
        left: -9999,
        top: -9999,
        width: 280,
        height: 280,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.18s ease',
        background:
          'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(180,215,255,0.92) 6%, rgba(142,190,247,0.80) 18%, rgba(142,190,247,0.35) 36%, rgba(142,190,247,0.08) 55%, transparent 100%)',
      }}
    />
  )
}
