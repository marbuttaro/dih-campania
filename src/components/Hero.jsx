import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';
import BlurText from './BlurText';
import Threads from './Threads';

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  // Color from the URL: 0.09019607843137255, 0.2196078431372549, 0.6823529411764706
  const threadsColor = [0.09, 0.22, 0.68];

  return (
    <section className="hero-section">
      <div className="hero-background">
        <Threads 
          color={threadsColor}
          amplitude={1.9}
          distance={0.3}
          enableMouseInteraction={true}
        />
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
