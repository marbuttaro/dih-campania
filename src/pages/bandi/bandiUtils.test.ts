import { describe, expect, it } from 'vitest'
import { BANDI, BANDI_DEMO, type Bando } from './bandiData'
import { FILTRI_VUOTI, filtraBandi, ordinaBandi, statoBando, testoScadenza } from './bandiUtils'

const oggi = new Date('2026-11-11T10:00:00')

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
    expect(statoBando({ ...base, scadenza: '2026-11-11' }, new Date('2026-11-11T22:00:00'))).toBe('in-scadenza')
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
  it('risulta aperto a sportello', () => {
    expect(statoBando(BANDI[0], oggi)).toBe('aperto')
    expect(testoScadenza(BANDI[0], oggi).principale).toBe('A sportello')
  })
})

describe('filtraBandi e ordinaBandi', () => {
  const tutti = [...BANDI, ...BANDI_DEMO]

  it('combina ambito, destinatari, stato e ricerca libera', () => {
    const r = filtraBandi(tutti, { ...FILTRI_VUOTI, ambito: 'sostenibilita', destinatario: 'medie', stato: 'aperti' }, oggi)
    expect(r.map((b) => b.id)).toContain('investimenti-sostenibili-4-0-2026')
    expect(r.every((b) => b.ambiti.includes('sostenibilita'))).toBe(true)
    expect(filtraBandi(tutti, { ...FILTRI_VUOTI, testo: 'mezzogiorno' }, oggi)).toHaveLength(1)
    expect(filtraBandi(tutti, { ...FILTRI_VUOTI, testo: 'universita' }, oggi).length).toBeGreaterThan(0)
  })

  it('mette i chiusi in fondo e i bandi in scadenza in cima', () => {
    const ordinati = ordinaBandi(tutti, oggi)
    expect(statoBando(ordinati[0], oggi)).toBe('in-scadenza')
    expect(statoBando(ordinati[ordinati.length - 1], oggi)).toBe('chiuso')
  })
})
