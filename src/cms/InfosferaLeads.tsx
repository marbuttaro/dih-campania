import { useState } from 'react'
import { requireSupabase } from '../lib/supabase'
import { LATEST_ISSUE, PAST_ISSUES } from '../pages/infosfera/infosferaData'
type Lead={id:string;issue_id:string;first_name:string;email:string;created_at:string}
const labels=Object.fromEntries([LATEST_ISSUE,...PAST_ISSUES].map(i=>[i.id,i.label]))
const csvCell=(value:string)=>`"${(/^[=+@\-\t\r\n]/.test(value)?"'":'')+value.replaceAll('"','""')}"`
export function InfosferaLeads() {
  const [open,setOpen]=useState(false),[rows,setRows]=useState<Lead[]>([]),[count,setCount]=useState(0),[page,setPage]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const load=async(n:number)=>{
    setBusy(true);setError('')
    try {
      const {data,error,count}=await requireSupabase().from('infosfera_leads').select('id,issue_id,first_name,email,created_at',{count:'exact'}).order('created_at',{ascending:false}).order('id').range(n*50,n*50+49)
      if(error) throw error
      setRows(data);setCount(count||0);setPage(n)
    } catch {setError('Impossibile caricare i contatti. Riprova.')} finally {setBusy(false)}
  }
  const exportAll=async()=>{
    setBusy(true);setError('')
    try {
      const all:Lead[]=[];const cutoff=new Date().toISOString()
      for(let offset=0;;offset+=500){
        const {data,error}=await requireSupabase().from('infosfera_leads').select('id,issue_id,first_name,email,created_at').lte('created_at',cutoff).order('created_at').order('id').range(offset,offset+499)
        if(error)throw error
        all.push(...data);if(data.length<500)break
      }
      const csv=['Nome,Email,Numero,Data richiesta',...all.map(r=>[r.first_name,r.email,labels[r.issue_id]||r.issue_id,r.created_at].map(csvCell).join(','))].join('\r\n')
      const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}))
      const a=document.createElement('a');a.href=url;a.download=`infosfera-contatti-${cutoff.slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
    }catch{setError('Esportazione non riuscita. Riprova.')}finally{setBusy(false)}
  }
  return <section className="panel mb-6"><button className="secondary" aria-expanded={open} onClick={()=>{setOpen(!open);if(!open)void load(0)}}>Contatti Infosfera</button>{open&&<div className="mt-5">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl">Richieste di accesso · {count}</h2><button disabled={busy} onClick={()=>void exportAll()}>Esporta tutti in CSV</button></div>
    <p className="my-3 text-sm">Contatti raccolti per l’accesso alla rivista. Non costituiscono iscrizioni a una newsletter.</p>
    {error&&<p role="alert" className="error">{error}</p>}{busy?<p role="status">Caricamento…</p>:<div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{['Nome','Email','Numero','Data'].map(t=><th key={t} className="p-2 border-b">{t}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id}><td className="p-2">{r.first_name}</td><td className="p-2">{r.email}</td><td className="p-2">{labels[r.issue_id]||r.issue_id}</td><td className="p-2">{new Date(r.created_at).toLocaleString('it-IT',{timeZone:'Europe/Rome'})}</td></tr>)}</tbody></table>{!rows.length&&<p className="p-3">Nessuna richiesta.</p>}</div>}
    <nav aria-label="Pagine contatti" className="flex gap-3 items-center mt-4"><button disabled={busy||page===0} onClick={()=>void load(page-1)}>Precedente</button><span>{page+1} / {Math.max(1,Math.ceil(count/50))}</span><button disabled={busy||(page+1)*50>=count} onClick={()=>void load(page+1)}>Successiva</button><button className="secondary" disabled={busy} onClick={()=>void load(page)}>Aggiorna</button></nav>
  </div>}</section>
}
