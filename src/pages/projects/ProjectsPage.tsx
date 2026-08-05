import { useEffect } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'

const MAIN_PROJECTS = [
  {
    logo: '/assets/progetti/terranext.png',
    alt: 'TerraNext',
    link: 'https://www.terranextaccelerator.com/',
    description: (
      <>
        Campania DIH è <strong>partner tecnico scientifico</strong> di TERRANEXT. L'acceleratore
        BioEconomy della Rete Nazionale CDP e Intesa Sanpaolo Innovation Center con la
        partecipazione di partner come Fondazione con il Sud, con il supporto di Cariplo Factory,
        l'Università Federico II di Napoli, dedicato alle startup e PMI innovative che offrono
        soluzioni nei settori della Bio-Economy con attenzione ai segmenti Food &amp; Nutraceutica,
        Bio-materiali e Agricoltura rigenerativa.
      </>
    ),
  },
  {
    logo: '/assets/progetti/digiset-challenge.svg',
    alt: 'Digiset Challenge',
    link: 'https://digisetchallenge.it/',
    description: (
      <>
        Il Campania DIH, in partnership con l'Unione Industriali Napoli ed Uniservizi, in qualità
        di capofila del progetto, ha <strong>promosso percorsi di upskilling e reskilling</strong>,
        contribuendo al rafforzamento delle competenze digitali dei lavoratori e al miglioramento
        della capacità di adattamento ai cambiamenti tecnologici.
      </>
    ),
  },
  {
    logo: '/assets/progetti/infosfera.svg',
    alt: 'Infosfera',
    link: 'https://www.campaniadih.it/2024/02/12/infosfera-ecco-il-nuovo-numero/',
    description: (
      <>
        Infosfera rappresenta il{' '}
        <strong>magazine di approfondimento e divulgazione sui temi dell'innovazione e della trasformazione digitale</strong>
        , utilizzato per diffondere contenuti specialistici e aggiornamenti sulle principali
        evoluzioni tecnologiche.
      </>
    ),
  },
  {
    logo: '/assets/progetti/ict-campus.png',
    alt: 'ICT Campus',
    link: 'https://its-ictcampus.com/',
    description: (
      <>
        Il Campania DIH è{' '}
        <strong>socio fondatore della Fondazione "ICT CAMPUS – ITS ACADEMY"</strong> ovvero
        l'Istituto Tecnico Superiore per le Tecnologie dell'Informazione e della Comunicazione che
        realizza percorsi biennali post diploma nell'Area "Tecnologie dell'informazione e della
        comunicazione".
      </>
    ),
  },
]

const OTHER_PROJECTS = Array.from({ length: 6 }, () => ({
  logo: '/assets/progetti/amadih.png',
  alt: 'AMa DIH — Affiancamento manageriale per i Digital Innovation Hub',
}))

export function ProjectsPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { root: null, rootMargin: '0px', threshold: 0.1 },
    )

    const elements = document.querySelectorAll('.reveal-element:not(.reveal-timed)')
    elements.forEach((el) => observer.observe(el))

    const timedElements = document.querySelectorAll('.reveal-timed')
    const timers = Array.from(timedElements).map((el, i) =>
      setTimeout(() => el.classList.add('reveal-visible'), 1200 + i * 500),
    )

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <>
      <Navbar />

      <main
        className="flex-grow pt-44 sm:pt-52 pb-20 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{ backgroundImage: "url('/assets/sfondo.svg')" }}
      >
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        <div className="container-page relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 mb-20 sm:mb-28 items-start reveal-element">
            <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] font-light text-brand-navy leading-[1.2] tracking-tight">
              I progetti del
              <br />
              Campania DIH
            </h1>
            <p className="text-sm sm:text-base text-brand-dark-navy/80 leading-relaxed font-normal">
              Il Campania DIH nell'ultimo triennio ha operato come snodo tra politiche europee e
              nazionali e bisogni concreti di imprese e PA, coordinando e integrando programmi UE e
              PNRR in servizi operativi, misurabili e replicabili a supporto della trasformazione
              digitale.
            </p>
          </div>

          <div className="flex flex-col gap-8 mb-24">
            {MAIN_PROJECTS.map((project, index) => (
              <a
                key={project.alt}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: 'rgba(227, 234, 236, 0.95)' }}
                className={`relative z-10 rounded-[20px] p-9 shadow-neumorphic grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-8 sm:gap-20 items-center no-underline transition-all duration-300 hover:-translate-y-1 reveal-element ${
                  index < 2 ? 'reveal-timed' : `reveal-delay-${Math.min(index, 3) * 100}`
                }`}
              >
                <div className="flex items-center justify-center h-24 sm:h-28">
                  <img
                    src={project.logo}
                    alt={project.alt}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed font-normal">
                  {project.description}
                </p>
              </a>
            ))}
          </div>

          <div className="reveal-element">
            <h2 className="text-3xl sm:text-4xl font-light text-brand-navy mb-8 tracking-tight">
              Altri progetti
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-brand-navy/15 rounded-[16px] overflow-hidden bg-white/40">
              {OTHER_PROJECTS.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-8 h-32 sm:h-36 border border-brand-navy/15"
                >
                  <img
                    src={project.logo}
                    alt={project.alt}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
