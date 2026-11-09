import { useCallback, useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EVENT_GALLERIES, type EventGallery } from './galleryData'

const font = { fontFamily: 'Montserrat, sans-serif' }

function Caption({ gallery, className }: { gallery: EventGallery; className?: string }) {
  return (
    <p className={cn('text-sm text-[#013167] leading-snug', className)} style={font}>
      <span className="font-semibold">{gallery.label}</span>
      <span className="mx-2 text-[#013167]/40">|</span>
      {gallery.caption}
    </p>
  )
}

const arrowClass =
  'flex items-center justify-center size-10 shrink-0 rounded-[8px] bg-[#E3EAEC] text-[#013167] shadow-[-4px_-4px_10px_rgba(255,255,255,0.9),5px_5px_12px_rgba(164,177,188,0.5)] transition-opacity disabled:opacity-35 disabled:shadow-none'

/** Visore a schermo intero: frecce, tastiera e didascalia */
function Lightbox({
  gallery,
  index,
  onIndexChange,
  onClose,
}: {
  gallery: EventGallery
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}) {
  const count = gallery.photos.length
  const go = useCallback((delta: number) => onIndexChange((index + delta + count) % count), [index, count, onIndexChange])
  const [touchX, setTouchX] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const photo = gallery.photos[index]
  const lightArrow =
    'inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 transition-colors hover:bg-white/20'

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#020f2a]/92 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col text-white focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <Dialog.Title className="sr-only">
            {gallery.label} – {gallery.caption}: foto {index + 1} di {count}
          </Dialog.Title>
          <div className="flex justify-end px-4 sm:px-8 py-4">
            <Dialog.Close className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
              <X className="size-5" />
              <span className="sr-only">Chiudi</span>
            </Dialog.Close>
          </div>

          <div
            className="flex-1 min-h-0 flex items-center justify-center gap-3 sm:gap-6 px-3 sm:px-6"
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX === null) return
              const dx = e.changedTouches[0].clientX - touchX
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
              setTouchX(null)
            }}
          >
            <button type="button" onClick={() => go(-1)} aria-label="Foto precedente" className={cn(lightArrow, 'hidden sm:inline-flex')}>
              <ArrowLeft className="size-5" />
            </button>
            <img
              key={photo.src}
              src={photo.src}
              alt={`${gallery.label}, ${gallery.caption} – foto ${index + 1}`}
              width={photo.width}
              height={photo.height}
              className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            />
            <button type="button" onClick={() => go(1)} aria-label="Foto successiva" className={cn(lightArrow, 'hidden sm:inline-flex')}>
              <ArrowRight className="size-5" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-center gap-4 px-4 py-4">
            <button type="button" onClick={() => go(-1)} aria-label="Foto precedente" className={cn(lightArrow, 'sm:hidden')}>
              <ArrowLeft className="size-5" />
            </button>
            <div className="text-center text-xs sm:text-sm" style={font}>
              <p className="text-white/90">
                <span className="font-semibold">{gallery.label}</span> | {gallery.caption}
              </p>
              <p className="mt-1 text-white/60">
                {index + 1} / {count}
              </p>
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Foto successiva" className={cn(lightArrow, 'sm:hidden')}>
              <ArrowRight className="size-5" />
            </button>
          </div>

          {/* Precarica le foto vicine */}
          <div hidden>
            <img src={gallery.photos[(index + 1) % count].src} alt="" />
            <img src={gallery.photos[(index - 1 + count) % count].src} alt="" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Striscia di foto scorrevole di un evento, con didascalia sotto */
function GalleryStrip({ gallery }: { gallery: EventGallery }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [open, setOpen] = useState<number | null>(null)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <figure>
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 -mx-6 px-6 -mt-4 pt-4 -mb-10 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // Bordi sfumati dove ci sono altre foto da scorrere, invece di un taglio netto
        style={{
          maskImage: `linear-gradient(to right, ${edges.start ? 'black' : 'transparent'}, black 64px, black calc(100% - 64px), ${edges.end ? 'black' : 'transparent'})`,
        }}
      >
        {gallery.photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Apri foto ${i + 1} di ${gallery.photos.length}`}
            className="group snap-start shrink-0 overflow-hidden rounded-[16px] shadow-[0_10px_24px_rgba(1,49,103,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013167]"
          >
            <img
              src={photo.thumb}
              alt=""
              loading="lazy"
              width={photo.width}
              height={photo.height}
              className="h-[260px] sm:h-[320px] w-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <figcaption className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Caption gallery={gallery} />
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Foto precedenti" className={arrowClass}>
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-label="Foto successive" className={arrowClass}>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </figcaption>

      {open !== null && <Lightbox gallery={gallery} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />}
    </figure>
  )
}

/** Sezione "Dai nostri eventi" in coda alla pagina Eventi: una gallery per ogni evento */
export function EventGalleries() {
  if (EVENT_GALLERIES.length === 0) return null
  return (
    <section aria-labelledby="dai-nostri-eventi" className="mt-24 lg:mt-32">
      <h2 id="dai-nostri-eventi" className="text-[30px] sm:text-[38px] font-light text-[#013167] leading-tight mb-10" style={font}>
        Dai nostri eventi
      </h2>
      <div className="space-y-16">
        {EVENT_GALLERIES.map((gallery) => (
          <GalleryStrip key={gallery.id} gallery={gallery} />
        ))}
      </div>
    </section>
  )
}
