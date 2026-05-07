import React from 'react';
import './Events.css';

const eventsData = [
  {
    date: '25',
    month: 'lug',
    title: 'Nuova l\'Innovazione Hub di Piano Strategico Nazionale',
    link: '#'
  },
  {
    date: '25',
    month: 'lug',
    title: 'Nuova l\'Innovazione Hub di Piano Strategico Nazionale',
    link: '#'
  },
  {
    date: '25',
    month: 'lug',
    title: 'Nuova l\'Innovazione Hub di Piano Strategico Nazionale',
    link: '#'
  }
];

const Events = () => {
  return (
    <section className="events-section" id="eventi">
      <div className="events-bg-container">
        <img src="/assets/events_bg.jpg" alt="" className="events-bg-img" />
        <div className="events-overlay"></div>
      </div>
      
      <div className="container relative-z">
        <h2 className="events-title">Prossimi appuntamenti</h2>
        <div className="events-grid">
          {eventsData.map((event, index) => (
            <div className="event-card" key={index}>
              <div className="event-card-inner">
                <div className="event-date-badge">
                  <span className="event-day">{event.date}</span>
                  <span className="event-month">{event.month}</span>
                </div>
                <h3 className="event-name">{event.title}</h3>
                <a href={event.link} className="event-link">Leggi →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
