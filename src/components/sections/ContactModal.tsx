import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ContactFormCard } from './ContactFormCard'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Form di contatto">
      <div className="absolute inset-0 bg-brand-dark-navy/80 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 overflow-y-auto overscroll-contain">
        <div className="relative min-h-full w-full bg-[url('/assets/sfondo_contatti_mobile.png')] bg-cover bg-center px-4 pt-24 pb-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute top-6 right-6 z-10 flex items-center justify-center size-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X className="size-5" />
          </button>

          <ContactFormCard />
        </div>
      </div>
    </div>
  )
}
