import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarBorder from './StarBorder';
import './Events.css';

const eventsData = [
  {
    date: '25',
    month: 'lug',
    title: 'Nasce l\'Innovation Hub di Polo Strategico Nazionale',
    link: '#'
  },
  {
    date: '25',
    month: 'lug',
    title: 'Nasce l\'Innovation Hub di Polo Strategico Nazionale',
    link: '#'
  },
  {
    date: '25',
    month: 'lug',
    title: 'Nasce l\'Innovation Hub di Polo Strategico Nazionale',
    link: '#'
  }
];

const Events = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section className="events-section" id="eventi" ref={ref}>
      <div className="events-container-inner">
        <motion.h2 className="events-title" style={{ y }}>Prossimi appuntamenti</motion.h2>
        <div className="events-grid">
          {eventsData.map((event, index) => (
            <div className="event-card-new" key={index}>
              <div className="event-card-top">
                <img src="/assets/events_bg.jpg" alt="" className="event-img" />
                <div className="event-date-overlay">
                  <span className="date-day">{event.date}</span>
                  <span className="date-month">{event.month}</span>
                </div>
              </div>
              <div className="event-card-bottom">
                <h3 className="event-title-text">{event.title}</h3>
                <div className="event-card-footer">
                  <StarBorder as="a" href={event.link} className="btn-leggi" color="#8EBEF7">Leggi</StarBorder>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
