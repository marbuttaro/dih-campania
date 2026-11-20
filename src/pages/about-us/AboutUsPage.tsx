import { useEffect } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { ContactPrefooter } from '@/components/sections/ContactPrefooter'
import { ApproachSlider } from './ApproachSlider'
import { Timeline } from './Timeline'
import { TeamGrid } from './TeamGrid'



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
        className="flex-grow pt-32 sm:pt-36 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{
          backgroundImage: "url('/assets/sfondo.svg')",
        }}
      >
        {/* Atmosphere Overlay */}
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        <div className="container-page relative z-10">

          {/* 2. Hero Section */}
          {/* Fills the first viewport so the next section starts below the fold */}
          <div className="min-h-[calc(100svh-8rem)] sm:min-h-[calc(100svh-9rem)] flex flex-col justify-center text-center max-w-[840px] mx-auto pb-10 mb-6 sm:pb-24 sm:mb-16 reveal-element">
            <h1 className="text-[36px] lg:text-[52px] font-light text-brand-dark-navy leading-[1.2] mb-6 tracking-tight">
              Costruiamo insieme<br />
              il Futuro Digitale.
            </h1>
            <p className="text-base lg:text-2xl text-brand-navy font-medium leading-relaxed max-w-[760px] mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Un ecosistema che abilita innovazione, ricerca e sviluppo per imprese e PA.
            </p>
          </div>

          {/* 3. Intro Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-16 w-full max-w-[1200px] mx-auto mb-24 items-center reveal-element reveal-delay-100">
            <div>
              <h2 className="text-[34px] lg:text-[44px] font-light text-brand-navy leading-[1.15]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Un punto di riferimento per l’innovazione in Campania
              </h2>
            </div>
            <div className="space-y-6 text-base lg:text-xl text-brand-navy leading-relaxed font-normal [&_strong]:font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <p>
                Dal 2017, il Campania Digital Innovation Hub – Rete Confindustria <strong>supporta imprese e Pubblica Amministrazione nella trasformazione digitale e sostenibile</strong>, connettendo esigenze territoriali, competenze e tecnologie.
              </p>
              <p>
                Opera in ambiti quali digitalizzazione, Cybersecurity, Intelligenza Artificiale, High Performance Computing e sostenibilità, trasformando i bisogni in azioni concrete.
              </p>
            </div>
          </div>

        </div>

        {/* 4. Approccio integrato Slider */}
        <ApproachSlider />

        <div className="container-page relative z-10">
          {/* 4b. Timeline */}
          <Timeline />
        </div>

        {/* 5. Socio & Partner Tecnologici Full Width Section */}
        <div 
          className="w-full relative overflow-hidden bg-cover bg-center mb-24 reveal-element reveal-delay-200"
          style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
        >
          {/* Inner atmospheric highlights */}
          <div className="absolute -top-32 -right-32 size-64 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 size-64 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="container-page relative z-10 py-16 sm:py-24 space-y-12 sm:space-y-16">
                {/* A. I Soci Row */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-10 items-center">
                  <div>
                    <h3 className="text-3xl sm:text-[32px] font-light text-white/90 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      I Soci
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      { src: '/assets/chi-siamo/soci/unione-industriali-napoli.png', alt: 'Unione Industriali Napoli' },
                      { src: '/assets/chi-siamo/soci/confindustria-avellino.png', alt: 'Confindustria Avellino' },
                      { src: '/assets/chi-siamo/soci/confindustria-benevento.png', alt: 'Confindustria Benevento' },
                      { src: '/assets/chi-siamo/soci/confindustria-caserta.png', alt: 'Confindustria Caserta' },
                      { src: '/assets/chi-siamo/soci/confindustria-salerno.png', alt: 'Confindustria Salerno', tall: true },
                      { src: '/assets/chi-siamo/soci/ance.png', alt: 'Ance Campania', nudgeDown: true },
                    ].map((socio) => (
                      <div key={socio.alt} className="flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/30 rounded-[20px] p-4 min-h-[100px] transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 shadow-sm">
                        {socio.src && (
                          <img
                            src={socio.src}
                            alt={socio.alt}
                            className={`${socio.tall ? 'max-h-20 sm:max-h-24' : 'max-h-16 sm:max-h-20'} ${socio.nudgeDown ? 'translate-y-[3px]' : ''} max-w-full object-contain`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* B. Partner tecnologici Row */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-10 items-center">
                  <div>
                    <h3 className="text-3xl sm:text-[32px] font-light text-white/90 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Partner
                      <br className="hidden lg:block" />
                      {' '}tecnologici
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { src: '/assets/chi-siamo/partner/tim.png', alt: 'TIM', small: true },
                      { src: '/assets/chi-siamo/partner/windtre.png', alt: 'WindTre' },
                      { src: '/assets/chi-siamo/partner/netgroup.png', alt: 'Netgroup', wide: true },
                    ].map((partner) => (
                      <div key={partner.alt} className="flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/30 rounded-[20px] p-3 sm:p-4 min-h-[92px] transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 shadow-sm">
                        {partner.src && (
                          <img
                            src={partner.src}
                            alt={partner.alt}
                            className={`${partner.small ? 'max-h-7 sm:max-h-8' : 'max-h-9 sm:max-h-12'} ${partner.wide ? 'max-w-[96%]' : 'max-w-[85%]'} object-contain`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          </div>

        <div className="container-page relative z-10">
          {/* 6. Le persone Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 w-full max-w-[1200px] mx-auto mb-20 items-center reveal-element">
            <div>
              <h2 className="text-[34px] lg:text-[44px] font-light text-brand-navy leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Le persone
              </h2>
            </div>
            <div
              className="rounded-[20px] p-9 shadow-neumorphic bg-brand-ice"
              
            >
              <p className="text-base lg:text-xl text-brand-dark-navy/85 font-normal leading-relaxed">
                Il Campania DIH dal 2017 supporta attività di ricerca, orientamento e sviluppo di progetti di DT a favore delle imprese. Guidato da un senior strategic PM, il team è composto da esperti in innovazione tecnologica ed in settori umanistici per sostenere e accompagnare i processi di innovazione, trasformazione tech e digital di imprese e PA ed è coadiuvata da specialisti di settore ed innovation manager.
              </p>
            </div>
          </div>

          {/* 7. CdA Section */}
          <div className="w-full max-w-[1200px] mx-auto mb-24 reveal-element reveal-delay-100">
            <h2 className="text-[34px] lg:text-[44px] font-light text-brand-navy mb-8 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CdA
            </h2>
            
            <div className="space-y-6">
              {/* Row 1: Executive Cards, centrate e larghe quanto le card dei consiglieri */}
              <div className="flex flex-col md:flex-row md:justify-center gap-6 [&>*]:md:w-[calc((100%-3rem)/3)]">
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Maurizio Manfellotto</span>
                  <span className="text-sm font-semibold text-brand-navy mt-1.5">Presidente</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Edoardo Imperiale</span>
                  <span className="text-sm font-semibold text-brand-navy mt-1.5">Amministratore Delegato</span>
                </div>
              </div>

              {/* Label: Consiglieri */}
              <div className="text-center pt-16 pb-6">
                <h3 
                  className="text-lg sm:text-xl font-medium text-brand-navy uppercase tracking-widest"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Consiglieri
                </h3>
                <div className="w-12 h-0.5 bg-brand-navy/20 mx-auto mt-3" />
              </div>

              {/* Board Members (3 per riga, ultima riga centrata), alphabetical by surname */}
              <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-6 [&>*]:md:w-[calc((100%-3rem)/3)]">
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Francesco Benucci</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Emilio De Vizia</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Giuseppe Esposito Mocerino</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Maria Luisa Faraone Mennella</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Mario Ferraro</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Michele Lucantonio</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Beniamino Schiavone</span>
                </div>
                <div className="shadow-box bg-white/[0.15] p-6 rounded-[20px] flex flex-col justify-center items-center text-center">
                  <span className="text-lg font-medium text-brand-dark-navy">Francesco Serravalle</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8. La struttura organizzativa Section */}
          <div className="w-full max-w-[1200px] mx-auto mb-20 lg:mb-28 reveal-element reveal-delay-200">
            <h2 className="text-[34px] lg:text-[44px] font-light text-brand-navy mb-10 tracking-tight">
              La struttura organizzativa
            </h2>

            <TeamGrid />
          </div>

        </div>

        <ContactPrefooter />
      </main>

      {/* 9. Footer */}
      <Footer />
    </>
  )
}
