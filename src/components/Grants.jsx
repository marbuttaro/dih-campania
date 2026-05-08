import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Grants.css';

const Grants = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section className="grants-section" id="bandi" ref={ref}>
      <div className="grants-container container">
        <div className="grant-glass-card">
          <motion.h2 className="grant-title" style={{ y }}>
            Trasforma la tua impresa<br />
            con i bandi attivi
          </motion.h2>
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
