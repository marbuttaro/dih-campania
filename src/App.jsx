import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Grants from './components/Grants';
import Events from './components/Events';
import Community from './components/Community';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Community />
      <Projects />
      <Experience />
      <Grants />
      <Events />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
