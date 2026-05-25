import { useEffect } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'

// Institutional University Crest SVG
function UniversityCrest() {
  return (
    <svg className="size-10 text-white/90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeDasharray="3 3" />
      <path d="M12 5 L15 10 L20 10 L16 14 L18 19 L12 16 L6 19 L8 14 L4 10 L9 10 Z" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" />
      <path d="M12 9 L12 15 M9 12 L15 12" stroke="currentColor" />
    </svg>
  )
}

export function AboutUsPage() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          obs.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.reveal-element')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* 1. Header Navigation */}
      <Navbar />

      {/* Main Page Layout */}
      <main
        className="flex-grow pt-32 sm:pt-36 pb-20 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{
          backgroundImage: "url('/assets/sfondo.svg')",
        }}
      >
        {/* Atmosphere Overlay */}
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        <div className="container-page relative z-10">

          {/* 2. Hero Section */}
          <div className="text-center max-w-[840px] mx-auto mb-20 reveal-element">
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-light text-brand-dark-navy leading-[1.2] mb-6 tracking-tight">
              Costruiamo insieme<br />
              il Futuro Digitale.
            </h1>
            <p className="text-lg sm:text-[22px] text-brand-navy font-light leading-relaxed max-w-[700px] mx-auto">
              Un team di esperti al servizio dell'innovazione, dell'imprenditoria e delle PA.
            </p>
          </div>

          {/* 3. La nostra mission Card */}
          <div className="w-full max-w-[1200px] mx-auto mb-24 reveal-element reveal-delay-100">
            <div className="shadow-box bg-white/95">
              <h2 className="text-[32px] font-semibold text-brand-navy mb-5 tracking-tight">
                La nostra mission
              </h2>
              <p className="text-base sm:text-lg text-brand-dark-navy/85 font-normal leading-relaxed">
                Il Campania DIH opera come rete di soggetti qualificati per supportare la transizione digitale e di sostenibilità delle imprese e della PA. Offriamo servizi di orientamento, assessment e formazione, facilitando la collaborazione tra le aziende, il sistema della ricerca e dell'innovazione, e supportandole per partecipare ai bandi di finanziamento nazionali ed europei.
              </p>
            </div>
          </div>

          {/* 4. Approccio Data-Driven Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-16 w-full max-w-[1200px] mx-auto mb-24 items-start reveal-element">
            <div>
              <h2 className="text-3xl sm:text-[40px] font-semibold text-brand-navy leading-[1.15] tracking-tight">
                Approccio Data-<br />Driven e Partnership
              </h2>
            </div>
            <div>
              <p className="text-base sm:text-lg text-brand-dark-navy/85 leading-relaxed font-normal">
                Il Campania DIH adotta un approccio data-driven per favorire la **creazione di massa critica a livello nazionale ed europeo**. Promuove sinergie territoriali sane, partnership strategiche e connessioni di massima fiducia tra attori dell'innovazione a supporto della **twin transition**.
              </p>
            </div>
          </div>

          {/* 5. Socio & Partner Tecnologici Gradient Container */}
          <div className="w-full max-w-[1200px] mx-auto mb-24 reveal-element reveal-delay-200">
            <div className="bg-[linear-gradient(135deg,#001933_0%,#01274E_50%,#001933_100%)] rounded-[32px] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/10 relative overflow-hidden">
              {/* Inner atmospheric highlights */}
              <div className="absolute -top-32 -right-32 size-64 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 size-64 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 space-y-12">
                {/* A. I Soci Row */}
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-10 items-start">
                  <div>
                    <h3 className="text-2xl font-semibold text-white/90 tracking-tight lg:pt-4">
                      I Soci
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi di Napoli Federico II
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi di Salerno
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi del Sannio
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi di Napoli L'Orientale
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi di Napoli Parthenope
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi della Campania Luigi Vanvitelli
                      </span>
                    </div>
                  </div>
                </div>

                {/* B. Divider */}
                <div className="w-full h-px bg-white/10" />

                {/* C. Partner tecnologici Row */}
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-10 items-start">
                  <div>
                    <h3 className="text-2xl font-semibold text-white/90 tracking-tight lg:pt-4">
                      Partner tecnologici
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi di Napoli Federico II
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <UniversityCrest />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Università degli Studi di Salerno
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[92px] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <img
                        src="/assets/chi-siamo/logo_unione_og_bianco 1.svg"
                        alt="Unione Industriali Napoli"
                        className="h-10 w-auto object-contain shrink-0"
                      />
                      <span className="text-sm font-semibold text-white/90 leading-tight">
                        Unione Industriali Napoli
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Le persone Header Section */}
          <div className="w-full max-w-[1200px] mx-auto mb-20 reveal-element">
            <h2 className="text-4xl sm:text-[42px] font-semibold text-brand-navy mb-8 tracking-tight">
              Le persone
            </h2>
            <div className="shadow-box bg-white/95">
              <p className="text-base sm:text-lg text-brand-dark-navy/85 font-normal leading-relaxed">
                Il Campania DIH dal 2017 supporta attività di ricerca, orientamento e sviluppo di progetti di DT a favore delle imprese. Guidato da un senior strategic PM, il team è composto da esperti in innovazione tecnologica ed in settori umanistici per sostenere e accompagnare i processi di innovazione, trasformazione tech e digital di imprese e PA ed è coadiuvata da specialisti di settore ed innovation manager.
              </p>
            </div>
          </div>

          {/* 7. CdA Section */}
          <div className="w-full max-w-[1200px] mx-auto mb-24 reveal-element reveal-delay-100">
            <h2 className="text-3xl sm:text-[36px] font-semibold text-brand-navy mb-8 tracking-tight">
              CdA
            </h2>
            
            <div className="space-y-6">
              {/* Row 1: Executive Cards (2 centered) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-brand-dark-navy">Maurizio Manfellotto</span>
                  <span className="text-sm font-semibold text-brand-navy mt-1.5">Presidente</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-brand-dark-navy">Edoardo Imperiale</span>
                  <span className="text-sm font-semibold text-brand-navy mt-1.5">Amministratore Delegato / Direttore Generale</span>
                </div>
              </div>

              {/* Rows 2 & 3: Board Members Grid (3 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Emilio De Vizia</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Maria Luigia Fornarelli Mennella</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Mario Ferraro</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Michele Lignola</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Giuseppe Esposito Nocerino</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Antonio Palumbo</span>
                </div>
              </div>

              {/* Row 4: Bottom Board Members (2 centered) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Bernardino Salvatore</span>
                </div>
                <div className="shadow-box bg-white/95 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-bold text-[#001933]">Francesco Serravalle</span>
                </div>
              </div>

              {/* Label: Consiglieri */}
              <div className="text-center pt-4">
                <span className="text-xs uppercase tracking-widest text-brand-dark-navy/60 font-bold">
                  Consiglieri
                </span>
              </div>
            </div>
          </div>

          {/* 8. La struttura organizzativa Section */}
          <div className="w-full max-w-[1200px] mx-auto reveal-element reveal-delay-200">
            <h2 className="text-3xl sm:text-[36px] font-semibold text-brand-navy mb-10 tracking-tight">
              La struttura organizzativa
            </h2>

            <div className="space-y-10">
              {/* Row 1: 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Generoso Cogliano */}
                <div className="shadow-box bg-white/95 p-5 rounded-[24px] flex flex-col items-center text-center">
                  <div
                    className="relative w-full aspect-[4/5] sm:max-w-[240px] rounded-2xl overflow-hidden bg-cover bg-center mb-5 flex items-end justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.12)]"
                    style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
                  >
                    <img
                      src="/assets/chi-siamo/man.png"
                      alt="Generoso Cogliano"
                      className="h-[90%] w-auto object-contain block select-none"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark-navy mb-1">
                    Generoso Cogliano
                  </h3>
                  <span className="text-sm font-semibold text-brand-navy/70">
                    Senior Strategic PM & CEO
                  </span>
                </div>

                {/* Sandra Cascio */}
                <div className="shadow-box bg-white/95 p-5 rounded-[24px] flex flex-col items-center text-center">
                  <div
                    className="relative w-full aspect-[4/5] sm:max-w-[240px] rounded-2xl overflow-hidden bg-cover bg-center mb-5 flex items-end justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.12)]"
                    style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
                  >
                    <img
                      src="/assets/chi-siamo/woman.png"
                      alt="Sandra Cascio"
                      className="h-[90%] w-auto object-contain block select-none"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark-navy mb-1">
                    Sandra Cascio
                  </h3>
                  <span className="text-sm font-semibold text-brand-navy/70">
                    Staff Digitalisation & R.I.
                  </span>
                </div>

                {/* Manuela Pascarella */}
                <div className="shadow-box bg-white/95 p-5 rounded-[24px] flex flex-col items-center text-center">
                  <div
                    className="relative w-full aspect-[4/5] sm:max-w-[240px] rounded-2xl overflow-hidden bg-cover bg-center mb-5 flex items-end justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.12)]"
                    style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
                  >
                    <img
                      src="/assets/chi-siamo/woman.png"
                      alt="Manuela Pascarella"
                      className="h-[90%] w-auto object-contain block select-none"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark-navy mb-1">
                    Manuela Pascarella
                  </h3>
                  <span className="text-sm font-semibold text-brand-navy/70">
                    Project Officer & Admin
                  </span>
                </div>
              </div>

              {/* Row 2: 2 cards centered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
                {/* Arianna Mensorio */}
                <div className="shadow-box bg-white/95 p-5 rounded-[24px] flex flex-col items-center text-center">
                  <div
                    className="relative w-full aspect-[4/5] sm:max-w-[240px] rounded-2xl overflow-hidden bg-cover bg-center mb-5 flex items-end justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.12)]"
                    style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
                  >
                    <img
                      src="/assets/chi-siamo/woman.png"
                      alt="Arianna Mensorio"
                      className="h-[90%] w-auto object-contain block select-none"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark-navy mb-1">
                    Arianna Mensorio
                  </h3>
                  <span className="text-sm font-semibold text-brand-navy/70">
                    Innovation Specialist & PMO
                  </span>
                </div>

                {/* Sveva Marascia */}
                <div className="shadow-box bg-white/95 p-5 rounded-[24px] flex flex-col items-center text-center">
                  <div
                    className="relative w-full aspect-[4/5] sm:max-w-[240px] rounded-2xl overflow-hidden bg-cover bg-center mb-5 flex items-end justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.12)]"
                    style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
                  >
                    <img
                      src="/assets/chi-siamo/woman.png"
                      alt="Sveva Marascia"
                      className="h-[90%] w-auto object-contain block select-none"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark-navy mb-1">
                    Sveva Marascia
                  </h3>
                  <span className="text-sm font-semibold text-brand-navy/70">
                    Junior Communication Specialist
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 9. Footer */}
      <Footer />
    </>
  )
}
