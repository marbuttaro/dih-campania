import { createHmac } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const emailPattern = /^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]+$/u
const text = (v) => typeof v === 'string' ? v.trim() : ''
const checked = ({ data, error }) => { if (error) throw error; return data }

export function readConsultation(input) {
  const id = text(input?.requestId), bando_id = text(input?.bandoId)
  const nome = text(input?.nome), email = text(input?.email).toLowerCase(), messaggio = text(input?.messaggio)
  if (!uuid.test(id) || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(bando_id) || !nome || nome.length > 120 ||
    !emailPattern.test(email) || email.length > 254 || /[\u0000-\u001f\u007f]/u.test(nome + email) ||
    !messaggio || messaggio.length > 3000 || input.privacy !== 'on' || input.website) return null
  return { id, bando_id, nome, email, messaggio }
}

export function mailContent(row) {
  const base = process.env.BANDI_SITE_URL || 'https://website-seven-indol-33.vercel.app'
  const link = new URL('/bandi', base)
  link.searchParams.set('q', row.bando_id)
  link.hash = 'catalogo'
  const cleanTitle = row.titolo.replace(/[\r\n]+/g, ' ')
  return {
    subject: `[Campania DIH] Consulenza bando [${row.bando_id}] ${cleanTitle}`,
    text: [
      'È arrivata una richiesta di consulenza dal catalogo bandi di Campania DIH.', '',
      `Bando: ${cleanTitle}`, `ID bando: ${row.bando_id}`,
      `Scheda: ${link.href}`,
      '', `Nome: ${row.nome}`, `Email: ${row.email}`, '', row.messaggio, '', `Riferimento richiesta: ${row.id}`,
    ].join('\n'),
  }
}

function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.BANDI_MAIL_FROM && process.env.BANDI_MAIL_TO)
}

export async function sendEmail(row) {
  const { RESEND_API_KEY, BANDI_MAIL_FROM, BANDI_MAIL_TO } = process.env
  if (!RESEND_API_KEY || !BANDI_MAIL_FROM || !BANDI_MAIL_TO) throw new Error('Mail is not configured')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': row.id },
    body: JSON.stringify({ from: BANDI_MAIL_FROM, to: [BANDI_MAIL_TO], reply_to: row.email, ...mailContent(row) }),
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok || !(await response.json()).id) throw new Error('Mail was not accepted')
}

export async function deliver(db, row, send = sendEmail) {
  if (row.sent_at) return true
  const now = new Date(), lease = new Date(now.getTime() + 120000).toISOString()
  const claimed = checked(await db.from('bando_consulenze').update({ lease_until: lease }).eq('id', row.id)
    .is('sent_at', null).or(`lease_until.is.null,lease_until.lt.${now.toISOString()}`).select('id').maybeSingle())
  if (!claimed) return false
  try {
    await send(row)
  } catch {
    checked(await db.from('bando_consulenze').update({ lease_until: null }).eq('id', row.id).eq('lease_until', lease))
    return false
  }
  checked(await db.from('bando_consulenze').update({ sent_at: new Date().toISOString(), lease_until: null }).eq('id', row.id).eq('lease_until', lease))
  return true
}

export function createConsultationHandler({ client, send } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    const fail = (s, error) => res.status(s).json({ error })
    if (req.method !== 'POST') { res.setHeader('Allow','POST'); return fail(405,'Metodo non consentito.') }
    if (!req.headers['content-type']?.startsWith('application/json')) return fail(415,'Invia il modulo in formato JSON.')
    const origin = req.headers.origin
    if (req.headers['sec-fetch-site'] === 'cross-site' || (origin && origin !== 'https://' + req.headers.host &&
      !(process.env.NODE_ENV !== 'production' && origin === 'http://' + req.headers.host))) return fail(403,'Origine non consentita.')
    if (JSON.stringify(req.body ?? '').length > 8000) return fail(413,'Richiesta troppo lunga.')
    try {
      const db = client ?? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
      if (req.body?.action === 'retry') {
        const token = (req.headers.authorization || '').replace(/^Bearer /,'')
        if (!token) return fail(401,'Accedi alla redazione.')
        const { data: auth, error } = await db.auth.getUser(token)
        if (error || !auth.user) return fail(401,'Accedi alla redazione.')
        const editor = checked(await db.from('cms_editors').select('user_id').eq('user_id', auth.user.id).maybeSingle())
        if (!editor) return fail(403,'Accesso riservato alla redazione.')
        if (!uuid.test(req.body.requestId)) return fail(400,'Richiesta non valida.')
        const row = checked(await db.from('bando_consulenze').select('*').eq('id', req.body.requestId).maybeSingle())
        if (!row) return fail(404,'Richiesta non trovata.')
        if (!row.sent_at && !send && !mailConfigured()) {
          return fail(503,'Richiesta salvata. Le notifiche email saranno disponibili dopo la configurazione di Resend.')
        }
        if (!await deliver(db,row,send)) return fail(503,'Email ancora in attesa. Controlla il servizio di invio e riprova.')
        return res.status(200).json({ sent: true })
      }
      const data = readConsultation(req.body)
      if (!data) return fail(400,'Controlla i dati, il messaggio e la presa visione dell’informativa.')
      const ip = (req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
      const key = createHmac('sha256', process.env.INFOSFERA_RATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY).update('bandi:' + ip).digest('hex')
      const allowed = checked(await db.rpc('infosfera_rate_limit',{p_key:key,p_limit:12,p_seconds:3600}))
      if (!allowed) { res.setHeader('Retry-After','3600'); return fail(429,'Troppe richieste. Riprova più tardi.') }
      const bando = checked(await db.from('bandi').select('scheda->>titolo').eq('id',data.bando_id).eq('published',true).is('deleted_at',null).maybeSingle())
      if (!bando) return fail(404,'Questa scheda non è più disponibile nel catalogo.')
      const result = await db.from('bando_consulenze').insert({ ...data, titolo: bando.titolo }).select('*').single()
      let row
      if (result.error?.code === '23505') {
        row = checked(await db.from('bando_consulenze').select('*').eq('id',data.id).single())
        if (!Object.entries(data).every(([k,v]) => row[k] === v)) return fail(409,'La richiesta è cambiata. Invia nuovamente dal modulo.')
      } else row = checked(result)
      const sent = row.sent_at || ((send || mailConfigured()) && await deliver(db,row,send))
      return res.status(sent ? 200 : 202).json({ registered: true })
    } catch { return fail(503,'Servizio temporaneamente non disponibile. Riprova.') }
  }
}
