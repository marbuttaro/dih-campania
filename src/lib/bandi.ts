import { requireSupabase } from './supabase'
import type { Bando } from '../pages/bandi/bandiData'

export interface BandoRecord {
  id: string
  scheda: Omit<Bando, 'id'>
  published: boolean
  deleted_at: string | null
  updated_at: string
  version: number
}

export async function listBandi(editor = false): Promise<BandoRecord[]> {
  const rows: BandoRecord[] = []
  const batchSize = 500
  let lastId = ''
  for (;;) {
    let query = requireSupabase().from('bandi').select('id,scheda,published,deleted_at,updated_at,version').gt('id', lastId).order('id').limit(batchSize)
    if (!editor) query = query.eq('published', true).is('deleted_at', null)
    const { data, error } = await query
    if (error) throw new Error('Impossibile caricare il catalogo bandi.')
    rows.push(...data as BandoRecord[])
    if (data.length < batchSize) return rows
    lastId = data[data.length - 1].id
  }
}

export async function saveBando(id: string, scheda: BandoRecord['scheda'], published: boolean, original?: BandoRecord) {
  const table = requireSupabase().from('bandi')
  const result = original
    ? await table.update({ scheda, published }).eq('id', original.id).eq('version', original.version).select('id').maybeSingle()
    : await table.insert({ id, scheda, published }).select('id').single()
  checkWrite(result)
}

function checkWrite(result: { data: unknown; error: { message: string } | null }) {
  if (result.error) throw new Error('Salvataggio non riuscito. Verifica i dati e la connessione.')
  if (!result.data) throw new Error('La scheda è cambiata in un’altra sessione. Riaprila per vedere l’ultima versione.')
}

export async function moveBando(record: BandoRecord, action: 'trash' | 'restore' | 'delete') {
  const table = requireSupabase().from('bandi')
  const query = action === 'delete' ? table.delete().not('deleted_at', 'is', null)
    : table.update({ deleted_at: action === 'restore' ? null : new Date().toISOString() })
  checkWrite(await query.eq('id', record.id).eq('version', record.version).select('id').maybeSingle())
}
