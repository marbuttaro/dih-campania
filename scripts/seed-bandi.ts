// One-time import after applying 202611230001_bandi.sql.
// node --env-file=.env --import tsx scripts/seed-bandi.ts
import { createClient } from '@supabase/supabase-js'
import { isDeepStrictEqual } from 'node:util'
import { BANDI } from '../src/pages/bandi/bandiData'

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
const records = BANDI.map(({ id, ...scheda }) => ({ id, scheda, published: true }))
const { count, error: readError } = await db.from('bandi').select('id', { count: 'exact', head: true })
if (readError) throw readError
if (count !== 0) throw new Error('Il catalogo contiene già delle schede.')
const { data, error } = await db.from('bandi').insert(records).select('id,scheda,published')
if (error) throw error
const byId = new Map(data.map(row => [row.id, row]))
if (records.length !== data.length || records.some(row => !isDeepStrictEqual(row, byId.get(row.id)))) {
  throw new Error('La verifica delle schede importate non è riuscita.')
}
console.log(`Importate e confrontate ${records.length} schede.`)
