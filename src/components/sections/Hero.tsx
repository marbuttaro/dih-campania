import { motion } from 'framer-motion'

import { BlurText } from '@/components/effects/BlurText'
import { Threads } from '@/components/effects/Threads'

const TICKER_ITEMS =
  "| L'AI accelera nelle imprese italiane, ma resta il nodo delle competenze | Aggiornato l'albo dei certificatori: i nuovi requisiti | Evento annuale: prenota il tuo posto |"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 sm:pt-28 bg-[linear-gradient(135deg,#001933_0%,#002D5C_50%,#001933_100%)]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Threads
          color={[0.12, 0.45, 0.78]}
          amplitude={1.2}
          distance={0.3}
          enableMouseInteraction
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,25,51,0.7)_0%,rgba(0,25,51,0.3)_60%,transparent_100%)]" />
      </div>

      <div className="container-page relative z-10 w-full">
        <div className="max-w-[850px]">
          <h1 className="mb-6 text-[32px] sm:text-5xl lg:text-[3.5rem] font-medium text-white leading-[1.1]">
            <BlurText
              text="Il punto di riferimento per"
              delay={150}
              stepDuration={0.6}
              animateBy="words"
              direction="top"
              className="font-light text-white/85"
              startDelay={0}
            />
            <BlurText
              text="la trasformazione digitale."
              delay={150}
              stepDuration={0.6}
              animateBy="words"
              direction="top"
              className="font-bold text-brand-light-blue"
              startDelay={1500}
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1, ease: 'easeOut' }}
          >
            <p className="mb-10 max-w-[500px] text-base sm:text-lg text-white/75">
              Accompagniamo imprese e PMI campane nel percorso verso l'innovazione
              tecnologica, la sostenibilità e la competitività.
            </p>
            <a
              href="#scopri"
              className="btn-outline"
            >
              Scopri di più
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap border-t border-white/20 bg-[rgba(100,130,160,0.4)] backdrop-blur-md py-3 text-white text-sm">
        <div className="flex animate-ticker">
          <span className="pr-12">{TICKER_ITEMS}</span>
          <span className="pr-12">{TICKER_ITEMS}</span>
        </div>
      </div>
    </section>
  )
}
