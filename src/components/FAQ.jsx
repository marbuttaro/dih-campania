import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  {
    question: 'Cosa si intende per transizione digitale?',
    answer: 'La transizione digitale è il processo attraverso cui le imprese adottano tecnologie digitali per trasformare i propri processi, prodotti e modelli di business, migliorando efficienza, competitività e capacità di innovazione.'
  },
  {
    question: 'Offrite supporto anche nella richiesta di incentivi/bandi?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt mollis dapibus. Morbi in imperdiet purus, non rutrum sapien.'
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
  const [openIndex, setOpenIndex] = useState(1); // Set second one open by default to match screenshot if desired

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-layout">
          <div className="faq-left">
            <h2 className="faq-main-title">Hai domande?</h2>
            <p className="faq-sub-title">Noi abbiamo le risposte.</p>
          </div>
          <div className="faq-right">
            <div className="faq-list">
              {faqData.map((item, index) => (
                <div 
                  className={`faq-item ${openIndex === index ? 'open' : ''}`} 
                  key={index}
                >
                  <button 
                    className="faq-toggle-btn" 
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <div className="faq-icon-circle">
                      <img 
                        src={openIndex === index ? "/assets/icon_minus.svg" : "/assets/icon_plus.svg"} 
                        alt={openIndex === index ? "minus" : "plus"} 
                        className="faq-toggle-icon"
                      />
                    </div>
                  </button>
                  <div className="faq-answer-container">
                    <div className="faq-answer-content">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="faq-final-line"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
