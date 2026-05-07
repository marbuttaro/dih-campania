import React from 'react';
import './Grants.css';

const Grants = () => {
  return (
    <section className="grants-section" id="bandi">
      <div className="grants-background">
        <img src="/assets/bandi.png" alt="Bandi Background" className="grants-bg-img" />
        <div className="grants-overlay"></div>
      </div>
      
      <div className="container grants-content">
        <div className="grants-text">
          <h2 className="grants-title">Trasforma la tua impresa<br />con i bandi attivi</h2>
          <p className="grants-subtitle">
            Ti aiutiamo a orientarti tra i bandi attivi e a<br />cogliere le migliori opportunità
          </p>
          <button className="btn-outline-white">Scopri le opportunità</button>
        </div>
      </div>
    </section>
  );
};

export default Grants;
