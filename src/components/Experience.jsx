import React from 'react';
import './Experience.css';

const Experience = () => {
  return (
    <section className="experience-section">
      <div className="container">
        <div className="experience-card">
          <h2 className="experience-title">La nostra esperienza<br />a servizio delle aziende</h2>
          <p className="experience-text">
            Il CampaniaDIH dal 2017 supporta attività di ricerca, orientamento e sviluppo di progetti di DT a favore delle imprese. Guidato da un senior strategic PM, il team è composto da esperti in innovazione tecnologica ed in settori umanistici per sostenere e accompagnare i processi di innovazione, trasformazione tech e digital di imprese e PA ed è coadiuvata da specialisti di settore ed innovation manager
          </p>
          <button className="btn-secondary">Scopri il nostro team</button>
        </div>
      </div>
    </section>
  );
};

export default Experience;
