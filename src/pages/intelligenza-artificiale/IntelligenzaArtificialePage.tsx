import { useState, useEffect } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'

export function IntelligenzaArtificialePage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-element');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: '',
      })
    }, 3000)
  }

  return (
    <>
      <Navbar />

      {/* Main Page Content */}
      <main
        className="flex-grow pt-36 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{
          backgroundImage: "url('/assets/sfondo.svg')",
        }}
      >
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />

        <div className="container-page relative z-10">
          
          {/* 1. Hero Section Content: Two Columns */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
            {/* Left Column: Text & Metrics */}
            <div className="flex-[1.1] text-left reveal-element">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-light text-brand-dark-navy leading-[1.2] mb-6 tracking-tight">
                Dalla data readiness<br />
                ai casi d'uso: sperimentare<br />
                l'IA prima di investire
              </h1>
              <p className="text-sm sm:text-base text-brand-dark-navy/85 font-normal leading-relaxed mb-10 max-w-[540px]">
                Il Campania DIH accompagna le imprese nell'adozione dell'Intelligenza Artificiale attraverso strumenti di data readiness, formazione e consulenza. L'obiettivo è individuare applicazioni ad alto valore e sperimentare soluzioni di IA in modo sicuro, responsabile e orientato al business.
              </p>

              {/* Clean White Announcement Card matching mockup */}
              <div className="inline-flex items-center gap-4 shadow-box py-4 px-7">
                <span className="shrink-0 inline-flex items-center justify-center rounded-full bg-brand-light-blue/15 text-brand-light-blue text-xs font-semibold uppercase tracking-wide px-3 py-1.5">
                  Novità
                </span>
                <span className="text-sm sm:text-base font-semibold text-brand-dark-navy leading-snug">
                  Nuovo tool disponibile da gennaio 2026<br />
                  per la data readiness
                </span>
              </div>
            </div>

            {/* Right Column: Hero Graphic/Image with vertical aspect ratio */}
            <div className="flex-1 w-full flex justify-center lg:justify-end reveal-element reveal-delay-200">
              <div className="relative rounded-[20px] overflow-hidden shadow-box max-w-[420px] w-full aspect-[4/5] bg-brand-dark-navy/10" style={{ padding: 0 }}>
                <img
                  src="/assets/immagine.png"
                  alt="Intelligenza Artificiale"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="block"
                />
              </div>
            </div>
          </div>

          {/* 2. Three-Column Cards Grid (using shadow-box) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

            {/* Card 1: Preparare i dati */}
            <div className="h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1 reveal-element reveal-delay-100">
              <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)] overflow-hidden">
                <img src="/assets/contesto.svg" alt="Preparare i dati" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="block" />
              </div>
              <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                Preparare<br />i dati
              </h3>
              <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">
                L'adozione dell'IA parte dalla disponibilità di dati affidabili, accessibili e utilizzabili. Il nuovo tool per la data readiness aiuta l'impresa a comprendere quanto la propria organizzazione sia pronta a valorizzare i dati e a individuare eventuali criticità su qualità, gestione e infrastrutture.
              </p>
            </div>

            {/* Card 2: Dall'idea al caso d'uso */}
            <div className="h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1 reveal-element reveal-delay-200">
              <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)] overflow-hidden">
                <img src="/assets/metodo.svg" alt="Dall'idea al caso d'uso" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="block" />
              </div>
              <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                Dall'idea<br />al caso d'uso
              </h3>
              <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">
                L'IA diventa realmente utile quando risponde a esigenze concrete dell'impresa. Il Campania DIH supporta l'individuazione dei casi d'uso a maggiore valore, dall'analisi dei dati all'automazione intelligente, dall'IA generativa ai sistemi di supporto alle decisioni, anche attraverso percorsi di formazione e accompagnamento.
              </p>
            </div>

            {/* Card 3: Testare prima di investire */}
            <div className="h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1 reveal-element reveal-delay-300">
              <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)] overflow-hidden">
                <img src="/assets/risultato.svg" alt="Testare prima di investire" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="block" />
              </div>
              <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                Testare prima<br />di investire
              </h3>
              <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">
                Attraverso l'approccio Test Before Invest, le imprese possono sperimentare tecnologie e soluzioni prima di affrontare investimenti più strutturati. Progetti pilota e collaborazioni con imprese, utilities, enti pubblici e centri di ricerca permettono di verificarne applicabilità, benefici e sostenibilità.
              </p>
            </div>
          </div>

        </div> {/* Chiude container-page */}

        {/* 5. Custom Assessment Form Section (Full Width Background) */}
        <div className="w-full relative bg-cover bg-center py-20 reveal-element" style={{ backgroundImage: "url('/assets/sfondo_form.png')" }}>
          <div className="container-page relative z-10">
            <div className="max-w-[760px] mx-auto rounded-[30px] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-[3px] glass-stroke-container">
              
              {/* Ambient inner glow */}
              <div className="absolute -top-40 -right-40 size-80 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 text-center mb-8">
                <h2 className="text-3xl sm:text-[2.1rem] font-light mb-2 text-white tracking-tight">
                  Richiedi maggiori informazioni
                </h2>
                <p className="text-sm sm:text-base text-brand-light-blue/80 font-normal">
                  Compila il form e prenota il tuo appuntamento
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="size-16 rounded-full bg-brand-light-blue/20 flex items-center justify-center mb-4 border border-brand-light-blue/40">
                    <svg className="size-8 text-brand-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Richiesta Inviata!</h3>
                  <p className="text-brand-light-blue/80">Grazie, ti contatteremo il prima possibile per maggiori informazioni.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col glass-stroke-input-wrapper">
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                      />
                    </div>
                    <div className="flex flex-col glass-stroke-input-wrapper">
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="glass-stroke-input-wrapper">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                    />
                  </div>

                  <div className="glass-stroke-input-wrapper">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
                    />
                  </div>

                  <div className="glass-stroke-input-wrapper">
                    <textarea
                      placeholder="Message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full block glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#013167] text-white hover:bg-brand-light-blue hover:text-brand-dark-navy transition-all duration-300 font-semibold py-4 rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 border border-white/10 cursor-pointer"
                    >
                      Invia Richiesta
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
