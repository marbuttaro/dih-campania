import React from 'react';
import './Hero.css';
import BlurText from './BlurText';
import StarBorder from './StarBorder';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="/assets/foto hero.png" alt="Hero Background" className="hero-bg-img" />
        <div className="hero-overlay-multiply"></div>
      </div>
      
      <div className="hero-content container">
        <div className="hero-text-content">
          <BlurText 
            text="Il punto di riferimento per la trasformazione digitale."
            delay={100}
            animateBy="words"
            direction="top"
            className="hero-title"
          />
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
          >
            Accompagniamo imprese e PMI campane nel percorso verso l'innovazione tecnologica, la sostenibilità e la competitività.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
          >
            <StarBorder as="a" href="#scopri" className="btn-outline">
              Scopri di più
            </StarBorder>
          </motion.div>
        </div>
      </div>

      <div className="hero-ticker">
        <div className="ticker-content">
          <span>| L'AI accelera nelle imprese italiane, ma resta il nodo delle competenze | Aggiornato l'albo dei certificatori: i nuovi requisiti | Evento annuale: prenota il tuo posto |</span>
          <span>| L'AI accelera nelle imprese italiane, ma resta il nodo delle competenze | Aggiornato l'albo dei certificatori: i nuovi requisiti | Evento annuale: prenota il tuo posto |</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
