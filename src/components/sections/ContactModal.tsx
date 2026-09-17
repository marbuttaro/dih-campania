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
      <div className="absolute inset-0 overflow-y-auto overscroll-contain bg-[url('/assets/background_page.png')] bg-cover bg-center">
        <div className="relative min-h-full w-full pt-24 pb-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute top-6 right-6 z-10 flex items-center justify-center size-10 rounded-full bg-brand-navy/10 border border-brand-navy/20 text-brand-navy hover:bg-brand-navy/20 transition-colors"
          >
            <X className="size-5" />
          </button>

          <div className="container-page">
            <ContactFormCard />
          </div>
        </div>
      </div>
    </div>
  )
}
