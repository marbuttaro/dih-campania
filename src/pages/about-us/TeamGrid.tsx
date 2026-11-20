import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Le foto sono provvisorie (stessa sagoma uomo/donna per tutti)
const TEAM = [
  { name: 'Edoardo Imperiale', email: 'direzione@campaniadih.it', photo: '/assets/chi-siamo/man.png' },
  { name: 'Gaetano Amatruda', email: 'amatruda@campaniadih.it', photo: '/assets/chi-siamo/man.png' },
  { name: 'Sandra Castaldo', email: 'castaldo@campaniadih.it', photo: '/assets/chi-siamo/woman.png' },
  { name: 'Mariella Ferraro', email: 'ferraro@campaniadih.it', photo: '/assets/chi-siamo/woman.png' },
  { name: 'Arianna Paciolla', email: 'a.paciolla@campaniadih.it', photo: '/assets/chi-siamo/woman.png' },
  { name: 'Daniela Paonessa', email: 'paonessa@campaniadih.it', photo: '/assets/chi-siamo/woman.png' },
]

function PersonCard({ person }: { person: (typeof TEAM)[number] }) {
  return (
    <div className="group flex flex-col items-center text-center w-full max-w-[280px] mx-auto">
      <div className="relative w-full aspect-[4/5] mb-5">
        <div
          className="absolute inset-x-0 bottom-0 top-[12%] rounded-[20px] bg-cover bg-center transition-all duration-300 origin-bottom group-hover:scale-[1.02]"
          style={{ backgroundImage: "url('/assets/chi-siamo/gradient.svg')" }}
        />
        <img
          src={person.photo}
          alt={person.name}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto object-contain block select-none z-10 transition-all duration-300 origin-bottom group-hover:scale-[1.06]"
        />
      </div>
      <h3 className="w-full text-lg sm:text-[19px] font-normal italic text-brand-navy pb-2.5 border-b border-brand-navy/30 mb-2.5">
        {person.name}
      </h3>
      <span className="text-sm font-normal text-brand-navy/80">{person.email}</span>
    </div>
  )
}

/** Struttura organizzativa: da telefono uno slider con pallini, da tablet/computer la griglia a 3 colonne */
export function TeamGrid() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const track = trackRef.current
    if (track) setActive(Math.round(track.scrollLeft / track.clientWidth))
  }
  const goTo = (i: number) => {
    const track = trackRef.current
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <>
      <div className="md:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="-mx-8 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TEAM.map((person) => (
            <div key={person.name} className="snap-center shrink-0 w-full px-8">
              <PersonCard person={person} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {TEAM.map((person, i) => (
            <button
              key={person.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Vai a ${person.name}`}
              aria-current={i === active ? 'true' : undefined}
              className={cn(
                'h-2 rounded-full transition-all duration-300 cursor-pointer',
                i === active ? 'w-6 bg-brand-navy' : 'w-2 bg-brand-navy/25',
              )}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-3 gap-10 gap-y-12">
        {TEAM.map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </div>
    </>
  )
}
