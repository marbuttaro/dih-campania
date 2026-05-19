import { useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'

export function DigitalTransformationPage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

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
        className="flex-grow pt-36 pb-20 relative bg-cover bg-center bg-no-repeat bg-brand-surface"
        style={{
          backgroundImage: "url('/assets/sfondo.svg')",
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />

        <div className="container-page relative z-10">
          
          {/* 1. Hero Section Content: Two Columns */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
            {/* Left Column: Text & Metrics */}
            <div className="flex-[1.1] text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-light text-brand-dark-navy leading-[1.2] mb-6 tracking-tight">
                Accompagnare la<br />
                trasformazione digitale<br />
                delle imprese campane
              </h1>
              <p className="text-sm sm:text-base text-brand-dark-navy/85 font-normal leading-relaxed mb-10 max-w-[540px]">
                Campania DIH supporta le imprese nella loro evoluzione digitale e sostenibile attraverso interventi concreti che partono dalla valutazione dei digital needs aziendali sulla base dei quali costruire una roadmap di implementazione.
              </p>

              {/* Clean White Metric Card matching mockup */}
              <div className="inline-flex items-center gap-6 shadow-box py-4 px-7">
                <span className="text-5xl sm:text-[54px] font-semibold text-brand-light-blue leading-none tracking-tight">
                  +230
                </span>
                <span className="text-sm sm:text-base font-semibold text-brand-dark-navy leading-snug">
                  Servizi Erogati<br />
                  dal 2018
                </span>
              </div>
            </div>

            {/* Right Column: Hero Graphic/Image with vertical aspect ratio */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <div className="relative rounded-[20px] overflow-hidden shadow-box max-w-[420px] w-full aspect-[4/5] bg-brand-dark-navy/10" style={{ padding: 0 }}>
                <img
                  src="/assets/immagine.png"
                  alt="Trasformazione Digitale"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="block"
                />
              </div>
            </div>
          </div>

          {/* 2. Horizontal Assessment Detail Bar (Solid White Premium Card with shadow-box) */}
          <div className="shadow-box mb-12 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
            <div className="md:basis-[38%] shrink-0">
              <h2 className="text-3xl md:text-[42px] font-medium text-[#013167] leading-[1.15] mb-3 tracking-tight">
                First Digital<br /> Assessment:
              </h2>
              <p className="text-lg md:text-[22px] font-light text-[#013167] leading-tight">
                dove inizia la trasformazione
              </p>
            </div>
            <div className="md:basis-[62%]">
              <p className="text-sm sm:text-base text-brand-dark-navy/80 leading-relaxed font-normal">
                <span className="font-semibold text-brand-dark-navy">Il servizio di First Digital Assessment è il primo passo di questo percorso:</span> uno strumento diagnostico che consente di misurare il livello di maturità digitale dell'impresa, identificar i punti di forza, le aree di miglioramento e definire priorità di intervento in ottica digitale. Attraverso interviste strutturate e l'analisi dei principali processi aziendali – produzione, logistica, marketing, amministrazione, risorse umane, sostenibilità – l'assessment restituisce una fotografia completa dello stato digitale dell'impresa.
              </p>
            </div>
          </div>

          {/* 3. Three-Column Cards Grid (using shadow-box) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            {/* Card 1: Il Contesto */}
            <div className="h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1">
              <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)]">
                <img src="/assets/contesto.svg" alt="Il contesto" className="size-7 block" />
              </div>
              <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                Il contesto
              </h3>
              <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">
                La regione Campania ospita un sistema imprenditoriale dinamico, costituito prevalentemente da PMI a conduzione familiare, spesso radicate in settori tradizionali in cui la diffusione delle tecnologie è disomogenea e spesso ostacolata da carenze di competenze, risorse e consapevolezza strategica.
              </p>
            </div>

            {/* Card 2: La Metodologia */}
            <div className="h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1">
              <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)]">
                <img src="/assets/metodo.svg" alt="La metodologia" className="size-7 block" />
              </div>
              <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                La metodologia
              </h3>
              <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">
                L'approccio adottato dal Campania DIH integra la valutazione tecnica con una lettura strategica: non si tratta solo di introdurre nuove tecnologie, ma di ripensare modelli organizzativi e culturali in chiave innovativa.
              </p>
            </div>

            {/* Card 3: I Risultati */}
            <div className="h-full shadow-box flex flex-col items-start text-left transition-all duration-300 hover:-translate-y-1">
              <div className="size-14 rounded-[14px] bg-[#001933] flex items-center justify-center mb-6 shadow-[0_6px_15px_rgba(0,25,51,0.12)]">
                <img src="/assets/risultato.svg" alt="I risultati" className="size-7 block" />
              </div>
              <h3 className="text-2xl md:text-[30px] font-medium text-[#013167] mb-4 tracking-tight leading-tight">
                I risultati
              </h3>
              <p className="text-sm text-brand-dark-navy/80 leading-relaxed font-normal">
                Il risultato finale è un report personalizzato che offre alle imprese una visione chiara della propria posizione rispetto ai paradigmi dell'Industria 4.0 e della Transizione Digitale, suggerendo azioni concrete per migliorare l'efficienza, la qualità dei processi e la capacità di competere nei mercati digitali.
              </p>
            </div>
          </div>

          {/* 4. Bottom Context Quote */}
          <div className="max-w-[920px] mx-auto text-center mb-24 px-4">
            <p className="text-base sm:text-[1.05rem] text-[#001933]/90 leading-relaxed font-normal">
              In un territorio dove l'innovazione si intreccia con il patrimonio produttivo locale, il First Digital Assessment rappresenta quindi uno strumento di crescita e consapevolezza: un punto di partenza per accompagnare le imprese campane verso un futuro più connesso, sostenibile e intelligente.
            </p>
          </div>

        </div> {/* Chiude container-page */}

        {/* 5. Custom Assessment Form Section (Full Width Background) */}
        <div className="w-full relative bg-cover bg-center py-20" style={{ backgroundImage: "url('/assets/sfondo_form.png')" }}>
          <div className="container-page relative z-10">
            <div className="max-w-[760px] mx-auto rounded-[30px] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden bg-brand-dark-navy/60 backdrop-blur-lg">
              
              {/* Ambient inner glow */}
              <div className="absolute -top-40 -right-40 size-80 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 text-center mb-8">
                <h2 className="text-3xl sm:text-[2.1rem] font-light mb-2 text-white tracking-tight">
                  Richiedi il tuo assessment
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
                  <p className="text-brand-light-blue/80">Grazie, ti contatteremo il prima possibile per fissare l'assessment.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/20 rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-light-blue transition-colors text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/20 rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-light-blue transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/20 rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-light-blue transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/20 rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-light-blue transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/20 rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-light-blue transition-colors text-sm resize-none"
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
