import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/logo DIH.svg" alt="Campania DIH" className="footer-logo" />
            <p className="footer-desc">
              Campania Digital Innovation Hub<br />
              Rete Confindustria
            </p>
            <p className="footer-email">info@campaniadih.it</p>
            <p className="footer-vat">P.IVA 08145861215 - SDI</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navigazione</h4>
            <ul>
              <li><a href="#servizi">Servizi</a></li>
              <li><a href="#progetti">Progetti</a></li>
              <li><a href="#bandi">Bandi</a></li>
              <li><a href="#chisiamo">Chi Siamo</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Risorse</h4>
            <ul>
              <li><a href="#">Newsletter</a></li>
              <li><a href="#">Infosfera</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contatti</h4>
            <ul>
              <li><a href="#">Contattaci</a></li>
              <li><a href="#">DIH Campania</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Campania DIH. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
