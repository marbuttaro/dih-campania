import { createClient } from '@supabase/supabase-js'
import { createHash, createHmac, randomBytes } from 'node:crypto'

const sha = value => createHash('sha256').update(value).digest('hex')
const cookieName = id => `infosfera_${id}`
const SESSION_SECONDS = 30 * 24 * 3600
export function validateLead(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!name || name.length > 100 || /[\p{Cc}<>]/u.test(name) || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || body.privacy !== true || body.website) return null
  return { first_name: name, email, privacy_consent: true }
}

// Dependencies are injected for meaningful route tests without live personal data.
export function createHandler({ client, random = () => randomBytes(32).toString('hex'), now = () => Date.now(), rateSecret } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0')
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    const fail = (status, error) => res.status(status).json({ error })
    if (!['GET','POST'].includes(req.method)) { res.setHeader('Allow','GET, POST'); return fail(405,'Metodo non consentito.') }
    const id = req.query.issue
    if (typeof id !== 'string' || !/^\d{1,3}$/.test(id)) return fail(400,'Numero non valido.')
    const mode = req.query.mode || 'access'
    if (!['access','download'].includes(mode) || (req.method === 'POST' && mode !== 'access')) return fail(400,'Richiesta non valida.')
    // Prevent cross-site form submissions; clients use same-origin JSON fetch.
    if (req.headers['sec-fetch-site'] === 'cross-site') return fail(403,'Richiesta non consentita.')
    if (req.method === 'POST') {
      if (!req.headers['content-type']?.startsWith('application/json')) return fail(415,'Formato non valido.')
      if (Number(req.headers['content-length'] || 0) > 4096 || JSON.stringify(req.body ?? '').length > 4096) return fail(413,'Richiesta troppo grande.')
      if (req.headers.origin && req.headers.origin !== `https://${req.headers.host}` && !(process.env.NODE_ENV !== 'production' && req.headers.origin === `http://${req.headers.host}`)) return fail(403,'Origine non consentita.')
    }
    try {
      const db = client ?? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
      const { data: issue, error: issueError } = await db.from('infosfera_issues').select('*').eq('id',id).eq('active',true).maybeSingle()
      if (issueError) throw issueError
      if (!issue) return fail(404,'Numero non disponibile.')
      const token = req.headers.cookie?.split(';').map(c => c.trim()).find(c => c.startsWith(`${cookieName(id)}=`))?.split('=')[1]
      let session = null
      if (/^[a-f0-9]{64}$/.test(token || '')) {
        const result = await db.from('infosfera_sessions').select('token_hash').eq('token_hash',sha(token)).eq('issue_id',id).gt('expires_at',new Date(now()).toISOString()).maybeSingle()
        if (result.error) throw result.error
        session = result.data
      }
      if (!session && req.method === 'POST') {
        const lead = validateLead(req.body)
        if (!lead) return fail(400,'Inserisci nome, email valida e conferma la lettura dell’informativa.')
        const ip = (req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
        const key = createHmac('sha256',rateSecret || process.env.INFOSFERA_RATE_SECRET).update(ip).digest('hex')
        const { data: allowed, error: rateError } = await db.rpc('infosfera_rate_limit',{p_key:key,p_limit:20,p_seconds:3600})
        if (rateError) throw rateError
        if (!allowed) { res.setHeader('Retry-After','3600'); return fail(429,'Troppe richieste. Riprova più tardi.') }
        const { error: leadError } = await db.from('infosfera_leads').upsert({ ...lead, issue_id:id },{ onConflict:'issue_id,email', ignoreDuplicates:true })
        if (leadError) throw leadError
        const newToken = random()
        const {error: sessionError} = await db.from('infosfera_sessions').insert({token_hash:sha(newToken),issue_id:id,expires_at:new Date(now()+SESSION_SECONDS*1000).toISOString()})
        if (sessionError) throw sessionError
        res.setHeader('Set-Cookie',`${cookieName(id)}=${newToken}; Path=/api/infosfera; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Lax`)
        session = true
      }
      if (!session) return fail(401,'Lascia nome ed email per accedere al numero completo.')
      if (mode === 'download' && issue.extra_paths?.length) return fail(409,'Scarica questo numero con il pulsante nella pagina Infosfera.')
      const { data, error } = await db.storage.from('infosfera-private').createSignedUrl(issue.storage_path,3600, mode === 'download' ? { download:`infosfera-${id}.pdf` } : {})
      if (error || !data?.signedUrl) throw error || new Error('Missing signed URL')
      if (mode === 'download') return res.redirect(302,data.signedUrl)
      const parts = []
      for (const path of issue.extra_paths || []) {
        const signed = await db.storage.from('infosfera-private').createSignedUrl(path,3600)
        if (signed.error || !signed.data?.signedUrl) throw new Error('Missing part')
        parts.push(signed.data.signedUrl)
      }
      return res.status(200).json({ url:data.signedUrl, ...(parts.length ? {parts:[data.signedUrl,...parts]} : {}), pages:issue.page_count, bytes:issue.byte_size, sha256:issue.sha256, expiresAt:now()+3600*1000 })
    } catch {
      // Do not log request bodies, addresses, tokens or service keys.
      return fail(503,'Servizio temporaneamente non disponibile. Riprova tra poco.')
    }
  }
}
