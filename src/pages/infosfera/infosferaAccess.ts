export type MagazineAccess = { url: string; parts?: string[]; pages: number; expiresAt: number; bytes: number; sha256: string }
export const downloadUrl = (id: string) => `/api/infosfera?issue=${encodeURIComponent(id)}&mode=download`
export async function requestAccess(id: string, lead?: { name: string; email: string; privacy: boolean; website: string }): Promise<MagazineAccess | null> {
  const response = await fetch(`/api/infosfera?issue=${encodeURIComponent(id)}`, {
    method: lead ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    ...(lead ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) } : {}),
  })
  if (response.status === 401) return null
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Accesso non disponibile. Riprova.')
  return data as MagazineAccess
}

// Only editions above the free storage file limit use parts. Reassemble the exact
// original bytes, preserving all pages, print quality, links and PDF metadata.
export async function readPdfParts(access: MagazineAccess, signal?: AbortSignal) {
  const chunks: ArrayBuffer[] = []
  for (const url of access.parts || [access.url]) {
    const r = await fetch(url,{signal})
    if (!r.ok) throw new Error('Download interrotto. Riprova.')
    chunks.push(await r.arrayBuffer())
  }
  const bytes = new Uint8Array(chunks.reduce((n,part)=>n+part.byteLength,0))
  let offset=0
  for (const chunk of chunks) { bytes.set(new Uint8Array(chunk),offset);offset+=chunk.byteLength }
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('')
  if (bytes.length !== access.bytes || hash !== access.sha256) throw new Error('Download incompleto. Riprova.')
  return bytes
}
