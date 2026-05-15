import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ_ITEMS = [
  {
    question: 'Cosa si intende per transizione digitale?',
    answer:
      'La transizione digitale è il processo attraverso cui le imprese adottano tecnologie digitali per trasformare i propri processi, prodotti e modelli di business, migliorando efficienza, competitività e capacità di innovazione.',
  },
  {
    question: 'Offrite supporto anche nella richiesta di incentivi/bandi?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt mollis dapibus. Morbi in imperdiet purus, non rutrum sapien.',
  },
  {
    question: 'Supportate anche le piccole imprese?',
    answer:
      'Assolutamente sì. Il nostro obiettivo principale è proprio accompagnare le PMI campane nel percorso di digitalizzazione, con servizi pensati su misura per le esigenze e le risorse delle piccole e medie imprese.',
  },
  {
    question: 'Quali sono gli step della digitalizzazione?',
    answer:
      'Il percorso prevede: assessment della maturità digitale, definizione della roadmap strategica, identificazione delle tecnologie abilitanti, implementazione delle soluzioni e monitoraggio continuo dei risultati.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-28">
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
            <Accordion type="single" collapsible defaultValue="item-1">
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
                        className="plus size-6 sm:size-7"
                      />
                      <img
                        src="/assets/icon_minus.svg"
                        alt=""
                        aria-hidden
                        className="minus size-6 sm:size-7"
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
