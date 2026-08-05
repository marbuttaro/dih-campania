import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface NetworkHotspot {
  label: string
  align: 'left' | 'right'
}

// Exact layout of the source artwork (public/assets/innova-co/cosa-troverai.svg):
// every node and connecting line, in the same 1415x703 coordinate space. Node
// order matches NETWORK_HOTSPOTS' three interactive nodes at indices 8, 9, 10.
const VIEWBOX_WIDTH = 1415
const VIEWBOX_HEIGHT = 703

interface NodeDef {
  cx: number
  cy: number
  r: number
  hotspotIndex: number | null
}

const NODES: NodeDef[] = [
  { cx: 1151.97, cy: 274.799, r: 50, hotspotIndex: null }, // N1
  { cx: 1335.97, cy: 344.799, r: 50, hotspotIndex: null }, // N2
  { cx: 1269.97, cy: 653.799, r: 32, hotspotIndex: null }, // N3
  { cx: 1148.97, cy: 457.799, r: 32, hotspotIndex: null }, // N4
  { cx: 1220.97, cy: 191.799, r: 32, hotspotIndex: null }, // N5
  { cx: 71.9673, cy: 466.799, r: 50, hotspotIndex: null }, // N6
  { cx: 76.9673, cy: 110.799, r: 34, hotspotIndex: null }, // N7
  { cx: 636.466, cy: 178.299, r: 56.5, hotspotIndex: null }, // N8
  { cx: 397.467, cy: 76.2992, r: 56.5, hotspotIndex: 0 }, // N9 — "Un primo orientamento"
  { cx: 423.467, cy: 389.299, r: 64, hotspotIndex: 1 }, // N10 — "La rete dei partner"
  { cx: 785.467, cy: 294.299, r: 33.5, hotspotIndex: 2 }, // N11 — "L'elenco dei servizi attivi"
  { cx: 1008.47, cy: 112.299, r: 47.5, hotspotIndex: null }, // N12
  { cx: 899.967, cy: 469.799, r: 81, hotspotIndex: null }, // N13
]

interface LineDef {
  x1: number
  y1: number
  x2: number
  y2: number
  from: number
  to: number
}

const LINES: LineDef[] = [
  { x1: 693.731, y1: 189.509, x2: 1120.73, y2: 442.509, from: 7, to: 3 },
  { x1: 960.093, y1: 414.58, x2: 1112.09, y2: 305.58, from: 12, to: 0 },
  { x1: 1179.08, y1: 447.593, x2: 1290.08, y2: 365.593, from: 3, to: 1 },
  { x1: 1257.53, y1: 625.232, x2: 1166.53, y2: 323.232, from: 2, to: 0 },
  { x1: 584.657, y1: 201.131, x2: 115.657, y2: 444.131, from: 7, to: 5 },
  { x1: 379.076, y1: 343.006, x2: 100.076, y2: 137.006, from: 9, to: 6 },
  { x1: 692.756, y1: 158.314, x2: 960.756, y2: 120.314, from: 7, to: 11 },
  { x1: 806.253, y1: 327.027, x2: 854.253, y2: 407.027, from: 10, to: 12 },
  { x1: 434.87, y1: 120.602, x2: 833.87, y2: 421.602, from: 8, to: 12 },
  { x1: 594.033, y1: 217.854, x2: 470.034, y2: 343.215, from: 7, to: 9 },
  { x1: 961.58, y1: 123.168, x2: 469.58, y2: 343.529, from: 11, to: 9 },
]

interface NodeState {
  offsetX: number
  offsetY: number
  vx: number
  vy: number
  baseSpeed: number
  warpX: number
  warpY: number
}

