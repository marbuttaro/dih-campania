import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MotionConfig, motion, type Variants } from 'framer-motion'
import { X } from 'lucide-react'

const POSTER = '/assets/eventi/learning-by-dih-2026-locandina.webp'

const EASE = [0.22, 1, 0.36, 1] as const

// Ingresso all'apertura della pagina: il banner sale e si apre, lo sfondo si assesta,
// poi compaiono il riquadro in vetro e, in sequenza, titolo, pulsante e testo
const card: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: EASE,
      delay: 0.35,
      when: 'beforeChildren',
      staggerChildren: 0.12,
    },
  },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** Banner "Learning by DIH 2026" in testa alla pagina Eventi: il pulsante apre la locandina in un pop-up */
export function LearningByDihBanner() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <MotionConfig reducedMotion="user">
        <motion.section
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative overflow-hidden rounded-[24px] bg-[#020f2a] px-4 py-10 sm:px-[43px] sm:py-[85px]"
        >
          <motion.div
            aria-hidden
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/assets/eventi/learning-by-dih-sfondo.webp')",
            }}
          />
          {/* Lo sfondo originale è molto luminoso: lo scuriamo come nel design */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,36,0.78)_0%,rgba(2,16,44,0.55)_55%,rgba(2,12,36,0.45)_100%)]" />

          <motion.div
            variants={card}
            initial="hidden"
            animate="visible"
            className="relative mx-auto max-w-[885px] rounded-[16px] border border-white/40 bg-white/[0.08] backdrop-blur-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.25)] px-7 py-9 sm:px-[51px] sm:pt-[70px] sm:pb-[54px] grid grid-cols-1 md:grid-cols-[1fr_276px] gap-8 md:gap-[48px] items-center"
          >
            <div>
              <h2 className="text-[40px] sm:text-[58px] leading-[1.03] tracking-[-0.01em]">
                <motion.span variants={item} className="block font-semibold text-brand-light-blue">
                  Learning by
                </motion.span>
                <motion.span variants={item} className="block font-light text-white">
                  DIH 2026
                </motion.span>
              </h2>
              <motion.div variants={item}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="mt-8 sm:mt-[48px] inline-flex items-center rounded-[8px] border border-white/60 bg-white/10 px-[19px] py-[7px] text-[17px] sm:text-[20px] leading-[24px] font-semibold text-white backdrop-blur-md shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-brand-light-blue hover:text-brand-dark-navy hover:-translate-y-0.5 cursor-pointer"
                  >
                    Scopri il calendario completo
                  </button>
                </Dialog.Trigger>
              </motion.div>
            </div>
            <motion.p variants={item} className="text-[17px] sm:text-[20.5px] font-light text-white/90 leading-[27px]">
              Tutti gli appuntamenti su temi e strumenti in materia di innovazione e trasformazione digitale, le
              opportunità per le aziende.
            </motion.p>
          </motion.div>
        </motion.section>
      </MotionConfig>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-dark-navy/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-4 sm:p-8 flex outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          // Il contenuto copre lo schermo: un clic fuori dalla locandina chiude il pop-up
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <Dialog.Title className="sr-only">Learning by DIH 2026 — calendario completo</Dialog.Title>
          <div className="relative m-auto">
            <img
              src={POSTER}
              alt="Locandina Learning by DIH 2026: calendario completo degli appuntamenti"
              width={1500}
              height={2211}
              className="block w-full max-w-[640px] sm:w-auto sm:max-h-[calc(100dvh-4rem)] h-auto rounded-[12px] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            />
            <Dialog.Close
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 inline-flex size-10 items-center justify-center rounded-full bg-white text-brand-dark-navy shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 cursor-pointer"
              aria-label="Chiudi"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
