import { describe, expect, it } from 'vitest'
import { BANDI, BANDI_DEMO, type Bando } from './bandiData'
import { FILTRI_VUOTI, fasciaBudget, filtraBandi, ordinaBandi, statoBando, testoScadenza } from './bandiUtils'

const oggi = new Date('2026-11-11T10:00:00+01:00')

const base: Bando = {
  id: 'x',
  titolo: 'Test',
  ente: 'Ente',
  livello: 'Regionale',
  ambiti: ['digitalizzazione'],
  destinatari: ['medie'],
  abstract: [],
  modalita: 'scadenza',
  link: 'https://example.com',
}

describe('statoBando', () => {
  it('distingue aperto, in scadenza, in apertura e chiuso', () => {
    expect(statoBando({ ...base, scadenza: '2027-03-31' }, oggi)).toBe('aperto')
    expect(statoBando({ ...base, scadenza: '2026-11-20T12:00' }, oggi)).toBe('in-scadenza')
    expect(statoBando({ ...base, apertura: '2026-12-01', scadenza: '2027-02-28' }, oggi)).toBe('in-apertura')
    expect(statoBando({ ...base, scadenza: '2026-09-30' }, oggi)).toBe('chiuso')
  })

  it("una scadenza senza ora resta valida fino a fine giornata", () => {
    expect(statoBando({ ...base, scadenza: '2026-11-11' }, new Date('2026-11-11T22:00:00+01:00'))).toBe('in-scadenza')
  })

  it('i bandi a sportello restano aperti finché non vengono chiusi a mano', () => {
    expect(statoBando({ ...base, modalita: 'sportello', apertura: '2026-10-06' }, oggi)).toBe('aperto')
    expect(statoBando({ ...base, modalita: 'sportello', chiusoManualmente: true }, oggi)).toBe('chiuso')
  })
})

describe('testoScadenza', () => {
  it('formatta le righe come nel design', () => {
    expect(testoScadenza({ ...base, scadenza: '2026-11-20T12:00' }, oggi)).toEqual({
      principale: 'Scade tra 9 giorni',
      dettaglio: '20 nov 2026, ore 12:00',
    })
    expect(testoScadenza({ ...base, scadenza: '2026-12-15' }, oggi)).toEqual({
      principale: 'Scade il 15 dic 2026',
      dettaglio: 'tra 34 giorni',
    })
    expect(testoScadenza({ ...base, apertura: '2026-12-01', scadenza: '2027-02-28' }, oggi)).toEqual({
      principale: 'Apre il 1 dic 2026',
      dettaglio: 'chiude il 28 feb 2027',
    })
  })
})

describe('il bando reale Investimenti Sostenibili 4.0', () => {
  it('chiude dopo il primo giorno di invio come da decreto del 6 ottobre', () => {
    const bando = BANDI.find(b => b.id === 'investimenti-sostenibili-4-0-2026')!
    expect(statoBando(bando, oggi)).toBe('chiuso')
    expect(statoBando(bando, new Date('2026-10-06T09:00:00Z'))).toBe('in-scadenza')
  })
})

describe('filtraBandi e ordinaBandi', () => {
  const tutti = [...BANDI, ...BANDI_DEMO]

  it('combina ambito, destinatari, stato e ricerca libera', () => {
    const r = filtraBandi(tutti, { ...FILTRI_VUOTI, ambito: 'sostenibilita', destinatario: 'medie', stato: 'aperti' }, oggi)
    expect(r.map((b) => b.id)).toContain('sviluppo-competenze-secondo-sportello-2026')
    expect(r.every((b) => b.ambiti.includes('sostenibilita'))).toBe(true)
    expect(filtraBandi(tutti, { ...FILTRI_VUOTI, testo: 'mezzogiorno' }, oggi).length).toBeGreaterThan(1)
    expect(filtraBandi(tutti, { ...FILTRI_VUOTI, testo: 'universita' }, oggi).length).toBeGreaterThan(0)
  })

  it('mette i bandi in scadenza in cima e le schede informative in fondo', () => {
    const ordinati = ordinaBandi(tutti, oggi)
    expect(statoBando(ordinati[0], oggi)).toBe('in-scadenza')
    expect(statoBando(ordinati[ordinati.length - 1], oggi)).toBe('informativo')
  })
})

describe('archivio WordPress e filtri delle schede reali', () => {
  it('rende raggiungibili tutte le 241 pubblicazioni originali una volta sola', () => {
    const fonti = BANDI.flatMap(b => b.pubblicazioni ?? [])
    expect(fonti).toHaveLength(241)
    expect(new Set(fonti.map(p => p.wpId)).size).toBe(241)
    expect(new Set(fonti.map(p => p.slug)).size).toBe(241)
    expect(BANDI.every(b => b.tipologia && b.ente && b.destinatari.length && (b.pubblicazioni?.length || b.approfondimento))).toBe(true)
    expect(fonti.every(p => p.titolo.trim() && p.slug && p.data)).toBe(true)
  })

  it('distingue dotazioni complessive, importi parziali e importi mancanti', () => {
    expect(fasciaBudget(base)).toBe('assente')
    expect(fasciaBudget({ ...base, budget: 'Fino a 20.000 € per progetto' })).toBe('parziale')
    expect([999999, 1000000, 10000000, 100000000].map(dotazioneEuro => fasciaBudget({ ...base, dotazioneEuro })))
      .toEqual(['meno-1m', '1m-10m', '10m-100m', 'da-100m'])
  })

  it('combina tutti i nuovi filtri sul voucher cloud e mantiene i massimali separati dalla dotazione', () => {
    const risultati = filtraBandi(BANDI, { ...FILTRI_VUOTI, stato: 'aperti', tipologia: 'Voucher',
      ente: 'Ministero delle Imprese e del Made in Italy', budget: 'da-100m', destinatario: 'professionisti' }, oggi)
    expect(risultati.map(b => b.id)).toEqual(['wp-11957'])
    expect(risultati[0].dotazioneEuro).toBe(150_000_000)
  })

  it('esclude schede informative, sportelli sospesi e termini ignoti dagli attivi', () => {
    const records: Bando[] = (['informativa', 'sospesa', 'non-documentata', 'scadenza'] as const)
      .map(modalita => ({ ...base, modalita }))
    expect(filtraBandi(records, { ...FILTRI_VUOTI, stato: 'attivi' }, oggi)).toEqual([])
  })

  it('valuta il termine nell’ora italiana anche con un browser in un altro fuso', () => {
    const bando = BANDI.find(b => b.id === 'wp-11957')!
    expect(statoBando(bando, new Date('2027-01-20T10:59:59Z'))).toBe('in-scadenza')
    expect(statoBando(bando, new Date('2027-01-20T11:00:01Z'))).toBe('chiuso')
    expect(statoBando({ ...base, scadenza: '2026-07-01' }, new Date('2026-07-01T22:00:00Z'))).toBe('chiuso')
  })
})
