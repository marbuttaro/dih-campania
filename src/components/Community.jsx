import React, { useState } from 'react';
import './Community.css';

const Community = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    // Only increment if we are not at the final step
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(0); // Optional: restart or stop
    }
  };

  return (
    <section className="community-section" id="community" onClick={nextStep}>
      <div className="community-container container">
        
        {/* Step 0 & 1: Cards and BG Title */}
        {step < 2 && (
          <div className={`community-step step-anim-${step}`}>
            <h2 className="community-bg-title">
              Entra a far parte della <br />
              <span className="accent">Community</span>
            </h2>
            <div className={`floating-cards ${step === 1 ? 'cards-flying-out' : ''}`}>
              <div className="glass-card card-left">
                <p>Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle imprese?</p>
              </div>
              <div className="glass-card card-right">
                <p>Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo digitale?</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Final Description & CTA */}
        {step === 2 && (
          <div className="community-step step-final">
            <p className="community-description">
              Uno spazio aperto dove imprese, professionisti, startup ed<br />
              enti si incontrano per crescere insieme, scambiarsi competenze<br />
              e creare soluzioni reali per l'innovazione.
            </p>
            <button className="btn-community-discovery">
              Scopri la nostra community
            </button>
          </div>
        )}

        {/* Progress Bar (Using barra 1, 2, 3) */}
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
