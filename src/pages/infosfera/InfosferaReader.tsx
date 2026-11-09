import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, Download, ExternalLink, Lock, Minus, Plus, X } from 'lucide-react'
import { Checkbox, Field } from '@/pages/innova-co/SolutionRequestModal'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { InfosferaIssue } from './infosferaData'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UNLOCK_KEY = 'infosfera-sbloccati'
/** Larghezza / altezza di una pagina della rivista (A4) */
const PAGE_RATIO = 1100 / 1556
const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3]

/** Dimensioni dell'area di lettura, per calcolare quanto è grande la pagina a zoom 100% */
function useElementSize<T extends HTMLElement>() {
  // Ref a callback: l'area di lettura si smonta quando compare il form e si rimonta tornando indietro
  const [element, setElement] = useState<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return [setElement, element, size] as const
}

function ZoomControls({
  zoomIndex,
  onChange,
}: {
  zoomIndex: number
  onChange: (zoomIndex: number) => void
}) {
  const buttonClass =
    'inline-flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent'
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onChange(zoomIndex - 1)}
        disabled={zoomIndex === 0}
        aria-label="Riduci zoom"
        className={buttonClass}
      >
        <Minus className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange(0)}
        title="Torna alla pagina intera"
        className="min-w-14 rounded-full px-2 py-1.5 text-xs font-semibold tabular-nums text-white hover:bg-white/15"
      >
        {Math.round(ZOOM_LEVELS[zoomIndex] * 100)}%
      </button>
      <button
        type="button"
        onClick={() => onChange(zoomIndex + 1)}
        disabled={zoomIndex === ZOOM_LEVELS.length - 1}
        aria-label="Aumenta zoom"
        className={buttonClass}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

