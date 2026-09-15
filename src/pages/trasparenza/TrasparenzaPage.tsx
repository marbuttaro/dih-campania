import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'

const DOCUMENTS = [
  {
    label: 'Modello di Organizzazione, Gestione e Controllo ai sensi del D.Lgs. 231/2001',
    href: '/assets/trasparenza/modello-231.pdf',
  },
  {
    label: 'Codice Etico',
    href: '/assets/trasparenza/codice-etico.pdf',
  },
  {
    label: 'Sistema sanzionatorio',
    href: '/assets/trasparenza/sistema-disciplinare.pdf',
  },
]

const ALBO_DOCUMENTS = [
  {
    label: 'Avviso Albo delle competenze DIH',
    href: '/assets/trasparenza/avviso-albo-competenze.pdf',
  },
  {
    label: 'Modello domanda di iscrizione Albo Competenze',
    href: '/assets/trasparenza/modello-domanda-albo-competenze.pdf',
  },
  {
    label: 'Albo delle competenze aggiornato al 02/04/2026',
    href: '/assets/trasparenza/albo-competenze-aggiornato.pdf',
  },
  {
    label: 'Avviso Albo Operatori Economici DIH',
    href: '/assets/trasparenza/avviso-albo-operatori-economici.pdf',
  },
  {
    label: 'Modello domanda di iscrizione Albo Operatori Economici',
    href: '/assets/trasparenza/modello-domanda-albo-operatori-economici.pdf',
  },
]

function DocumentLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-brand-navy text-sm sm:text-base hover:underline"
    >
      {label}
    </a>
  )
}

export function TrasparenzaPage() {
  return (
    <>
      <Navbar />

      <main
        className="flex-grow pt-36 pb-24 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{ backgroundImage: "url('/assets/sfondo.svg')" }}
      >
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />

        <div className="container-page relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-light text-brand-dark-navy leading-[1.2] tracking-tight text-center mb-16">
            Trasparenza
          </h1>

          <div className="max-w-2xl flex flex-col gap-8">
            <p className="text-sm sm:text-base text-brand-dark-navy/85 leading-relaxed">
              Nella Sezione trasparenza sono pubblicati i seguenti documenti:
            </p>

            <div className="flex flex-col gap-4">
              {DOCUMENTS.map((doc) => (
                <DocumentLink key={doc.label} {...doc} />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-brand-dark-navy text-sm sm:text-base font-semibold">
                Albo delle competenze e degli Operatori Economici
              </h2>
              {ALBO_DOCUMENTS.map((doc) => (
                <DocumentLink key={doc.label} {...doc} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
