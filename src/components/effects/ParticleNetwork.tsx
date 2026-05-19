import { useEffect, useRef } from 'react'

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor((width * height) / 12500), 90)
    const repulsionRadius = 190
    const accentColor = '#8ebef7' // brand-light-blue

    interface Particle {
      baseX: number
      baseY: number
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      baseSpeed: number
      renderX: number
      renderY: number
      activeForce: number
    }

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      const baseSpeed = 0.12 + Math.random() * 0.18
      const angle = Math.random() * Math.PI * 2
      const startX = Math.random() * width
      const startY = Math.random() * height
      
      particles.push({
        baseX: startX,
        baseY: startY,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: 2.2 + Math.random() * 2.3, // Size 2.2px to 4.5px
        baseSpeed,
        renderX: startX,
        renderY: startY,
        activeForce: 0,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null }
    }

    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const handleResize = () => {
      const oldWidth = width
      const oldHeight = height
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight

      const scaleX = oldWidth > 0 ? width / oldWidth : 1
      const scaleY = oldHeight > 0 ? height / oldHeight : 1

      particles.forEach((p) => {
        p.baseX *= scaleX
        p.baseY *= scaleY
        p.x *= scaleX
        p.y *= scaleY
        p.renderX *= scaleX
        p.renderY *= scaleY
      })
    }
    window.addEventListener('resize', handleResize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const mouse = mouseRef.current

      // Draw Mouse Glow Aura (Multi-layered realistic high-intensity bloom)
      if (mouse.x !== null && mouse.y !== null) {
        const coreGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          45
        )
        coreGlow.addColorStop(0, 'rgba(142, 190, 247, 0.90)')
        coreGlow.addColorStop(0.3, 'rgba(142, 190, 247, 0.50)')
        coreGlow.addColorStop(1, 'rgba(142, 190, 247, 0)')
        ctx.fillStyle = coreGlow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2)
        ctx.fill()

        const midGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          15,
          mouse.x,
          mouse.y,
          95
        )
        midGlow.addColorStop(0, 'rgba(142, 190, 247, 0.45)')
        midGlow.addColorStop(0.5, 'rgba(142, 190, 247, 0.15)')
        midGlow.addColorStop(1, 'rgba(142, 190, 247, 0)')
        ctx.fillStyle = midGlow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 95, 0, Math.PI * 2)
        ctx.fill()

        const largeGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          35,
          mouse.x,
          mouse.y,
          140
        )
        largeGlow.addColorStop(0, 'rgba(142, 190, 247, 0.20)')
        largeGlow.addColorStop(0.6, 'rgba(142, 190, 247, 0.05)')
        largeGlow.addColorStop(1, 'rgba(142, 190, 247, 0)')
        ctx.fillStyle = largeGlow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2)
        ctx.fill()
      }

      // Soft inter-particle repulsion
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p2.baseX - p1.baseX
          const dy = p2.baseY - p1.baseY
          const distSq = dx * dx + dy * dy
          const minDist = 65
          const minDistSq = minDist * minDist
          
          if (distSq < minDistSq && distSq > 0) {
            const dist = Math.sqrt(distSq)
            const force = (minDist - dist) / minDist
            const angle = Math.atan2(dy, dx)
            
            const pushX = Math.cos(angle) * force * 0.08
            const pushY = Math.sin(angle) * force * 0.08
            p1.vx -= pushX
            p1.vy -= pushY
            p2.vx += pushX
            p2.vy += pushY
          }
        }
      }

      // Update positions and handle Morphing Warp Easing
      particles.forEach((p) => {
        p.baseX += p.vx
        p.baseY += p.vy

        // Boundary collision for base positions
        if (p.baseX < 0) {
          p.baseX = 0
          p.vx *= -1
        } else if (p.baseX > width) {
          p.baseX = width
          p.vx *= -1
        }
        if (p.baseY < 0) {
          p.baseY = 0
          p.vy *= -1
        } else if (p.baseY > height) {
          p.baseY = height
          p.vy *= -1
        }

        // Speed limiting
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > p.baseSpeed * 1.5) {
          p.vx *= 0.95
          p.vy *= 0.95
        }

        // Warp Target Coordinates
        let targetX = p.baseX
        let targetY = p.baseY
        p.activeForce = 0

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.baseX - mouse.x
          const dy = p.baseY - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius
            const angle = Math.atan2(dy, dx)
            
            const warpDistance = force * 65
            targetX += Math.cos(angle) * warpDistance
            targetY += Math.sin(angle) * warpDistance
            p.activeForce = force
          }
        }

        // Elastic Lerp Easing
        p.x += (targetX - p.x) * 0.07
        p.y += (targetY - p.y) * 0.07

        p.renderX = p.x
        p.renderY = p.y
      })

      // Draw Connective Network lines (Drawn dynamically to the closest neighbors strictly under 170px)
      const drawnConnections = new Set<string>()
      const N = 3 // Max 3 nearest connections per node
      const maxDistance = 170 // Strict distance threshold to completely eliminate long lines

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        // Find nearest 3 neighbors on current DEFORMED coordinates within the maximum distance limit
        const neighbors = particles
          .map((p2, idx) => ({
            index: idx,
            dist: Math.sqrt((p2.renderX - p1.renderX) * (p2.renderX - p1.renderX) + (p2.renderY - p1.renderY) * (p2.renderY - p1.renderY))
          }))
          .filter((item) => item.index !== i && item.dist < maxDistance)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, N)

        neighbors.forEach((neighbor) => {
          const p2 = particles[neighbor.index]
          const key = i < neighbor.index ? `${i}-${neighbor.index}` : `${neighbor.index}-${i}`
          
          if (!drawnConnections.has(key)) {
            drawnConnections.add(key)
            
            const dx = p2.renderX - p1.renderX
            const dy = p2.renderY - p1.renderY
            const len = neighbor.dist

            if (len > 0) {
              const midX = (p1.renderX + p2.renderX) / 2
              const midY = (p1.renderY + p2.renderY) / 2
              
              const nx = -dy / len
              const ny = dx / len
              
              const curvature = len * 0.12
              let controlX = midX + nx * curvature
              let controlY = midY + ny * curvature

              // Dynamic curve warping away from mouse cursor
              if (mouse.x !== null && mouse.y !== null) {
                const mx = midX - mouse.x
                const my = midY - mouse.y
                const mDist = Math.sqrt(mx * mx + my * my)
                
                if (mDist < repulsionRadius) {
                  const force = (repulsionRadius - mDist) / repulsionRadius
                  controlX += (mx / mDist) * force * 50
                  controlY += (my / mDist) * force * 50
                }
              }

              // Delicate connection line with constant subtle opacity (0.18)
              ctx.strokeStyle = 'rgba(142, 190, 247, 0.18)'
              ctx.lineWidth = 1.0
              ctx.beginPath()
              ctx.moveTo(p1.renderX, p1.renderY)
              ctx.quadraticCurveTo(controlX, controlY, p2.renderX, p2.renderY)
              ctx.stroke()
            }
          }
        })
      }

      // Draw dots on top with high-intensity GLARE when active
      particles.forEach((p) => {
        if (p.activeForce > 0) {
          const glareRadius = p.radius * (2.2 + p.activeForce * 4.2)
          const glareGlow = ctx.createRadialGradient(
            p.renderX,
            p.renderY,
            p.radius * 0.5,
            p.renderX,
            p.renderY,
            glareRadius
          )
          
          glareGlow.addColorStop(0, '#ffffff')
          glareGlow.addColorStop(0.2, '#ffffff')
          glareGlow.addColorStop(0.4, `rgba(142, 190, 247, ${0.8 + p.activeForce * 0.2})`)
          glareGlow.addColorStop(0.7, `rgba(142, 190, 247, ${0.4 * p.activeForce})`)
          glareGlow.addColorStop(1, 'rgba(142, 190, 247, 0)')

          ctx.fillStyle = glareGlow
          ctx.beginPath()
          ctx.arc(p.renderX, p.renderY, glareRadius, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(p.renderX, p.renderY, p.radius * 1.3, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = accentColor
          ctx.beginPath()
          ctx.arc(p.renderX, p.renderY, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block z-0"
    />
  )
}
