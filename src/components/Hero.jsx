import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';
import BlurText from './BlurText';

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="/assets/foto hero.png" alt="Digital Hand" className="hero-bg-img" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content container">
        <motion.div className="hero-text-content" style={{ y }}>
          <BlurText 
            text="Il punto di riferimento per la trasformazione digitale."
            delay={100}
            animateBy="words"
            direction="top"
            className="hero-title"
          />
          <p className="hero-subtitle">
            Accompagniamo imprese e PMI campane nel percorso verso l'innovazione tecnologica, la sostenibilità e la competitività.
          </p>
          <a href="#scopri" className="btn-outline">
            Scopri di più
          </a>
        </motion.div>
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
