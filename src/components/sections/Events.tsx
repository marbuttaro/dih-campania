import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EVENTS, isMonthOnly, monthShort, parseDate, sortEvents } from '@/pages/eventi/eventsData'

// Stessi dati della pagina Eventi: in home i 3 più rilevanti (prima i prossimi, poi i più recenti)
const HOME_EVENTS = sortEvents(EVENTS).slice(0, 3)

export function Events() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section id="eventi" ref={ref} className="bg-[#F0F4F8] py-20 lg:py-24">
      <div className="container-page">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-[2.5rem] text-brand-navy font-light mb-16 lg:mb-12"
          style={{ y }}
        >
          Appuntamenti
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOME_EVENTS.map((event) => (
            <article
              key={event.id}
              className="bg-white rounded-[28px] overflow-hidden shadow-neumorphic flex flex-col w-full max-w-[380px] min-h-[520px] mx-auto transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-[280px] overflow-hidden">
                <img
                  src={event.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-5 right-5 w-[90px] h-[120px] rounded-[18px] flex flex-col items-center justify-center bg-brand-navy/30 backdrop-blur-[8px] border border-white/20 gap-0.5">
                  {!isMonthOnly(event) && (
                    <span style={{ fontSize: '48px', fontWeight: 600, color: '#8EBEF7', lineHeight: 1, fontFamily: 'Montserrat, sans-serif' }}>{parseDate(event.date).getDate()}</span>
                  )}
                  <span style={{ fontSize: '34px', fontWeight: 600, color: '#DEEAEE', lineHeight: 1, fontFamily: 'Montserrat, sans-serif' }} className="lowercase">{monthShort(parseDate(event.date))}</span>
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div className="mb-7">
                  <h3 className="font-medium text-[19px] sm:text-[22px] text-[#013167] leading-tight">
                    {event.title}
                  </h3>
                  {(event.location || event.time) && (
                    <p className="mt-2 text-sm font-medium text-[#013167]/80">
                      {[event.location, event.time && `ore ${event.time}`].filter(Boolean).join(' | ')}
                    </p>
                  )}
                  <p className="mt-3 text-[15px] font-light text-brand-dark-navy leading-snug">{event.description}</p>
                </div>
                {event.joinable && (
                  <div className="flex justify-end">
                    <span
                      aria-disabled="true"
                      className="bg-[#E3EAEC]/50 border border-white/50 text-brand-dark-navy px-8 py-3 rounded-xl font-semibold text-base sm:text-lg shadow-neumorphic inline-block cursor-default select-none"
                    >
                      Partecipa
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <a
            href="/eventi"
            className="bg-brand-navy text-white px-10 py-3.5 rounded-lg font-semibold transition-all duration-300 hover:bg-brand-dark-navy hover:-translate-y-0.5 no-underline"
          >
            Vedi tutti
          </a>
        </div>
      </div>
    </section>
  )
}