/** Numeri già sbloccati su questo browser: chi ha già compilato il form non lo ricompila */
function readUnlocked(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(UNLOCK_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function markUnlocked(issueId: string) {
  try {
    localStorage.setItem(UNLOCK_KEY, JSON.stringify([...new Set([...readUnlocked(), issueId])]))
  } catch {
    // localStorage non disponibile (es. navigazione privata): il form verrà richiesto di nuovo
  }
}

function useIsDesktop() {
  const query = '(min-width: 1024px)'
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return matches
}

/** Da desktop le pagine si leggono a doppia pagina come una rivista: copertina da sola, poi 2-3, 4-5… */
function buildViews(pageCount: number, spreads: boolean, blankPages: number[] = []): number[][] {
  if (!spreads)
    return Array.from({ length: pageCount }, (_, i) => [i]).filter(([i]) => !blankPages.includes(i + 1))
  const views: number[][] = [[0]]
  for (let i = 1; i < pageCount; i += 2) views.push(i + 1 < pageCount ? [i, i + 1] : [i])
  return views
}

function driveDownloadUrl(url: string) {
  const id = url.match(/\/d\/([^/]+)/)?.[1]
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url
}

function DownloadPanel({ issue }: { issue: InfosferaIssue }) {
  return (
    <div className="text-center">
      <Dialog.Title className="text-2xl sm:text-3xl font-light text-brand-navy">
        Il numero completo è tuo
      </Dialog.Title>
      <Dialog.Description className="mt-3 text-sm text-brand-dark-navy/70">
        Grazie! Puoi scaricare Infosfera {issue.label} oppure leggerlo online.
      </Dialog.Description>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <a
          href={driveDownloadUrl(issue.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-navy to-[#0b4a86] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_6px_16px_rgba(1,49,103,0.35)] transition-transform hover:-translate-y-0.5"
        >
          <Download className="size-4" /> Scarica il PDF
        </a>
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Si apre in una nuova finestra"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E3EAEC] px-6 py-3 text-sm font-semibold text-brand-dark-navy no-underline shadow-[0_4px_10px_rgba(1,49,103,0.18)] transition-transform hover:-translate-y-0.5"
        >
          <ExternalLink className="size-4" /> Leggi online
        </a>
      </div>
    </div>
  )
}

function LeadForm({ issue, onUnlocked }: { issue: InfosferaIssue; onUnlocked: () => void }) {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [email, setEmail] = useState('')
  const [consensoPrivacy, setConsensoPrivacy] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const canSubmit =
    nome.trim() !== '' && cognome.trim() !== '' && EMAIL_PATTERN.test(email.trim()) && consensoPrivacy

  const handleSubmit = async () => {
    if (!canSubmit || sending) return
    setSending(true)
    setError('')
    try {
      if (!supabase) throw new Error('Supabase non configurato')
      const { error: insertError } = await supabase.from('infosfera_leads').insert({
        issue_id: issue.id,
        first_name: nome.trim(),
        last_name: cognome.trim(),
        email: email.trim().toLowerCase(),
        privacy_consent: true,
      })
      if (insertError) throw insertError
      markUnlocked(issue.id)
      onUnlocked()
    } catch (err) {
      console.error(err)
      setError('Non è stato possibile inviare la richiesta. Riprova tra qualche istante.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit()
      }}
    >
      <Dialog.Title className="flex items-center justify-center gap-3 text-center text-[22px] sm:text-3xl font-light text-brand-navy leading-tight">
        <span className="hidden sm:inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-light-blue/20 border border-brand-light-blue/40">
          <Lock className="size-4 text-brand-navy" />
        </span>
        Continua a leggere Infosfera
      </Dialog.Title>
      <Dialog.Description className="mt-2 mb-5 sm:mb-6 [@media(max-height:700px)]:mb-3 text-center text-[13px] sm:text-sm leading-snug text-brand-dark-navy/70">
        Hai letto l'anteprima fino all'editoriale. Lascia i tuoi dati per scaricare gratuitamente il
        numero completo.
      </Dialog.Description>

      <div className="space-y-4 [@media(max-height:700px)]:space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <Field label="Nome" value={nome} onChange={setNome} />
          <Field label="Cognome" value={cognome} onChange={setCognome} />
        </div>
        <Field label="Mail" value={email} onChange={setEmail} type="email" />
        <Checkbox
          checked={consensoPrivacy}
          onChange={() => setConsensoPrivacy((v) => !v)}
          className="italic [&>span:last-child]:text-xs [&>span:last-child]:leading-snug"
        >
          Dichiaro di aver letto e compreso l'Informativa sul trattamento dei dati personali ai sensi
          del Regolamento (UE) 2016/679 (GDPR) e acconsento al trattamento dei dati per l'invio della
          rivista Infosfera. <span className="font-bold not-italic">Visualizza informativa Privacy.</span>
        </Checkbox>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm leading-snug text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || sending}
        className={cn(
          'mt-5 sm:mt-6 [@media(max-height:700px)]:mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-navy to-[#0b4a86] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(1,49,103,0.35)] transition-all',
          !canSubmit || sending ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5',
        )}
      >
        <Download className="size-4" />
        {sending ? 'Invio in corso…' : 'Scarica il numero completo'}
      </button>
    </form>
  )
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
}) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Pagina precedente' : 'Pagina successiva'}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 transition-colors hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed"
    >
      <Icon className="size-5" />
    </button>
  )
}

/**
 * Sfogliatore di anteprima: le pagine fino all'editoriale si leggono liberamente,
 * andando oltre compare il form (nome, cognome, mail) che sblocca il PDF completo.
 */
export function InfosferaReader({
  issue,
  open,
  onOpenChange,
}: {
  issue: InfosferaIssue
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pages = useMemo(() => issue.previewPages ?? [], [issue.previewPages])
  const isDesktop = useIsDesktop()
  const views = useMemo(
    () => buildViews(pages.length, isDesktop, issue.blankPages),
    [pages.length, isDesktop, issue.blankPages],
  )
  const [index, setIndex] = useState(0)
  const [touchX, setTouchX] = useState<number | null>(null)
  const [zoomIndex, setZoomIndex] = useState(0)
  const zoom = ZOOM_LEVELS[zoomIndex]
  const [viewportRef, viewportEl, viewport] = useElementSize<HTMLDivElement>()
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  // Il lettore viene montato a ogni apertura: si riparte dalla copertina
  const [unlocked, setUnlocked] = useState(() => readUnlocked().includes(issue.id))

  // index === views.length è la "pagina" con il form / download
  const gateIndex = views.length
  const atGate = index >= gateIndex
  const current = atGate ? [] : views[index]

  // Passando da singola a doppia pagina (o viceversa) resta visibile la stessa pagina
  const [prevViews, setPrevViews] = useState(views)
  if (prevViews !== views) {
    const firstPage = prevViews[index]?.[0]
    setPrevViews(views)
    const next = firstPage === undefined ? -1 : views.findIndex((v) => v[v.length - 1] >= firstPage)
    setIndex(next === -1 ? views.length : next)
  }

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(Math.max(i + delta, 0), gateIndex)),
    [gateIndex],
  )
  // Punto della pagina al centro dello schermo prima di uno zoom: resta al centro anche dopo
  const zoomCenter = useRef<{ x: number; y: number } | null>(null)
  const setZoom = useCallback(
    (i: number) => {
      if (viewportEl) {
        const { scrollLeft, scrollTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = viewportEl
        zoomCenter.current = {
          x: (scrollLeft + clientWidth / 2) / scrollWidth,
          y: (scrollTop + clientHeight / 2) / scrollHeight,
        }
      }
      setZoomIndex(Math.min(Math.max(i, 0), ZOOM_LEVELS.length - 1))
    },
    [viewportEl],
  )

  // Cambiando pagina si riparte dall'alto
  useEffect(() => {
    viewportEl?.scrollTo({ top: 0, left: 0 })
  }, [index, viewportEl])

  // Altezza di pagina a zoom 100%: la vista (singola o doppia) entra tutta nell'area di lettura
  const fitHeight = Math.min(viewport.height, viewport.width / (Math.max(current.length, 1) * PAGE_RATIO))
  const pageHeight = Math.floor(fitHeight * zoom)

  useLayoutEffect(() => {
    const center = zoomCenter.current
    if (!viewportEl || !center) return
    zoomCenter.current = null
    viewportEl.scrollTo({
      left: center.x * viewportEl.scrollWidth - viewportEl.clientWidth / 2,
      top: center.y * viewportEl.scrollHeight - viewportEl.clientHeight / 2,
    })
  }, [zoom, viewportEl])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select')) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === '+' || e.key === '=') setZoom(zoomIndex + 1)
      if (e.key === '-') setZoom(zoomIndex - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, setZoom, zoomIndex])

  const pageLabel = atGate
    ? 'Fine anteprima'
    : current.length > 1
      ? `Pagine ${current[0] + 1}–${current[1] + 1} di ${pages.length}`
      : `Pagina ${current[0] + 1} di ${pages.length}`

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#020f2a]/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col text-white focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-white/60">Infosfera · Anteprima</p>
              <p className="truncate text-sm sm:text-base">{issue.label}</p>
            </div>
            <Dialog.Close className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
              <X className="size-5" />
              <span className="sr-only">Chiudi</span>
            </Dialog.Close>
          </header>

          <div className="flex-1 min-h-0 flex items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 pb-2">
            <div className="hidden sm:block">
              <ArrowButton direction="prev" onClick={() => go(-1)} disabled={index === 0} />
            </div>

            <div
              onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                // Con lo zoom attivo il dito serve a spostarsi nella pagina, non a sfogliare
                if (touchX === null || atGate || zoom > 1) return
                const dx = e.changedTouches[0].clientX - touchX
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
                setTouchX(null)
              }}
              className="flex-1 min-w-0 h-full flex items-center justify-center">
              {atGate ? (
                <div className="w-full max-w-[520px] max-h-full overflow-y-auto rounded-[24px] sm:rounded-[36px] bg-[#EDF1F3] px-5 py-6 sm:p-10 [@media(max-height:700px)]:py-4 text-brand-dark-navy shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
                  {unlocked ? (
                    <DownloadPanel issue={issue} />
                  ) : (
                    <LeadForm issue={issue} onUnlocked={() => setUnlocked(true)} />
                  )}
                </div>
              ) : (
                <>
                  <Dialog.Title className="sr-only">
                    Anteprima Infosfera {issue.label}, {pageLabel.toLowerCase()}
                  </Dialog.Title>
                  <div
                    ref={viewportRef}
                    onPointerDown={(e) => {
                      const el = e.currentTarget
                      if (zoom === 1 || e.pointerType !== 'mouse') return
                      drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
                      el.setPointerCapture(e.pointerId)
                    }}
                    onPointerMove={(e) => {
                      const el = e.currentTarget
                      if (!drag.current) return
                      el.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
                      el.scrollTop = drag.current.top - (e.clientY - drag.current.y)
                    }}
                    onPointerUp={() => (drag.current = null)}
                    onPointerCancel={() => (drag.current = null)}
                    className={cn(
                      'h-full w-full overflow-auto overscroll-contain [scrollbar-width:thin]',
                      zoom > 1 && 'cursor-grab active:cursor-grabbing select-none',
                    )}
                  >
                    {/* min-w/min-h centrano la pagina finché è più piccola dell'area, poi si scorre */}
                    <div className="flex min-h-full min-w-full w-max items-center justify-center">
                      {pageHeight > 0 &&
                        current.map((page) => (
                          <img
                            key={page}
                            src={pages[page]}
                            alt={`Pagina ${page + 1}`}
                            draggable={false}
                            style={{ height: pageHeight, width: Math.floor(pageHeight * PAGE_RATIO) }}
                            className="max-w-none shrink-0 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                          />
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden sm:block">
              <ArrowButton direction="next" onClick={() => go(1)} disabled={atGate} />
            </div>
          </div>

          <footer className="flex items-center justify-between gap-3 px-4 pt-2 pb-4 sm:justify-center text-center text-xs sm:text-sm text-white/70">
            <div className="sm:hidden">
              <ArrowButton direction="prev" onClick={() => go(-1)} disabled={index === 0} />
            </div>
            <div className="flex flex-col items-center gap-2">
              {!atGate && <ZoomControls zoomIndex={zoomIndex} onChange={setZoom} />}
              <p>
                {pageLabel}
                {!atGate && index === gateIndex - 1 && (
                  <span className="block sm:inline sm:ml-2 text-white">
                    <span className="hidden sm:inline">· </span>Vai avanti per scaricare il numero completo
                  </span>
                )}
              </p>
            </div>
            <div className="sm:hidden">
              <ArrowButton direction="next" onClick={() => go(1)} disabled={atGate} />
            </div>
          </footer>

          {/* Precarica la vista successiva */}
          <div hidden>
            {views[index + 1]?.map((page) => <img key={page} src={pages[page]} alt="" />)}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
