import React, { useState, useRef } from 'react';
import './Community.css';

const Community = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  return (
    <section className="community-section" id="community" onClick={nextStep} ref={useRef(null)}>
      <div className="community-container container">
        
        <div className={`community-step step-container-${step}`}>
          
          <h2 className={`community-bg-title ${step === 2 ? 'title-faded' : ''}`}>
            Entra a far parte della <br />
            <span className="accent">Community</span>
          </h2>

          <div className={`floating-cards ${step >= 1 ? 'cards-flying-out' : ''}`}>
            <div className="glass-card card-left">
              <p>Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle imprese?</p>
            </div>
            <div className="glass-card card-right">
              <p>Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo digitale?</p>
            </div>
          </div>

          <div className={`final-content ${step === 2 ? 'show' : ''}`}>
            <p className="community-description">
              Uno spazio aperto dove imprese, professionisti, startup ed<br />
              enti si incontrano per crescere insieme, scambiarsi competenze<br />
              e creare soluzioni reali per l'innovazione.
            </p>
            <button 
              className="btn-community-discovery" 
              onClick={(e) => e.stopPropagation()}
            >
              Scopri la nostra community
            </button>
          </div>

        </div>

        <div className="community-progress-wrapper">
          <img 
            src={`/assets/barra${step + 1}.svg`} 
            alt={`progress step ${step + 1}`} 
            className="progress-svg-fixed" 
          />
        </div>
      </div>
    </section>
  );
};

export default Community;
