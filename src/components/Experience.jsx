import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Experience.css';

import StarBorder from './StarBorder';

const Experience = () => {
  return (
    <section className="experience-section" id="esperienza">
      <div className="experience-container">
        <div className="experience-neo-box">
          <h2 className="experience-title">
            La nostra esperienza<br />
            a servizio delle aziende
          </h2>
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
