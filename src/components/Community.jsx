import React, { useState } from 'react';
import './Community.css';

const Community = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prev) => (prev + 1) % 3);
  };

  return (
    <section className="community-section" id="community" onClick={nextStep}>
      <div className="community-container container">
        
        {/* Step 0: Floating Cards */}
        {step === 0 && (
          <div className="community-step step-0">
            <h2 className="community-bg-title">
              Entra a far parte della <br />
              <span className="accent">Community</span>
            </h2>
            <div className="floating-cards">
              <div className="glass-card card-left">
                <p>Offri <strong>soluzioni innovative</strong> e vuoi metterle al servizio delle imprese?</p>
              </div>
              <div className="glass-card card-right">
                <p>Hai un'<strong>idea, un progetto o una sfida</strong> da affrontare nel mondo digitale?</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Specific Title */}
        {step === 1 && (
          <div className="community-step step-1">
            <h2 className="community-main-title">
              Entra a far parte della <br />
              <span className="accent-blue">Community INNOVA.CO</span>
            </h2>
          </div>
        )}

        {/* Step 2: Description & CTA */}
        {step === 2 && (
          <div className="community-step step-2">
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

        {/* Progress Bar (barra.svg) */}
        <div className="community-progress-wrapper">
          <div className="progress-track">
            <img src="/assets/barra.svg" alt="progress track" className="progress-svg" />
            <div className={`progress-thumb step-${step}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
