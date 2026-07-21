import { useEffect, useRef, useState } from 'react'

interface TextTypeProps {
  text: string
  typingSpeed?: number
  cursorCharacter?: string
  className?: string
  active?: boolean
  startDelay?: number
}

export function TextType({
  text,
  typingSpeed = 60,
  cursorCharacter = '|',
  className = '',
  active = true,
  startDelay = 0,
}: TextTypeProps) {
  const [displayed, setDisplayed] = useState('')
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!active || hasStarted.current) return
    hasStarted.current = true

    let index = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const typeNext = () => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index < text.length) {
        timeoutId = setTimeout(typeNext, typingSpeed)
      }
    }

    timeoutId = setTimeout(typeNext, startDelay)
    return () => clearTimeout(timeoutId)
  }, [active, text, typingSpeed, startDelay])

  return (
    <span className={className}>
      {displayed}
      {displayed.length > 0 && (
        <span className="inline-block animate-blink-cursor" aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}
