import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { cn } from '@/lib/utils'
import { EVENTS, dayLabel, fullDate, monthShort, parseDate, toIso, type EventItem } from './eventsData'

const PAGE_SIZE = 6
const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const WEEKDAYS_SHORT = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do']
const font = { fontFamily: 'Montserrat, sans-serif' }

type View = 'grid' | 'list'

// Upcoming events first (soonest on top), then past ones (most recent on top)
function sortEvents(events: EventItem[]) {
  const today = toIso(new Date())
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
  return [...upcoming, ...past]
}

// Vertical (day over month) in the top-right corner, or a compact horizontal pill in the top-left
function DateBadge({ date, horizontal = false }: { date: Date; horizontal?: boolean }) {
  return (
    <div
      className={cn(
        'absolute top-3 flex items-center justify-center bg-brand-navy/30 backdrop-blur-[8px] border border-white/25 leading-none',
        horizontal
          ? 'left-3 flex-row items-baseline gap-1.5 rounded-[10px] px-3 py-2 [&>span:first-child]:text-[24px] [&>span:last-child]:text-[18px]'
          : 'right-3 flex-col gap-0.5 rounded-[14px] w-[60px] h-[90px] [&>span:first-child]:text-[34px] [&>span:last-child]:text-[24px]',
      )}
      style={font}
    >
      <span className="font-semibold text-[#8EBEF7]">{date.getDate()}</span>
      <span className="font-semibold text-[#DEEAEE] lowercase">{monthShort(date)}</span>
    </div>
  )
}

function EventMeta({ event, date }: { event: EventItem; date: Date }) {
  return (
    <>
      <p className="text-xs text-[#013167] mt-1">
        {dayLabel(date)}
        {event.time && ` | ${event.time}`}
      </p>
      <p className="text-[13px] font-light text-brand-dark-navy leading-snug mt-3">{event.description}</p>
      {event.location && <p className="text-[11px] font-medium text-[#013167] mt-3">{event.location}</p>}
    </>
  )
}

// Not linked yet: there is no registration page
function JoinButton() {
  return (
    <span
      aria-disabled="true"
      className="inline-block rounded-[8px] bg-[#E3EAEC] px-3 py-1.5 text-[15px] font-semibold text-[#001933] shadow-[-4px_-4px_10px_rgba(255,255,255,0.9),5px_5px_12px_rgba(164,177,188,0.55)] cursor-default select-none"
    >
      Partecipa
    </span>
  )
}

function EventCard({ event }: { event: EventItem }) {
  const date = parseDate(event.date)
  return (
    <article className="flex flex-col rounded-[20px] overflow-hidden bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_24px_rgba(164,177,188,0.55)]">
      <div className="relative h-[150px] sm:h-[130px]">
        <img src={event.image} alt="" className="w-full h-full object-cover" />
        <DateBadge date={date} />
      </div>
      <div className="flex flex-col flex-1 px-6 pt-5 pb-4">
        <h3 className="text-[22px] font-normal text-[#001933] leading-[1.05]">{event.title}</h3>
        <EventMeta event={event} date={date} />
        <div className="flex justify-end mt-auto pt-4">
          <JoinButton />
        </div>
      </div>
    </article>
  )
}

// Fixed height so every row lines up; long titles and descriptions are clamped
function EventRow({ event }: { event: EventItem }) {
  const date = parseDate(event.date)
  return (
    <article className="flex flex-col sm:flex-row h-[340px] sm:h-[160px] rounded-[20px] overflow-hidden bg-[#E3EAEC] shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_24px_rgba(164,177,188,0.55)]">
      <div className="relative h-[140px] sm:h-full sm:w-[220px] shrink-0">
        <img src={event.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <DateBadge date={date} horizontal />
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 flex-1 min-h-0 px-6 py-5">
        <div className="flex-1 min-w-0 flex flex-col justify-center [&>p:nth-of-type(2)]:line-clamp-2">
          <h3 className="text-[22px] font-normal text-[#001933] leading-[1.1] line-clamp-2">{event.title}</h3>
          <EventMeta event={event} date={date} />
        </div>
        <div className="flex justify-end sm:items-end shrink-0">
          <JoinButton />
        </div>
      </div>
    </article>
  )
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  const arrow =
    'flex items-center justify-center size-9 rounded-[8px] bg-[#E3EAEC] text-[#8EBEF7] shadow-[-4px_-4px_10px_rgba(255,255,255,0.9),5px_5px_12px_rgba(164,177,188,0.5)] disabled:opacity-40 disabled:shadow-none transition-opacity'
  return (
    <nav aria-label="Pagine eventi" className="flex items-center gap-4 mt-12" style={font}>
      <button type="button" className={arrow} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Pagina precedente">
        <ArrowLeft className="size-4" />
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-current={i === page ? 'page' : undefined}
          className={cn('text-[20px] px-1', i === page ? 'text-[#8EBEF7]' : 'text-[#013167] hover:text-[#8EBEF7]')}
        >
          {i + 1}
        </button>
      ))}
      <button type="button" className={arrow} disabled={page === pages - 1} onClick={() => onChange(page + 1)} aria-label="Pagina successiva">
        <ArrowRight className="size-4" />
      </button>
    </nav>
  )
}

