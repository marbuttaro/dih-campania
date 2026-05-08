import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarBorder from './StarBorder';
import './Projects.css';

const projectCards = [
  { front: '/assets/card_1_front.svg', back: '/assets/card_rear.svg' },
  { front: '/assets/card_2_front.svg', back: '/assets/card_rear.svg' },
  { front: '/assets/card_3_front.svg', back: '/assets/card_rear.svg' }
];

const Projects = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section className="projects-section" id="progetti" ref={ref}>
      <div className="container">
        
        {/* Projects Grid */}
        <div className="projects-header">
          <motion.h2 className="projects-title" style={{ y }}>Progetti</motion.h2>
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
          <StarBorder className="btn-all-projects" color="#8EBEF7">
            Vedi tutti i progetti
          </StarBorder>
        </div>

      </div>
    </section>
  );
};

export default Projects;
