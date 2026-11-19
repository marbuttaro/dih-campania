import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, Minus, Plus, X } from 'lucide-react'
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { readPdfParts, requestAccess, type MagazineAccess } from './infosferaAccess'
import { MagazineDownload } from './MagazineDownload'
import type { InfosferaIssue } from './infosferaData'

GlobalWorkerOptions.workerSrc = workerUrl

export default function FullIssueReader({ issue, access, onClose, onExpired }: {
  issue: InfosferaIssue; access: MagazineAccess; onClose: () => void; onExpired: () => void
}) {
  const [source, setSource] = useState(access)
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [page, setPage] = useState(1)
  const [jump, setJump] = useState('1')
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(true)
  const [width, setWidth] = useState(700)
  const [text, setText] = useState('')
  const [showText, setShowText] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [area, setArea] = useState<HTMLDivElement | null>(null)
  const touch = useRef<{x:number;y:number} | null>(null)
  useEffect(() => {
    if (!area) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200,entry.contentRect.width-24)))
    observer.observe(area); return () => observer.disconnect()
  }, [area])
  useEffect(() => {
    let active = true
    // Range requests avoid downloading every page just to open a large edition.
    const controller = new AbortController()
    let task: ReturnType<typeof getDocument> | undefined
    void (async () => {
      const data = source.parts?.length ? await readPdfParts(source,controller.signal) : undefined
      if (!active) return
      task = getDocument({ ...(data ? {data} : {url:source.url}), disableAutoFetch:true, disableStream:true, wasmUrl:'/assets/pdfjs/wasm/', standardFontDataUrl:'/assets/pdfjs/standard_fonts/', cMapUrl:'/assets/pdfjs/cmaps/', cMapPacked:true, iccUrl:'/assets/pdfjs/iccs/' })
      const pdf = await task.promise
      if (active) { setDoc(pdf); setError('') }
    })().catch(() => { if (active) { setBusy(false); setError('Impossibile caricare il PDF. Controlla la connessione e riprova.') } })
    return () => { active = false; controller.abort(); void task?.destroy() }
  }, [source])
  useEffect(() => {
    if (!doc || !canvas.current) return
    let active = true
    let rendering: {cancel: () => void} | undefined
    setBusy(true); setError('')
    void doc.getPage(page).then(async pdfPage => {
      if (!active || !canvas.current) return
      const base = pdfPage.getViewport({scale:1})
      const cssWidth = Math.min(width,1000)*zoom
      const scale = cssWidth/base.width
      const pixelRatio = Math.min(window.devicePixelRatio || 1,2)
      const viewport = pdfPage.getViewport({scale:scale*pixelRatio})
      const el = canvas.current
      el.width = viewport.width; el.height = viewport.height
      el.style.width = `${cssWidth}px`; el.style.height = `${viewport.height/pixelRatio}px`
      const task = pdfPage.render({canvas:el,viewport}); rendering = task
      await task.promise
      const content = await pdfPage.getTextContent()
      if (active) { setText(content.items.map(item => 'str' in item ? item.str : '').join(' ')); setBusy(false) }
    }).catch(e => { if (active && e?.name !== 'RenderingCancelledException') { setBusy(false); setError('Pagina non disponibile. Riprova a caricare la rivista.') } })
    return () => { active = false; rendering?.cancel() }
  }, [doc,page,width,zoom])
  const navigate = (n: number) => {
    const next = Math.min(Math.max(n,1),doc?.numPages ?? access.pages)
    setPage(next); setJump(String(next)); area?.scrollTo({top:0,left:0})
  }
  const retry = async () => {
    setBusy(true);setError('')
    try { const next = await requestAccess(issue.id); if (next) { setDoc(null);setSource(next) } else onExpired() }
    catch { setBusy(false);setError('Servizio non disponibile. Riprova tra poco.') }
  }
  const button = 'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-3 hover:bg-white/15 disabled:opacity-30'
  return <Dialog.Root open onOpenChange={value => { if (!value) onClose() }}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-[#020f2a]" />
    <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-50 flex flex-col bg-[#020f2a] text-white focus:outline-none" onKeyDown={e => {
      if ((e.target as HTMLElement).closest('input,button,a')) return
      if (e.key === 'ArrowRight') navigate(page+1)
      if (e.key === 'ArrowLeft') navigate(page-1)
    }}>
      <header className="flex items-center justify-between gap-3 p-3 sm:px-6">
        <div className="min-w-0"><Dialog.Title className="truncate text-base !text-white">Infosfera · {issue.label}</Dialog.Title><p className="text-sm text-white/65">Numero completo</p></div>
        <MagazineDownload id={issue.id} access={source} className={button}/>
        <Dialog.Close className={button} aria-label="Chiudi"><X size={20}/></Dialog.Close>
      </header>
      <div ref={setArea} className="relative flex-1 min-h-0 overflow-auto overscroll-contain p-3" onTouchStart={e => {touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e => {
        const start=touch.current;touch.current=null
        if (!start || zoom>1) return
        const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y
        if (Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*2) navigate(page+(dx<0?1:-1))
      }}>
        {busy && <p role="status" className="sticky top-0 z-10 mx-auto w-fit rounded-lg bg-brand-navy px-4 py-2">Caricamento pagina…</p>}
        {error && <div role="alert" className="p-6 text-center"><p>{error}</p><button className={`${button} mt-4`} onClick={() => void retry()}>Riprova</button></div>}
        <canvas ref={canvas} role="img" aria-label={`Pagina ${page} di ${doc?.numPages ?? access.pages}`} className={`mx-auto max-w-none bg-white ${error ? 'hidden' : ''}`} />
        {showText && <section className="mx-auto mt-6 max-w-3xl rounded-xl bg-white p-6 text-base leading-relaxed text-slate-900"><h2 className="font-semibold mb-3">Testo della pagina {page}</h2><p>{text || 'Questa pagina contiene solo immagini.'}</p></section>}
      </div>
      <footer className="flex flex-wrap items-center justify-center gap-2 p-3 text-sm">
        <button className={button} aria-label="Pagina precedente" disabled={page===1} onClick={() => navigate(page-1)}><ArrowLeft size={18}/></button>
        <form className="flex items-center gap-2" onSubmit={e => {e.preventDefault();if (/^\d+$/.test(jump)) navigate(Number(jump))}}>
          <label className="sr-only" htmlFor="infosfera-page">Vai alla pagina</label><input id="infosfera-page" type="number" min="1" max={doc?.numPages ?? access.pages} value={jump} onChange={e=>setJump(e.target.value)} className="w-16 rounded border border-white/30 bg-white/10 p-2 text-center"/><span>/ {doc?.numPages ?? access.pages}</span><button className={button}>Vai</button>
        </form>
        <button className={button} aria-label="Pagina successiva" disabled={page===(doc?.numPages ?? access.pages)} onClick={() => navigate(page+1)}><ArrowRight size={18}/></button>
        <button className={button} aria-label="Riduci zoom" disabled={zoom<=1} onClick={()=>setZoom(z=>z-.5)}><Minus size={16}/></button><span>{Math.round(zoom*100)}%</span><button className={button} aria-label="Aumenta zoom" disabled={zoom>=3} onClick={()=>setZoom(z=>z+.5)}><Plus size={16}/></button>
        <button className={button} aria-pressed={showText} onClick={()=>setShowText(v=>!v)}>Testo</button>
      </footer>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>
}
