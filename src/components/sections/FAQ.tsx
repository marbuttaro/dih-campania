import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ_ITEMS = [
  {
    question: 'Che cos\'è il Campania DIH?',
    answer:
      'Il Campania Digital Innovation Hub è il punto di riferimento regionale per accompagnare imprese e Pubblica Amministrazione nei percorsi di trasformazione digitale e sostenibile. Fa parte della rete nazionale dei Digital Innovation Hub di Confindustria e mette in relazione imprese, competenze, tecnologie, università, centri di ricerca, startup e istituzioni.',
  },
  {
    question: 'A chi si rivolgono i servizi del Campania DIH?',
    answer:
      'I servizi del Campania DIH sono rivolti principalmente alle imprese, con particolare attenzione alle PMI, e alla Pubblica Amministrazione. Il supporto può riguardare diversi livelli del percorso di innovazione: dalla comprensione dei fabbisogni e della maturità digitale fino alla sperimentazione di tecnologie, alla formazione e alla definizione di percorsi di trasformazione.',
  },
  {
    question: 'Come può aiutare il Campania DIH la mia impresa?',
    answer:
      'Il Campania DIH parte dalle esigenze dell\'impresa e la accompagna nell\'individuazione delle soluzioni più adatte. Attraverso assessment, consulenza, formazione, sperimentazione e attività di networking, aiuta a orientare le scelte tecnologiche, sviluppare nuove competenze e costruire collaborazioni e progetti di innovazione.',
  },
  {
    question: 'Devo avere già un progetto di innovazione per rivolgermi al Campania DIH?',
    answer:
      'No. Il percorso può partire anche da un\'esigenza, una criticità o un\'opportunità che l\'impresa vuole approfondire. Il Campania DIH aiuta a inquadrare il fabbisogno, individuare le possibili soluzioni e orientare l\'impresa verso competenze, tecnologie e opportunità coerenti. Questo approccio riprende la funzione originaria del DIH di colmare il divario tra bisogni di innovazione e soluzioni disponibili.',
  },
  {
    question: 'Il Campania DIH offre solo servizi legati alla tecnologia?',
    answer:
      'No. La trasformazione digitale coinvolge tecnologie, persone, competenze e organizzazione. Per questo il Campania DIH affianca ai servizi tecnologici attività di formazione, orientamento, ricerca, networking e sviluppo di progetti, mettendo in relazione imprese e soggetti dell\'ecosistema dell\'innovazione.',
  },
]

export function FAQ() {
  return (
    <section id="faq" data-no-glow className="py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">
          <div className="flex-1 lg:sticky lg:top-36">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-brand-navy mb-1.5 leading-none">
              Hai domande?
            </h2>
            <p className="text-xl sm:text-2xl lg:text-[1.8rem] text-brand-dark-navy font-light">
              Noi abbiamo le risposte.
            </p>
          </div>

          <div className="flex-[1.5] w-full">
            <Accordion type="single" collapsible>
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <span className="text-base sm:text-lg lg:text-[1.4rem] text-brand-navy font-normal">
                      {item.question}
                    </span>
                    <span className="ml-auto flex size-10 sm:size-[50px] items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,25,51,0.08)] shrink-0 transition-transform">
                      <img
                        src="/assets/icon_plus.svg"
                        alt=""
                        aria-hidden
                        className="plus size-7"
                      />
                      <img
                        src="/assets/icon_minus.svg"
                        alt=""
                        aria-hidden
                        className="minus size-7"
                      />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
              <div className="border-t border-brand-navy/20" />
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
