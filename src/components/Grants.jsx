import React from 'react';
import './Grants.css';

const Grants = () => {
  return (
    <section className="grants-section" id="bandi">
      <div className="grants-container container">
        <div className="grant-glass-card">
          <h2 className="grant-title">
            Trasforma la tua impresa<br />
            con i bandi attivi
          </h2>
          <p className="grant-desc">
            Ti aiutiamo a orientarti tra i bandi attivi e a cogliere le migliori opportunità
          </p>
          <a href="#bandi" className="btn-grant-glass">
            Scopri le opportunità
          </a>
        </div>
      </div>
    </section>
  );
};

export default Grants;
