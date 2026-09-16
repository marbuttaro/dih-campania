import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EVENTS = [
  {
    date: '30',
    month: 'apr',
    title: 'I numeri di EDIH PRIDE, oltre 2000 imprese coinvolte, 5 milioni di euro in servizi alle Pmi',
    link: '#',
    image: '/assets/events_1.jpg',
  },
  {
    date: '10',
    month: 'apr',
    title: "Presentata Infosfera: uno strumento capace di collegare innovazione, impresa e cultura.\nSfida sull'AI",
    link: '#',
    image: '/assets/events_2.jpg',
  },
  {
    date: '2',
    month: 'apr',
    title: '"L\'informazione nell\'era digitale: tra innovazione, nuovi linguaggi e intelligenza artificiale"',
    link: '#',
    image: '/assets/events_bg.jpg',
  },
]

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
          {EVENTS.map((event, index) => (
            <article
              key={index}
              className="bg-white rounded-[28px] overflow-hidden shadow-neumorphic flex flex-col w-full max-w-[380px] min-h-[520px] mx-auto transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-[280px] overflow-hidden">
                <img
                  src={event.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-5 right-5 w-[90px] h-[120px] rounded-[18px] flex flex-col items-center justify-center bg-brand-navy/30 backdrop-blur-[8px] border border-white/20 gap-0.5">
                  <span style={{ fontSize: '48px', fontWeight: 600, color: '#8EBEF7', lineHeight: 1, fontFamily: 'Montserrat, sans-serif' }}>{event.date}</span>
                  <span style={{ fontSize: '34px', fontWeight: 600, color: '#DEEAEE', lineHeight: 1, fontFamily: 'Montserrat, sans-serif' }} className="lowercase">{event.month}</span>
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <h3 className="font-medium text-[19px] sm:text-[22px] text-[#013167] leading-tight mb-7 whitespace-pre-line">
                  {event.title}
                </h3>
                <div className="flex justify-end">
                  <span
                    aria-disabled="true"
                    className="bg-[#E3EAEC]/50 border border-white/50 text-brand-dark-navy px-8 py-3 rounded-xl font-semibold text-base sm:text-lg shadow-neumorphic inline-block cursor-default select-none"
                  >
                    Leggi
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