// Opens on the month of the next upcoming event, or of the latest event if they are all past
function initialMonth(events: EventItem[]) {
  const first = events[0] ? parseDate(events[0].date) : new Date()
  return new Date(first.getFullYear(), first.getMonth(), 1)
}

function EventsCalendar({ events }: { events: EventItem[] }) {
  const [month, setMonth] = useState(() => initialMonth(events))
  const [selected, setSelected] = useState<string | null>(null)

  const byDay = useMemo(() => {
    const map = new Map<string, EventItem[]>()
    events.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]))
    return map
  }, [events])

  const year = month.getFullYear()
  const m = month.getMonth()
  const leadingBlanks = (new Date(year, m, 1).getDay() + 6) % 7 // weeks start on Monday
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const cells = [...Array(leadingBlanks).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const selectedEvents = selected ? byDay.get(selected) ?? [] : []

  const shiftMonth = (delta: number) => setMonth(new Date(year, m + delta, 1))

  return (
    <div className="rounded-[10px] bg-[#E3EAEC]/60 shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),8px_8px_24px_rgba(164,177,188,0.5)] px-6 sm:px-9 py-8" style={font}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-semibold text-[#001933]">
          {MONTHS[m]} {year}
        </p>
        <div className="flex gap-1 text-[#001933]">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Mese precedente" className="p-0.5 hover:text-[#8EBEF7]">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Mese successivo" className="p-0.5 hover:text-[#8EBEF7]">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center text-sm">
        {WEEKDAYS_SHORT.map((d) => (
          <span key={d} className="pb-2 text-[#001933]">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />
          const iso = toIso(new Date(year, m, day))
          const hasEvents = byDay.has(iso)
          const isSelected = iso === selected
          return (
            <span key={iso} className="flex justify-center">
              {hasEvents ? (
                <button
                  type="button"
                  onClick={() => setSelected(isSelected ? null : iso)}
                  aria-pressed={isSelected}
                  aria-label={`${day} ${MONTHS[m]}: ${byDay.get(iso)!.map((e) => e.title).join(', ')}`}
                  className={cn(
                    'size-8 rounded-full font-medium transition-colors',
                    isSelected ? 'bg-[#013167] text-white' : 'bg-[#8EBEF7]/45 text-[#013167] hover:bg-[#8EBEF7]/70',
                  )}
                >
                  {day}
                </button>
              ) : (
                <span className="flex items-center justify-center size-8 text-[#5B6B7C]">{day}</span>
              )}
            </span>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-[#C9D4DA] min-h-[120px]">
        {selectedEvents.length === 0 ? (
          <p className="text-xs text-[#5B6B7C]">Seleziona un giorno evidenziato per vedere l’evento.</p>
        ) : (
          <ul className="space-y-6">
            {selectedEvents.map((event) => (
              <li key={event.title}>
                <p className="text-[10px] text-[#001933]">
                  {fullDate(parseDate(event.date))}
                  {event.time && ` | ${event.time}`}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#001933]">{event.title}</p>
                {event.location && <p className="mt-1 text-[11px] text-[#001933]">{event.location}</p>}
                <p className="mt-4 text-[10px] text-[#001933]">info:</p>
                <p className="mt-1 text-[11px] text-[#001933] leading-snug">{event.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function EventsPage() {
  const events = useMemo(() => sortEvents(EVENTS), [])
  const [view, setView] = useState<View>('grid')
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(events.length / PAGE_SIZE))
  const visible = events.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const changePage = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const viewButton = (value: View, label: string, Icon: typeof List) => (
    <button
      type="button"
      onClick={() => setView(value)}
      aria-pressed={view === value}
      aria-label={label}
      className={cn(
        'flex items-center justify-center size-10 rounded-[8px] border-2 border-[#013167] transition-colors',
        view === value ? 'bg-[#013167] text-[#DEEAEE]' : 'bg-transparent text-[#013167] hover:bg-[#013167]/10',
      )}
    >
      <Icon className="size-6" strokeWidth={1.5} />
    </button>
  )

  return (
    <>
      <Navbar />

      <main
        className="flex-grow pt-32 sm:pt-40 relative bg-cover bg-top bg-no-repeat bg-brand-surface"
        style={{ backgroundImage: "url('/assets/sfondo.svg')" }}
      >
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        <div className="container-page relative z-10 pb-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-14 xl:gap-20 items-start">
            <div>
              <div className="flex items-center justify-between gap-6 mb-10">
                <h1 className="text-[30px] sm:text-[38px] font-light text-[#013167] leading-tight" style={font}>
                  I nostri eventi
                </h1>
                <div className="flex gap-3">
                  {viewButton('grid', 'Visualizza a griglia', LayoutGrid)}
                  {viewButton('list', 'Visualizza a elenco', List)}
                </div>
              </div>

              <div
                className={cn('grid gap-8', view === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}
                style={font}
              >
                {visible.map((event) =>
                  view === 'grid' ? <EventCard key={event.title} event={event} /> : <EventRow key={event.title} event={event} />,
                )}
              </div>

              {pages > 1 && <Pagination page={page} pages={pages} onChange={changePage} />}
            </div>

            <aside className="lg:mt-[90px]">
              <EventsCalendar events={events} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
