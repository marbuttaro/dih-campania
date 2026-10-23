import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { cn } from '@/lib/utils'
import { GLOSSARY, type GlossaryTerm } from './glossaryData'

const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']

// Accent- and case-insensitive, so "realta" also finds "Realtà"
const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const letterOf = (term: string) => {
  const first = normalize(term).charAt(0).toUpperCase()
  return /[A-Z]/.test(first) ? first : '#'
}

const SORTED_TERMS = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'it', { sensitivity: 'base' }))
const AVAILABLE_LETTERS = new Set(SORTED_TERMS.map((item) => letterOf(item.term)))

function TermRow({ item }: { item: GlossaryTerm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] gap-2 md:gap-12 items-center border-b border-[#8EBEF7]/70 py-6 md:py-7">
      <dt className="text-[26px] sm:text-[32px] lg:text-[34px] font-light text-brand-navy leading-tight tracking-tight">
        {item.term}
      </dt>
      <dd className="text-sm sm:text-[15px] text-brand-dark-navy/75 leading-relaxed">{item.definition}</dd>
    </div>
  )
}

export function GlossarioPage() {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState<string | null>(null)

  const groups = useMemo(() => {
    const needle = normalize(query.trim())
    const matches = SORTED_TERMS.filter(
      (item) =>
        (!letter || letterOf(item.term) === letter) &&
        (!needle || normalize(item.term).includes(needle) || normalize(item.definition).includes(needle)),
    )
    const byLetter = new Map<string, GlossaryTerm[]>()
    for (const item of matches) {
      const key = letterOf(item.term)
      byLetter.set(key, [...(byLetter.get(key) ?? []), item])
    }
    return [...byLetter.entries()]
  }, [query, letter])

  const total = groups.reduce((sum, [, items]) => sum + items.length, 0)
  const filtered = Boolean(query.trim() || letter)

  return (
    <>
      <Navbar />

      <main className="flex-grow relative bg-brand-surface">
        {/* Hero: blue gradient with rounded bottom, the search panel overlaps its lower edge */}
        <section
          className="relative w-full pt-36 sm:pt-44 pb-32 sm:pb-36 rounded-b-[32px] sm:rounded-b-[40px] overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 70% 90% at 0% 60%, #3a82c4 0%, rgba(58,130,196,0) 70%), radial-gradient(ellipse 60% 70% at 100% 0%, #3f7fb6 0%, rgba(63,127,182,0) 70%), linear-gradient(180deg, #0b4a86 0%, #002d5c 100%)',
          }}
        >
          <div className="container-page grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-16 items-center">
            <h1 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal text-[#8EBEF7] leading-[1.15] tracking-tight">
              Digital Hub: Guida Pratica
              <br className="hidden xl:block" /> ai Termini dell'Innovazione
            </h1>
            <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed lg:max-w-[400px] lg:justify-self-end">
              Il mondo della digitalizzazione può sembrare un labirinto di termini complessi. Per
              questo abbiamo creato questa guida: uno spazio dove la tecnologia parla la tua lingua.
              Scopri il significato dei termini più importanti e inizia a sentirti a casa nel mondo
              dell'innovazione.
            </p>
          </div>
        </section>

        <div className="container-page relative z-10 -mt-20 sm:-mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 lg:gap-12 items-end rounded-[20px] bg-[#002a5a] shadow-[0_20px_50px_rgba(0,25,51,0.25)] px-6 py-6 sm:px-10 sm:py-8">
            <label className="block">
              <span className="block text-white/85 text-[15px] mb-3">cerca per parola chiave:</span>
              <span className="relative block">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Es. cloud, malware, BIM…"
                  className="w-full rounded-[12px] bg-white/5 border border-white/40 text-white placeholder-white/35 pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:border-[#8EBEF7] focus:ring-1 focus:ring-[#8EBEF7] [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Cancella ricerca"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                ) : (
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 text-white/70 pointer-events-none" />
                )}
              </span>
            </label>

            <div>
              <div className="flex items-baseline gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setLetter(null)}
                  aria-pressed={!letter}
                  className={cn(
                    'text-[15px] cursor-pointer transition-colors',
                    letter ? 'text-white/85 hover:text-[#8EBEF7] underline underline-offset-4' : 'text-white/85',
                  )}
                >
                  vedi tutti:
                </button>
              </div>
              <nav aria-label="Filtra per lettera" className="flex flex-wrap xl:flex-nowrap xl:justify-between gap-x-1 gap-y-1 xl:gap-0">
                {LETTERS.map((item) => {
                  const available = AVAILABLE_LETTERS.has(item)
                  const active = letter === item
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={!available}
                      aria-pressed={active}
                      aria-label={item === '#' ? 'Termini che iniziano con un numero o simbolo' : `Lettera ${item}`}
                      onClick={() => setLetter(active ? null : item)}
                      className={cn(
                        'min-w-[22px] xl:min-w-[20px] h-8 px-1 xl:px-0.5 rounded-md text-[17px] xl:text-[16px] font-medium transition-colors',
                        active
                          ? 'bg-[#8EBEF7] text-brand-dark-navy'
                          : available
                            ? 'text-white hover:text-[#8EBEF7] cursor-pointer'
                            : 'text-white/25 cursor-default',
                      )}
                    >
                      {item}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="container-page relative z-10 pt-16 sm:pt-20 pb-24 sm:pb-32">
          <p className="sr-only" role="status">
            {total} termini trovati
          </p>
          {filtered && (
            <p className="text-sm text-brand-dark-navy/60 mb-4">
              {total === 1 ? '1 termine trovato' : `${total} termini trovati`}
            </p>
          )}

          {total === 0 ? (
            <div className="border-y border-[#8EBEF7]/70 py-10 text-brand-dark-navy/75">
              Nessun termine corrisponde alla ricerca.{' '}
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setLetter(null)
                }}
                className="underline underline-offset-4 text-brand-navy cursor-pointer"
              >
                Mostra tutti i termini
              </button>
            </div>
          ) : (
            groups.map(([key, items]) => (
              <section key={key} aria-labelledby={`lettera-${key}`} className="mb-10 last:mb-0">
                <h2
                  id={`lettera-${key}`}
                  className="text-[13px] font-semibold tracking-[0.2em] text-[#4b7fb8] border-b border-[#8EBEF7]/70 pb-3"
                >
                  {key}
                </h2>
                <dl>
                  {items.map((item) => (
                    <TermRow key={item.term} item={item} />
                  ))}
                </dl>
              </section>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
