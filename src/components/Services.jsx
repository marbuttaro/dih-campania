import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Services.css';

const servicesData = [
  {
    id: '01',
    title: 'Trasformazione Digitale',
    desc: 'Campania DIH supporta le imprese nella loro evoluzione digitale e sostenibile attraverso interventi concreti che partono dalla valutazione dei digital needs aziendali sulla base dei quali costruire una roadmap di implementazione.',
    image: '/assets/slider_servizi_1.png'
  },
  {
    id: '02',
    title: 'Cybersecurity',
    desc: 'Attività volte a rafforzare la sicurezza digitale delle imprese e delle pubbliche amministrazioni, promuovendo conformità normativa, formazione, prevenzione dei rischi e gestione operativa delle minacce informatiche.',
    image: '/assets/slider_servizi_2.png'
  },
  {
    id: '03',
    title: 'Intelligenza Artificiale',
    desc: 'Campania DIH supporta le imprese nell\'introduzione dell\'intelligenza artificiale, fornendo strumenti pratici, formazione e consulenza per integrare l\'AI in modo sicuro, etico e utile al business.',
    image: '/assets/slider_servizi_3.png'
  },
  {
    id: '04',
    title: 'ESG',
    desc: 'Supporto per integrare criteri ambientali, sociali e di buona governance nei processi aziendali, nelle strategie digitali, nei modelli di produzione e nella sostenibilità delle imprese, con l\'obiettivo di migliorare impatto, reputazione, compliance e competitività.',
    image: '/assets/slider_servizi_4.png'
  }
];

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section className="services-section" id="servizi" ref={ref}>
      <div className="services-container">
        <motion.h2 className="services-main-title" style={{ y }}>I nostri servizi</motion.h2>
        
        <motion.div className="services-nav" style={{ y }}>
          {servicesData.map((service, index) => (
            <div 
              key={service.id} 
              className={`service-nav-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              <div className="nav-circle">{service.id}</div>
              <span className="nav-label">{service.title}</span>
            </div>
          ))}
        </motion.div>

        <div className="service-display">
          <div className="service-card-left">
            <div className="service-id-large">{servicesData[activeTab].id}</div>
            <h3 className="service-card-title">{servicesData[activeTab].title}</h3>
            <p className="service-card-desc">{servicesData[activeTab].desc}</p>
            <button className="btn-service-action">Scopri di più</button>
          </div>
          
          <div className="service-card-right">
            <img 
              src={servicesData[activeTab].image} 
              alt={servicesData[activeTab].title} 
              className="service-main-img" 
            />
            <div className="service-areas-box">
              <h4 className="areas-box-title">Aree principali:</h4>
              <div className="areas-grid">
                <span className="area-tag">Strategia e consulenza</span>
                <span className="area-tag">Accesso ai finanziamenti</span>
                <span className="area-tag">Assessment maturità digitale</span>
                <span className="area-tag">Open innovation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
