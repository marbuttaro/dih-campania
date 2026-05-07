import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  {
    question: 'Cosa si intende per transizione digitale?',
    answer: 'La transizione digitale è il processo attraverso cui le imprese adottano tecnologie digitali per trasformare i propri processi, prodotti e modelli di business, migliorando efficienza, competitività e capacità di innovazione.'
  },
  {
    question: 'Offrite supporto anche nella richiesta di incentivi/bandi?',
    answer: 'Sì, il Campania DIH offre supporto completo nella ricerca, valutazione e compilazione delle domande per bandi e incentivi a livello regionale, nazionale ed europeo dedicati alla trasformazione digitale delle imprese.'
  },
  {
    question: 'Supportate anche le piccole imprese?',
    answer: 'Assolutamente sì. Il nostro obiettivo principale è proprio accompagnare le PMI campane nel percorso di digitalizzazione, con servizi pensati su misura per le esigenze e le risorse delle piccole e medie imprese.'
  },
  {
    question: 'Quali sono gli step della digitalizzazione?',
    answer: 'Il percorso prevede: assessment della maturità digitale, definizione della roadmap strategica, identificazione delle tecnologie abilitanti, implementazione delle soluzioni e monitoraggio continuo dei risultati.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-layout">
          <div className="faq-left">
            <h2 className="faq-title">Hai domande?<br />Noi abbiamo le risposte.</h2>
          </div>
          <div className="faq-right">
            {faqData.map((item, index) => (
              <div 
                className={`faq-item ${openIndex === index ? 'open' : ''}`} 
                key={index}
              >
                <button 
                  className="faq-question" 
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
