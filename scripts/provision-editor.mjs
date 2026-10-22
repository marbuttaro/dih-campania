/** Run only on a trusted workstation. Creates or authorizes the requested editor.
 * node --env-file=.env.migration scripts/provision-editor.mjs
 * Requires CMS_EDITOR_EMAIL and CMS_EDITOR_PASSWORD for a new auth user.
 * It never prints passwords and never changes an existing user's password.
 */
import { createClient } from '@supabase/supabase-js'
const { SUPABASE_URL, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CMS_EDITOR_EMAIL, CMS_EDITOR_PASSWORD } = process.env
if (!CMS_EDITOR_EMAIL || !SUPABASE_SERVICE_ROLE_KEY || !(SUPABASE_URL || VITE_SUPABASE_URL)) throw new Error('Missing server-side provisioning variables')
const db = createClient(SUPABASE_URL || VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
let editor
for (let page = 1; ; page++) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 100 })
  if (error) throw error
  editor = data.users.find(user => user.email?.toLowerCase() === CMS_EDITOR_EMAIL.toLowerCase())
  if (editor || data.users.length < 100) break
}
if (!editor) {
  if (!CMS_EDITOR_PASSWORD || CMS_EDITOR_PASSWORD.length < 16) throw new Error('Provide a new editor password of at least 16 characters')
  const { data, error } = await db.auth.admin.createUser({ email: CMS_EDITOR_EMAIL, password: CMS_EDITOR_PASSWORD, email_confirm: true, user_metadata: { display_name: 'Redazione Campania DIH' } })
  if (error) throw error
  editor = data.user
}
const { error } = await db.from('cms_editors').upsert({ user_id: editor.id }, { onConflict: 'user_id' })
if (error) throw error
console.log(`Editor authorized: ${CMS_EDITOR_EMAIL} (${editor.id})`)
