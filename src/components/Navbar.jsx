import React from 'react';
import './Navbar.css';

import StarBorder from './StarBorder';

const Navbar = () => {
  return (
    <nav className="navbar-wrapper">
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
          <StarBorder as="a" href="#contatti" className="btn-primary">
            Contattaci
          </StarBorder>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