export function NetworkHotspots({ hotspots }: { hotspots: NetworkHotspot[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const groupRefs = useRef<(SVGGElement | null)[]>([])
  const lineRefs = useRef<(SVGPathElement | null)[]>([])
  const markerRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    let animationFrameId: number
    const repulsionRadius = 150

    const states: NodeState[] = NODES.map((node) => {
      if (node.hotspotIndex !== null) {
        return { offsetX: 0, offsetY: 0, vx: 0, vy: 0, baseSpeed: 0, warpX: 0, warpY: 0 }
      }
      const baseSpeed = 5 + Math.random() * 7
      const angle = Math.random() * Math.PI * 2
      return {
        offsetX: 0,
        offsetY: 0,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        baseSpeed,
        warpX: 0,
        warpY: 0,
      }
    })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const scale = rect.width / VIEWBOX_WIDTH
      mouseRef.current = {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null }
    }
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Ambient drift range for decorative nodes — kept small relative to node
    // spacing so lines never stretch far enough to expose empty gaps.
    const DRIFT_RANGE = 22

    const animate = () => {
      const mouse = mouseRef.current

      NODES.forEach((node, i) => {
        const state = states[i]
        if (node.hotspotIndex !== null) return

        state.offsetX += state.vx * 0.016
        state.offsetY += state.vy * 0.016

        if (state.offsetX < -DRIFT_RANGE || state.offsetX > DRIFT_RANGE) state.vx *= -1
        if (state.offsetY < -DRIFT_RANGE || state.offsetY > DRIFT_RANGE) state.vy *= -1
        state.offsetX = Math.max(-DRIFT_RANGE, Math.min(DRIFT_RANGE, state.offsetX))
        state.offsetY = Math.max(-DRIFT_RANGE, Math.min(DRIFT_RANGE, state.offsetY))

        let targetWarpX = 0
        let targetWarpY = 0
        if (mouse.x !== null && mouse.y !== null) {
          const nodeX = node.cx + state.offsetX
          const nodeY = node.cy + state.offsetY
          const dx = nodeX - mouse.x
          const dy = nodeY - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < repulsionRadius && dist > 0) {
            const force = (repulsionRadius - dist) / repulsionRadius
            targetWarpX = (dx / dist) * force * 30
            targetWarpY = (dy / dist) * force * 30
          }
        }
        // Eased toward the target so the wiggle feels elastic instead of snapping.
        state.warpX += (targetWarpX - state.warpX) * 0.12
        state.warpY += (targetWarpY - state.warpY) * 0.12

        const g = groupRefs.current[i]
        if (g) {
          g.setAttribute(
            'transform',
            `translate(${state.offsetX + state.warpX} ${state.offsetY + state.warpY})`,
          )
        }
      })

      // Lines follow each node's full live position (drift + warp) so they
      // never detach — and bow like an elastic band instead of staying rigid.
      LINES.forEach((line, i) => {
        const fromState = states[line.from]
        const toState = states[line.to]
        const el = lineRefs.current[i]
        if (!el) return

        const x1 = line.x1 + fromState.offsetX + fromState.warpX
        const y1 = line.y1 + fromState.offsetY + fromState.warpY
        const x2 = line.x2 + toState.offsetX + toState.warpX
        const y2 = line.y2 + toState.offsetY + toState.warpY

        const dx = x2 - x1
        const dy = y2 - y1
        const len = Math.hypot(dx, dy)
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        let controlX = midX
        let controlY = midY
        if (len > 0) {
          const nx = -dy / len
          const ny = dx / len
          const curvature = len * 0.06
          controlX += nx * curvature
          controlY += ny * curvature

          if (mouse.x !== null && mouse.y !== null) {
            const mx = midX - mouse.x
            const my = midY - mouse.y
            const mDist = Math.hypot(mx, my)
            if (mDist < repulsionRadius && mDist > 0) {
              const force = (repulsionRadius - mDist) / repulsionRadius
              controlX += (mx / mDist) * force * 26
              controlY += (my / mDist) * force * 26
            }
          }
        }

        el.setAttribute('d', `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`)
      })

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))' }}
      >
        <defs>
          <linearGradient id="network-shimmer" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" />
            <stop offset="0.5" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#FFFDFD" />
          </linearGradient>
        </defs>

        {LINES.map((line, i) => (
          <path
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            d={`M ${line.x1} ${line.y1} Q ${(line.x1 + line.x2) / 2} ${(line.y1 + line.y2) / 2} ${line.x2} ${line.y2}`}
            stroke="url(#network-shimmer)"
            strokeWidth={3}
            opacity={0.89}
          />
        ))}

        {NODES.map((node, i) => {
          const isHotspot = node.hotspotIndex !== null
          const isHovered = isHotspot && hoveredIndex === node.hotspotIndex
          return (
            <g
              key={i}
              ref={(el) => {
                groupRefs.current[i] = el
              }}
            >
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                stroke="url(#network-shimmer)"
                strokeWidth={node.r * 0.049}
                opacity={isHovered ? 1 : 0.89}
                style={{ transition: 'opacity 300ms ease-out' }}
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 0.58}
                stroke="url(#network-shimmer)"
                strokeWidth={node.r * 0.049}
                opacity={isHovered ? 1 : 0.89}
                style={{ transition: 'opacity 300ms ease-out' }}
              />
              {isHotspot && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isHovered ? node.r * 0.24 : node.r * 0.185}
                  fill={isHovered ? '#8ebef7' : '#001933'}
                  style={{ transition: 'r 300ms ease-out, fill 300ms ease-out' }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {hotspots.map((h, i) => {
        const node = NODES.find((n) => n.hotspotIndex === i)
        if (!node) return null
        const leftPct = (node.cx / VIEWBOX_WIDTH) * 100
        const topPct = (node.cy / VIEWBOX_HEIGHT) * 100
        // Hit area scales with the node's own (very different) sizes instead
        // of a fixed size, so the whole visible sphere stays hoverable.
        const hitSizePct = ((node.r * 2.6) / VIEWBOX_WIDTH) * 100
        return (
          <div key={h.label}>
            <button
              type="button"
              aria-label={h.label}
              className="absolute rounded-full pointer-events-auto"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${hitSizePct}%`,
                aspectRatio: '1 / 1',
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex((v) => (v === i ? null : v))}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex((v) => (v === i ? null : v))}
            />
            <div
              ref={(el) => {
                markerRefs.current[i] = el
              }}
              className="absolute z-10 size-0 pointer-events-none"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <span
                className={cn(
                  'pointer-events-none absolute top-1/2 -translate-y-1/2 z-10 w-44 sm:w-60 text-sm sm:text-lg font-light text-white leading-snug rounded-xl bg-brand-dark-navy/70 backdrop-blur-sm px-4 py-2.5 shadow-lg transition-opacity duration-300',
                  hoveredIndex === i ? 'opacity-100 delay-150' : 'opacity-0',
                  h.align === 'right' ? 'left-full ml-6 sm:ml-8' : 'right-full mr-6 sm:mr-8 text-right',
                )}
              >
                {h.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
