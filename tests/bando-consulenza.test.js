import { describe, expect, it, vi } from 'vitest'
import { createConsultationHandler, deliver, sendEmail, mailContent, readConsultation } from '../server/consulenza-bando.mjs'

const input = { requestId:'bcf1131e-2df2-4d20-aed2-081bfe0ff45a', bandoId:'wp-11957', nome:' Maria Rossi ',email:'MARIA@example.org',messaggio:'Vorrei conoscere i requisiti.',privacy:'on' }
const row = { ...readConsultation(input), titolo:'Titolo ufficiale', sent_at:null }
function response() {
  return { setHeader: vi.fn(), status(s) { this.code = s; return this }, json(value) { this.body = value; return this } }
}

describe('richiesta di consulenza per bando', () => {
  it('normalizza il contatto e accetta dal browser solo l’ID della scheda', () => {
    expect(readConsultation({...input,titolo:'Altro titolo',to:'altro@example.org'})).toEqual({
      id:input.requestId,bando_id:'wp-11957',nome:'Maria Rossi',email:'maria@example.org',messaggio:input.messaggio,
    })
  })
  it.each([{bandoId:''},{bandoId:'non valido'},{email:'non-email'},{privacy:''},{messaggio:' '},{website:'robot'}])('verifica i dati richiesti', patch => {
    expect(readConsultation({...input,...patch})).toBeNull()
  })
  it('include titolo e ID in oggetto e testo e apre la scheda dal collegamento', () => {
    const msg = mailContent(row)
    expect(msg.subject).toContain('[wp-11957] Titolo ufficiale')
    expect(msg.text).toContain('ID bando: wp-11957')
    expect(msg.text).toContain('/bandi?q=wp-11957#catalogo')
    expect(msg.text).toContain(input.messaggio)
  })
  it.each([
    [{method:'GET',headers:{}},405],
    [{method:'POST',headers:{'content-type':'text/plain'}},415],
    [{method:'POST',headers:{'content-type':'application/json','sec-fetch-site':'cross-site'}},403],
    [{method:'POST',headers:{'content-type':'application/json'},body:{action:'retry',requestId:input.requestId}},401],
  ])('rifiuta chiamate non applicabili',async (req,code) => {
    const res=response(); await createConsultationHandler({client:{}})(req,res);expect(res.code).toBe(code)
  })
  it('in caso di errore lascia la notifica in attesa, permette il reinvio ed evita un secondo invio a conferma ricevuta', async () => {
    let lease = null, sent = null
    const db = { from() {
      let patch
      const query={ update(value) { patch=value;return query },eq(){return query},is(){return query},or(){return query},select(){return query},
        async maybeSingle(){if(lease || sent)return {data:null};lease=patch.lease_until; return {data:{id:row.id}}},
        then(resolve){lease=patch.lease_until;sent=patch.sent_at ?? null;resolve({data:null})},
      };return query
    } }
    const send = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined)
    expect(await deliver(db,row,send)).toBe(false)
    expect(lease).toBeNull()
    expect(await deliver(db,row,send)).toBe(true)
    expect(await deliver(db,{...row,sent_at:sent},send)).toBe(true)
    expect(send).toHaveBeenCalledTimes(2)
  })
})

describe('invio transazionale Resend', () => {
  it('usa il destinatario configurato, Reply-To, chiave di idempotenza e link del dominio ufficiale', async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'ricevuta-test' }) })
    vi.stubGlobal('fetch',request)
    vi.stubEnv('RESEND_API_KEY','test-only')
    vi.stubEnv('BANDI_MAIL_FROM','Campania DIH <notifiche@example.org>')
    vi.stubEnv('BANDI_MAIL_TO','redazione@example.org')
    vi.stubEnv('BANDI_SITE_URL','https://www.example.org')
    try {
      await sendEmail(row)
      const [url,options] = request.mock.calls[0]
      expect(url).toBe('https://api.resend.com/emails')
      expect(options.headers['Idempotency-Key']).toBe(row.id)
      expect(JSON.parse(options.body)).toMatchObject({to:['redazione@example.org'],reply_to:'maria@example.org',
        subject: expect.stringContaining('[wp-11957]'), text:expect.stringContaining('https://www.example.org/bandi?q=wp-11957#catalogo')})
      request.mockResolvedValue({ok:false})
      await expect(sendEmail(row)).rejects.toThrow()
      vi.stubEnv('RESEND_API_KEY','')
      await expect(sendEmail(row)).rejects.toThrow()
      expect(request).toHaveBeenCalledTimes(2)
    } finally { vi.unstubAllGlobals(); vi.unstubAllEnvs() }
  })
})
