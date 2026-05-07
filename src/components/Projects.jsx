import React from 'react';
import './Projects.css';

const Projects = () => {
  return (
    <section className="projects-section" id="progetti">
      <div className="container">
        
        {/* Floating Community CTA Box */}
        <div className="community-cta">
          <div className="cta-left">
            <h3>Offri soluzioni innovative<br />e vuoi metterle al servizio<br />delle imprese?</h3>
            <p className="cta-highlight">Entra a far parte della<br /><strong>Community Campania DIH</strong></p>
          </div>
          <div className="cta-right">
            <h3>Hai un'idea, un progetto<br />o una sfida da affrontare<br />nel mondo digitale?</h3>
            <div className="cta-input-group">
              <input type="email" placeholder="Inserisci la tua email" className="cta-input" />
              <button className="btn-primary">Contattaci</button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-header">
          <h2 className="projects-title">Progetti</h2>
        </div>

        <div className="projects-grid">
          <div className="project-card">
            <img src="/assets/card progetti.png" alt="Card Background" className="card-bg" />
            <div className="card-overlay">
              <img src="/assets/logo pride.svg" alt="PRIDE" className="project-logo" />
            </div>
          </div>

          <div className="project-card">
            <img src="/assets/card progetti.png" alt="Card Background" className="card-bg" />
            <div className="card-overlay">
              <img src="/assets/logo hub.svg" alt="Confindustria Innovation Hub" className="project-logo" />
            </div>
          </div>

          <div className="project-card">
            <img src="/assets/card progetti.png" alt="Card Background" className="card-bg" />
            <div className="card-overlay">
              <img src="/assets/logo damas.svg" alt="DAMAS" className="project-logo" />
            </div>
          </div>
        </div>

        <div className="projects-footer text-center">
          <button className="btn-secondary">Vedi tutti i progetti</button>
        </div>

      </div>
    </section>
  );
};

export default Projects;
