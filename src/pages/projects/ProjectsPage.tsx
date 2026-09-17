import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { ContactPrefooter } from '@/components/sections/ContactPrefooter'

const MAIN_PROJECTS = [
  {
    logo: '/assets/progetti/pride.svg',
    logoStyle: { maxHeight: '55%' },
    alt: 'eDIH P.R.I.D.E.',
    link: 'https://www.edih-pride.eu/',
    description: (
      <>
        P.R.I.D.E., Polo Regionale per l'Innovazione Digitale Evoluta, rientra tra i primi
        tredici European Digital Innovation Hub italiani finanziati dalla Commissione Europea.
      </>
    ),
  },
  {
    logo: '/assets/progetti/confin-hub.png',
    alt: 'ConfIN-Hub — Confindustria',
    link: 'https://innovationhub.confindustria.it/',
    description: (
      <>
        ConfIN‑Hub è il polo nazionale di innovazione digitale promosso da Confindustria e
        finanziato dal MIMIT – PNRR, al quale il Campania DIH partecipa come spoke del network
        nazionale dei DIH. Il progetto consente l'erogazione su scala nazionale di servizi
        standardizzati di assessment digitale, cybersecurity e data readiness, valorizzando un
        metodo di lavoro comune e rafforzando il coordinamento tra territori, filiere e imprese.
      </>
    ),
  },
  {
    logo: '/assets/progetti/damas.png',
    alt: 'DAMAS',
    link: 'https://edih-damas.it/',
    description: (
      <>
        Progetto focalizzato sulla digitalizzazione delle filiere Automotive e Aerospace
        attraverso l'adozione delle tecnologie High Perfomance Computing e Intelligenza
        Artificiale. L'iniziativa supporta le imprese attraverso assessment di maturità digitale
        e definizione di roadmap tecnologiche, favorendo l'adozione di soluzioni avanzate e il
        trasferimento tecnologico in settori industriali ad alta complessità.
      </>
    ),
  },
  {
    logo: '/assets/progetti/amadih.png',
    alt: 'AMa-DIH',
    description: (
      <>
        Il progetto AMa-DIH "Affiancamento Manageriale per i Digital Innovation Hub" ha avuto
        l'obiettivo di rafforzare il network dei Digital Innovation Hub di Confindustria grazie
        all'inserimento nei DIH di figure manageriali qualificate individuate in collaborazione
        con 4.Manager e Federmanager.
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
]

const OTHER_COLLABORATIONS: {
  logo?: string
  logoStyle?: CSSProperties
  alt?: string
  title?: string
  link?: string
  description: ReactNode
}[] = [
  {
    logo: '/assets/progetti/ict-campus.png',
    logoStyle: { maxHeight: '65%' },
    alt: 'ICT Campus',
    link: 'https://its-ictcampus.com/',
    description: (
      <>
        Il Campania DIH è socio fondatore della Fondazione "ICT CAMPUS – ITS ACADEMY", ovvero
        l'Istituto Tecnico Superiore per le Tecnologie dell'Informazione e della Comunicazione,
        che realizza percorsi biennali post diploma nell'Area "Tecnologie dell'informazione e
        della comunicazione".
      </>
    ),
  },
  {
    title: 'SyMan',
    description: (
      <>
        Il Campania DIH ha partecipato al progetto SyMan – Sustainability Manager Network
        promosso da SFC Confindustria e Federmanager, sviluppando strumenti di supporto alle PMI
        campane nel percorso di transizione digitale e sostenibile, tra cui guide informative, un
        manuale normativo e un tool di assessment della sostenibilità.
      </>
    ),
  },
  {
    logo: '/assets/progetti/parthenope-full.png',
    alt: 'Università degli Studi di Napoli "Parthenope"',
    description: (
      <>
        Il Campania DIH ha attivato con l'Università degli Studi di Napoli "Parthenope" due
        corsi del Dottorato di ricerca "Economia, Statistica e Sostenibilità".
      </>
    ),
  },
]

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

    const elements = document.querySelectorAll('.reveal-element')
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
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
                  index === 0 ? '' : `reveal-delay-${Math.min(index, 7) * 100}`
                }`}
              >
                <div className="flex items-center justify-center h-24 sm:h-28">
                  <img
                    src={project.logo}
                    alt={project.alt}
                    style={project.logoStyle}
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
            <h2 className="text-xl sm:text-2xl font-light text-brand-navy mb-6 tracking-tight">
              Altre collaborazioni o partecipazioni
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {OTHER_COLLABORATIONS.map((item) => {
                const Wrapper: 'a' | 'div' = item.link ? 'a' : 'div'
                return (
                  <Wrapper
                    key={item.alt ?? item.title}
                    {...(item.link
                      ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    style={{ backgroundColor: 'rgba(227, 234, 236, 0.95)' }}
                    className="flex flex-col items-center gap-3 rounded-[20px] p-6 shadow-neumorphic no-underline text-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center h-20 w-full">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.alt}
                          style={item.logoStyle}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-brand-navy tracking-tight">
                          {item.title}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] leading-[1.2] text-brand-dark-navy/80 font-normal">
                      {item.description}
                    </p>
                  </Wrapper>
                )
              })}
            </div>
          </div>
        </div>

        <ContactPrefooter />
      </main>

      <Footer />
    </>
  )
}
