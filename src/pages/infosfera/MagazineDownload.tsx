import { useState } from 'react'
import { Download } from 'lucide-react'
import { downloadUrl, readPdfParts, requestAccess, type MagazineAccess } from './infosferaAccess'

export function MagazineDownload({id,access,className}: {id:string;access:MagazineAccess;className:string}) {
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  if (!access.parts?.length) return <a href={downloadUrl(id)} target="_blank" rel="noopener noreferrer" className={className}><Download size={18}/> Scarica PDF</a>
  const download = async () => {
    setBusy(true);setError('')
    try {
      const fresh=await requestAccess(id)
      if (!fresh) throw new Error('Accesso scaduto: riapri la rivista e inserisci i tuoi dati.')
      const bytes=await readPdfParts(fresh)
      const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}))
      const a=document.createElement('a');a.href=url;a.download=`infosfera-${id}.pdf`;a.click()
      setTimeout(()=>URL.revokeObjectURL(url),60000)
    } catch(e) {setError(e instanceof Error?e.message:'Download non riuscito. Riprova.')}
    finally {setBusy(false)}
  }
  return <div><button type="button" className={className} disabled={busy} onClick={()=>void download()}><Download size={18}/>{busy?'Preparazione PDF…':'Scarica PDF'}</button>{error&&<p role="alert" className="mt-2 text-sm">{error}</p>}</div>
}
