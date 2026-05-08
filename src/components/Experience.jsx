import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Experience.css';

import StarBorder from './StarBorder';

const Experience = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section className="experience-section" id="esperienza" ref={ref}>
      <div className="experience-container">
        <div className="experience-neo-box">
          <motion.h2 className="experience-title" style={{ y }}>
            La nostra esperienza<br />
            a servizio delle aziende
          </motion.h2>
          <p className="experience-desc">
            Il CampaniaDIH dal 2017 supporta attività di ricerca, orientamento e sviluppo di progetti di DT a favore delle imprese. Guidato da un senior strategic PM, il team è composto da esperti in innovazione tecnologica ed in settori umanistici per sostenere e accompagnare i processi di innovazione, trasformazione tech e digital di imprese e PA ed è coadiuvata da specialisti di settore ed innovation manager
          </p>
          <StarBorder className="btn-experience">
            Scopri il nostro team
          </StarBorder>
        </div>
      </div>
    </section>
  );
};

export default Experience;
