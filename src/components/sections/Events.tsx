import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EVENTS = [
  {
    date: '25',
    month: 'lug',
    title: "Nasce l'Innovation Hub di Polo Strategico Nazionale",
    link: '#',
  },
  {
    date: '25',
    month: 'lug',
    title: "Nasce l'Innovation Hub di Polo Strategico Nazionale",
    link: '#',
  },
  {
    date: '25',
    month: 'lug',
    title: "Nasce l'Innovation Hub di Polo Strategico Nazionale",
    link: '#',
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
          className="text-3xl sm:text-4xl lg:text-[2.5rem] text-brand-navy font-light mb-10 lg:mb-12"
          style={{ y }}
        >
          Prossimi appuntamenti
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.map((event, index) => (
            <article
              key={index}
              className="bg-white rounded-[28px] overflow-hidden shadow-neumorphic flex flex-col w-full max-w-[380px] min-h-[520px] mx-auto transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-[280px] overflow-hidden">
                <img
                  src="/assets/events_bg.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-5 right-5 w-[65px] h-[100px] rounded-[18px] flex flex-col items-center justify-center text-brand-light-blue bg-brand-navy/30 backdrop-blur-[8px] border border-white/20">
                  <span className="text-2xl font-bold leading-none">{event.date}</span>
                  <span className="text-base font-medium lowercase">{event.month}</span>
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-[22px] sm:text-[26px] text-brand-dark-navy leading-tight mb-7">
                  {event.title}
                </h3>
                <div className="flex justify-end">
                  <a
                    href={event.link}
                    className="bg-[#E3EAEC]/50 border border-white/50 text-brand-dark-navy px-8 py-3 rounded-xl font-semibold text-base sm:text-lg shadow-neumorphic inline-block transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E3EAEC]/70"
                  >
                    Leggi
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
