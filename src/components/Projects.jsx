import React from 'react';
import './Projects.css';

const projectCards = [
  { front: '/assets/card_1_front.svg', back: '/assets/card_rear.svg' },
  { front: '/assets/card_2_front.svg', back: '/assets/card_rear.svg' },
  { front: '/assets/card_3_front.svg', back: '/assets/card_rear.svg' }
];

const Projects = () => {
  return (
    <section className="projects-section" id="progetti">
      <div className="container">
        
        {/* Projects Grid */}
        <div className="projects-header">
          <h2 className="projects-title">Progetti</h2>
        </div>

        <div className="projects-grid">
          {projectCards.map((card, index) => (
            <div className="project-card-container" key={index}>
              <div className="project-card-inner">
                <div className="project-card-front">
                  <img src={card.front} alt={`Project ${index + 1} Front`} className="card-svg" />
                </div>
                <div className="project-card-back">
                  <img src={card.back} alt={`Project ${index + 1} Back`} className="card-svg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="projects-footer">
          <button className="btn-all-projects">Vedi tutti i progetti</button>
        </div>

      </div>
    </section>
  );
};

export default Projects;
