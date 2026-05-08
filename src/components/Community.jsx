import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarBorder from './StarBorder';
import './Community.css';

const Community = () => {
  const [step, setStep] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  return (
    <section className="community-section" id="community" onClick={nextStep} ref={ref}>
      <div className="community-container container">
        
        <div className={`community-step step-container-${step}`}>
          
          <motion.h2 
            className={`community-bg-title ${step === 2 ? 'title-faded' : ''}`}
            style={{ y: yTitle }}
          >
            Entra a far parte della <br />
            <span className="accent">Community</span>
          </motion.h2>

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
            <StarBorder 
              className="btn-community-discovery" 
              onClick={(e) => e.stopPropagation()}
              color="#8EBEF7"
            >
              Scopri la nostra community
            </StarBorder>
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
