import React from 'react';
import { motion } from 'framer-motion';
import BlurText from './BlurText';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <video 
          src="/assets/hero-bg.mov" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-bg-video"
        ></video>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content container">
        <div className="hero-text-content">
          <h1 className="hero-title">
            <BlurText
              text="Il punto di riferimento per"
              delay={150}
              stepDuration={0.6}
              animateBy="words"
              direction="top"
              className="hero-title-blur"
              startDelay={0}
            />
            <BlurText
              text="la trasformazione digitale."
              delay={150}
              stepDuration={0.6}
              animateBy="words"
              direction="top"
              className="hero-title-highlight-blur"
              startDelay={1500}
            />
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1, ease: "easeOut" }}
          >
            <p className="hero-subtitle">
              Accompagniamo imprese e PMI campane nel percorso verso l'innovazione tecnologica, la sostenibilità e la competitività.
            </p>
            <a href="#scopri" className="btn-outline">
              Scopri di più
            </a>
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
