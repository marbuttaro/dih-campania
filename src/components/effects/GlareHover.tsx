import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface GlareHoverProps {
  width?: string
  height?: string
  background?: string
  borderRadius?: string
  borderColor?: string
  children?: ReactNode
  glareColor?: string
  glareOpacity?: number
  glareAngle?: number
  glareSize?: number
  transitionDuration?: number
  playOnce?: boolean
  className?: string
  style?: CSSProperties
}

const hexToRgba = (hex: string, opacity: number) => {
  const value = hex.replace('#', '')
  if (/^[0-9A-Fa-f]{6}$/.test(value)) {
    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  if (/^[0-9A-Fa-f]{3}$/.test(value)) {
    const r = parseInt(value[0] + value[0], 16)
    const g = parseInt(value[1] + value[1], 16)
    const b = parseInt(value[2] + value[2], 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return hex
}

export function GlareHover({
  width = '100%',
  height = '100%',
  background = 'transparent',
  borderRadius = '24px',
  borderColor = 'transparent',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -45,
  glareSize = 200,
  transitionDuration = 650,
  playOnce = false,
  className,
  style,
}: GlareHoverProps) {
  const rgba = hexToRgba(glareColor, glareOpacity)

  const vars: CSSProperties = {
    width,
    height,
    background,
    borderRadius,
    borderColor,
    ['--gh-angle' as string]: `${glareAngle}deg`,
    ['--gh-duration' as string]: `${transitionDuration}ms`,
    ['--gh-size' as string]: `${glareSize}%`,
    ['--gh-rgba' as string]: rgba,
  }

  return (
    <div
      className={cn(
        'glare-hover relative overflow-hidden',
        playOnce && 'glare-hover-once',
        className,
      )}
      style={{ ...vars, ...style }}
    >
      <div className="relative z-[2] w-full h-full pointer-events-auto">{children}</div>
      <style>{`
        .glare-hover::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--gh-angle),
            rgba(255, 255, 255, 0) 0%,
            var(--gh-rgba) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: var(--gh-duration) ease, opacity var(--gh-duration) ease;
          background-size: var(--gh-size) var(--gh-size);
          background-repeat: no-repeat;
          background-position: -150% -150%;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
        }
        .glare-hover:hover::before {
          background-position: 150% 150%;
          opacity: 1;
        }
        .glare-hover-once::before {
          transition: none;
        }
        .glare-hover-once:hover::before {
          transition: var(--gh-duration) ease;
          background-position: 150% 150%;
        }
      `}</style>
    </div>
  )
}
