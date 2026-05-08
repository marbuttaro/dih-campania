import React, { useState, useEffect } from 'react';
import StarBorder from './StarBorder';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/assets/logo DIH.svg" alt="Campania DIH Logo" />
        </a>
        
        <div className="navbar-links">
          <a href="#servizi" className="nav-link">Servizi</a>
          <a href="#progetti" className="nav-link">Progetti</a>
          <a href="#bandi" className="nav-link">Bandi</a>
          <a href="#newsletter" className="nav-link">Newsletter</a>
          <a href="#infosfera" className="nav-link">Infosfera</a>
          <a href="#chisiamo" className="nav-link">Chi Siamo</a>
        </div>
        
        <div className="navbar-action">
          <StarBorder as="a" href="#contatti" className="btn-primary" color="#8EBEF7">
            Contattaci
          </StarBorder>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
