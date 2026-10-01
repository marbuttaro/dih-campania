import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, Mail, X } from 'lucide-react'
import { Checkbox, Field, NavButton } from '@/pages/innova-co/SolutionRequestModal'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Linguetta fissa sul bordo destro che apre il form di iscrizione alla newsletter
export function NewsletterTab() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [consensoPrivacy, setConsensoPrivacy] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const resetAndClose = () => {
    setOpen(false)
    setTimeout(() => {
      setEmail('')
      setConsensoPrivacy(false)
      setSubmitted(false)
    }, 300)
  }

  const canSubmit = EMAIL_PATTERN.test(email.trim()) && consensoPrivacy

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
    setTimeout(resetAndClose, 2500)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose()
        else setOpen(true)
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed right-0 top-1/2 z-40 -translate-y-1/2 flex flex-col items-center gap-3 rounded-l-xl bg-[#8EBEF7] px-2.5 py-4 sm:px-3 sm:py-5 text-[#013167] font-bold text-sm shadow-[0_10px_30px_rgba(0,25,51,0.25)] transition-colors hover:bg-white"
        >
          <Mail className="size-4 sm:size-5 shrink-0 -rotate-90" />
          <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
            Iscriviti alla newsletter
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-white/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[520px] max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-[32px] sm:rounded-[40px] bg-[#EDF1F3] p-8 sm:p-12 shadow-[0_30px_60px_rgba(0,25,51,0.18),0_10px_25px_rgba(0,25,51,0.08)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close className="absolute right-6 top-6 sm:right-8 sm:top-8 inline-flex items-center justify-center size-9 rounded-xl bg-[#E7EDF0] text-brand-navy/60 hover:text-brand-navy shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(164,177,188,0.45)] transition-colors">
            <X className="size-4" />
            <span className="sr-only">Chiudi</span>
          </Dialog.Close>

          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <div className="size-16 rounded-full bg-brand-light-blue/20 flex items-center justify-center mb-5 border border-brand-light-blue/40">
                <Check className="size-8 text-brand-navy" strokeWidth={2.5} />
              </div>
              <Dialog.Title className="text-2xl font-semibold text-brand-navy mb-2">
                Iscrizione completata!
              </Dialog.Title>
              <Dialog.Description className="text-brand-dark-navy/70">
                Grazie, riceverai le ultime novità del Campania DIH.
              </Dialog.Description>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              <Dialog.Title className="text-3xl sm:text-4xl font-light text-brand-navy text-center mb-3 mt-6 sm:mt-2">
                Iscriviti alla newsletter
              </Dialog.Title>
              <Dialog.Description className="text-center text-brand-dark-navy/60 mb-8">
                Compila il form e resta aggiornato sulle ultime novità del Campania DIH
              </Dialog.Description>

              <div className="space-y-5">
                <Field label="Mail" value={email} onChange={setEmail} type="email" />

                <Checkbox
                  checked={consensoPrivacy}
                  onChange={() => setConsensoPrivacy((v) => !v)}
                  className="italic"
                >
                  Dichiaro di aver letto e compreso l'Informativa sul trattamento dei dati personali
                  ai sensi del Regolamento (UE) 2016/679 (GDPR) e acconsento al trattamento dei dati
                  per l'invio della newsletter.{' '}
                  <span className="font-bold not-italic">Visualizza informativa Privacy.</span>
                </Checkbox>
              </div>

              <div className="flex justify-end mt-10">
                <NavButton direction="forward" onClick={handleSubmit} disabled={!canSubmit}>
                  Iscriviti
                </NavButton>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
