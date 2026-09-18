import { useEffect, useRef } from 'react'

const BEAM_COUNT = 16
const DOT_COUNT = 46
const LIGHT_BLUE = '142, 190, 247' // brand-light-blue
const NAVY = '1, 49, 103' // brand-navy

interface Pulse {
  t: number
  speed: number
}

interface Beam {
  angle: number
  edgeFactor: number
  pulses: Pulse[]
}

interface Dot {
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
}

/**
 * Glowing beams and particles that drift/converge toward the viewport center,
 * loosely inspired by 21st.dev's "Gateway Flow", recolored to the site's
 * navy/light-blue palette and kept low-opacity so overlaid text stays legible.
 */
export function GatewayFlow({ centerYOffset = 0 }: { centerYOffset?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const beams: Beam[] = Array.from({ length: BEAM_COUNT }, (_, i) => ({
      angle: (i / BEAM_COUNT) * Math.PI * 2 + Math.random() * 0.15,
      edgeFactor: 0.85 + Math.random() * 0.25,
      pulses: Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => ({
        t: Math.random(),
        speed: 0.0016 + Math.random() * 0.0018,
      })),
    }))

    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.15 + Math.random() * 0.8,
      speed: 0.00035 + Math.random() * 0.0006,
      size: 1.4 + Math.random() * 2,
      opacity: 0.25 + Math.random() * 0.35,
    }))

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2 - centerYOffset
      const maxR = Math.hypot(width, height) / 2
      const endR = maxR * 0.12 // beams stop short of dead-center so the text stays clear

      beams.forEach((beam) => {
        const edgeR = maxR * beam.edgeFactor
        const x0 = cx + Math.cos(beam.angle) * edgeR
        const y0 = cy + Math.sin(beam.angle) * edgeR
        const x1 = cx + Math.cos(beam.angle) * endR
        const y1 = cy + Math.sin(beam.angle) * endR

        const grad = ctx.createLinearGradient(x0, y0, x1, y1)
        grad.addColorStop(0, `rgba(${LIGHT_BLUE}, 0)`)
        grad.addColorStop(0.55, `rgba(${LIGHT_BLUE}, 0.16)`)
        grad.addColorStop(0.85, `rgba(${NAVY}, 0.22)`)
        grad.addColorStop(1, `rgba(${NAVY}, 0)`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()

        beam.pulses.forEach((pulse) => {
          pulse.t += pulse.speed
          if (pulse.t > 1) pulse.t = 0
          const px = x0 + (x1 - x0) * pulse.t
          const py = y0 + (y1 - y0) * pulse.t
          const fade = Math.sin(pulse.t * Math.PI)

          const glow = ctx.createRadialGradient(px, py, 0, px, py, 10)
          glow.addColorStop(0, `rgba(255, 255, 255, ${0.55 * fade})`)
          glow.addColorStop(0.4, `rgba(${LIGHT_BLUE}, ${0.4 * fade})`)
          glow.addColorStop(1, `rgba(${LIGHT_BLUE}, 0)`)
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(px, py, 10, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      dots.forEach((dot) => {
        dot.radius -= dot.speed
        if (dot.radius < 0.08) {
          dot.radius = 0.9 + Math.random() * 0.15
          dot.angle = Math.random() * Math.PI * 2
        }

        const r = maxR * dot.radius
        const x = cx + Math.cos(dot.angle) * r
        const y = cy + Math.sin(dot.angle) * r

        const growIn = Math.min(1, Math.max(0, (0.95 - dot.radius) / 0.2))
        const fadeOut = Math.min(1, Math.max(0, dot.radius / 0.25))
        const envelope = Math.min(growIn, fadeOut)

        ctx.fillStyle = `rgba(${LIGHT_BLUE}, ${dot.opacity * envelope})`
        ctx.beginPath()
        ctx.arc(x, y, dot.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [centerYOffset])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block z-0 pointer-events-none"
    />
  )
}
