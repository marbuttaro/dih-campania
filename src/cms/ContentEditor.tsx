import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { safeHtml } from '../lib/content'
import { uploadMedia } from '../lib/articles'
import { Audio, Embed, Video, videoEmbedUrl } from './mediaExtensions'
import { confirmAction, requestUrl } from './dialogs'

function VisualEditor({ value, onChange, onBusyChange, disabled }: { value: string; onChange: (html: string) => void; onBusyChange: (busy: boolean) => void; disabled: boolean }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false, defaultProtocol: 'https' } }), Image, TableKit, Video, Audio, Embed, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: safeHtml(value),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { 'aria-label': 'Testo dell’articolo', class: 'article-content' } },
  })
  useEffect(() => { editor?.setEditable(!disabled) }, [editor, disabled])
  if (!editor) return null
  return <div>
    <div className="toolbar" role="toolbar" aria-label="Formattazione testo">
      <button type="button" aria-pressed={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>Grassetto</button>
      <button type="button" aria-pressed={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>Corsivo</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Titolo H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>Titolo H3</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>Elenco</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numerazione</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Citazione</button>
      <button type="button" onClick={async () => { const href = await requestUrl('Inserisci un collegamento'); if (href && /^https?:\/\//i.test(href)) editor.chain().focus().setLink({ href, target: '_blank' }).run() }}>Link</button>
      <button type="button" onClick={() => editor.chain().focus().unsetLink().run()}>Rimuovi link</button>
      <button type="button" onClick={async () => { const value = await requestUrl('Link del video YouTube o Vimeo'); if (!value) return; try { editor.chain().focus().insertContent({ type: 'articleEmbed', attrs: { src: videoEmbedUrl(value), title: 'Video' } }).run(); setError('') } catch (err) { setError((err as Error).message) } }}>Video YouTube/Vimeo</button>
      <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Tabella</button>
      <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Riga</button>
      <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Colonna</button>
      <button type="button" onClick={() => editor.chain().focus().deleteTable().run()}>Rimuovi tabella</button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()}>Annulla</button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}>Ripeti</button>
    </div>
    <EditorContent editor={editor} />
    <label className="mt-4">Inserisci immagine o allegato
      <input type="file" disabled={busy} onChange={async e => {
        const file = e.target.files?.[0]; if (!file) return
        setBusy(true); onBusyChange(true); setError('')
        try {
          const url = await uploadMedia(file)
          if (file.type.startsWith('image/')) editor.chain().focus().setImage({ src: url, alt: file.name }).run()
          else if (file.type === 'video/mp4' || file.type === 'audio/mpeg') editor.chain().focus().insertContent({ type: file.type === 'video/mp4' ? 'articleVideo' : 'articleAudio', attrs: { src: url, title: file.name } }).run()
          else editor.chain().focus().insertContent({ type: 'text', text: file.name, marks: [{ type: 'link', attrs: { href: url, target: '_blank' } }] }).run()
        } catch (err) { setError(err instanceof Error ? err.message : 'Caricamento non riuscito') }
        finally { setBusy(false); onBusyChange(false); e.target.value = '' }
      }} />
    </label>
    {busy && <p role="status">Caricamento in corso…</p>}
    {error && <p role="alert" className="error">{error}</p>}
  </div>
}

export function ContentEditor({ value, onChange, imported, onBusyChange, disabled = false }: { value: string; onChange: (html: string) => void; imported: boolean; onBusyChange: (busy: boolean) => void; disabled?: boolean }) {
  const [mode, setMode] = useState<'html' | 'visual' | 'preview'>(imported ? 'html' : 'visual')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  return <section>
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <h2 className="mr-auto text-lg">Contenuto</h2>
      <button type="button" className="secondary" aria-pressed={mode === 'visual'} onClick={async () => {
        if (mode !== 'visual' && value && !await confirmAction('L’editor visuale può semplificare gallerie e strutture HTML complesse alla prima modifica. Usa HTML per conservarle integralmente. Aprire l’editor visuale?')) return
        setMode('visual')
      }}>Visuale</button>
      <button type="button" className="secondary" aria-pressed={mode === 'html'} onClick={() => setMode('html')}>HTML</button>
      <button type="button" className="secondary" aria-pressed={mode === 'preview'} onClick={() => setMode('preview')}>Anteprima</button>
    </div>
    {mode === 'visual' && <VisualEditor value={value} onChange={onChange} onBusyChange={onBusyChange} disabled={disabled} />}
    {mode === 'html' && <><p className="text-sm mb-3">HTML originale conservato. Puoi inserire tabelle, gallerie, allegati, audio, video e incorporamenti YouTube/Vimeo.</p><textarea aria-label="Contenuto HTML" rows={18} value={value} onChange={e => onChange(e.target.value)} className="font-mono text-sm" spellCheck={false} /></>}
    {mode === 'html' && <label className="mt-4">Aggiungi immagine o allegato al contenuto<input type="file" disabled={uploading} onChange={async e => {
      const file = e.target.files?.[0]; if (!file) return
      setUploading(true); onBusyChange(true); setUploadError('')
      try {
        const url = await uploadMedia(file)
        const name = file.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
        const markup = file.type.startsWith('image/') ? `<figure><img src="${url}" alt="${name}"></figure>` : file.type === 'video/mp4' ? `<video src="${url}" controls></video>` : file.type === 'audio/mpeg' ? `<audio src="${url}" controls></audio>` : `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></p>`
        onChange(`${value}\n${markup}`)
      } catch (err) { setUploadError((err as Error).message) }
      finally { setUploading(false); onBusyChange(false); e.target.value = '' }
    }} /></label>}
    {uploading && <p role="status">Caricamento in corso…</p>}
    {uploadError && <p role="alert" className="error">{uploadError}</p>}
    {mode === 'preview' && <div className="article-content panel" dangerouslySetInnerHTML={{ __html: safeHtml(value) }} />}
  </section>
}
