import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section className="about-section" id="chisiamo" ref={ref}>
      <div className="container">
        
        <div className="about-top">
          <motion.div className="about-title-box" style={{ y }}>
            <h2 className="about-title">
              Un facilitatore tra il<br />mondo produttivo<br />e le istituzioni
            </h2>
          </motion.div>
          <div className="about-intro">
            <p>
              <span className="text-highlight">Il Campania Digital Hub</span> agisce come facilitatore tra il mondo produttivo, la ricerca, le startup e le istituzioni, 
              offrendo strumenti, competenze e connessioni per aiutare le imprese a crescere nell'era digitale.
            </p>
          </div>
        </div>

        <div className="about-middle">
          <div className="about-info-card">
            <h3 className="card-headline">Cosa può fare DIH Campania per le imprese?</h3>
            <p className="card-body">
              Il Campania DIH supporta le aziende in <strong>tutte le fasi del percorso di trasformazione digitale</strong>: 
              dall'analisi dello stato di partenza alla realizzazione di progetti concreti, fino all'accesso a 
              incentivi e opportunità di finanziamento.
            </p>
          </div>
          <div className="about-image-card">
            <img src="/assets/foto_1.png" alt="Digital hub working" className="about-image-main" />
          </div>
        </div>

        <div className="about-bottom">
          <div className="sectors-info">
            <h3 className="sectors-title">In quali settori opera?</h3>
            <p className="sectors-desc">Il Campania DIH opera trasversalmente su settori chiave del territorio e dell'economia:</p>
          </div>
          <div className="sectors-pills">
            <div className="sector-item">Moda, artigianato e design</div>
            <div className="sector-item">Industria/manifattura & mobilità</div>
            <div className="sector-item">Agro-alimentare e filiere localizzate</div>
            <div className="sector-item">Salute, servizi alla persona</div>
            <div className="sector-item">Trasporto, logistica e infrastrutture smart</div>
            <div className="sector-item">Turismo, cultura e creatività</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
