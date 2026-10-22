import { lazy, Suspense } from 'react'
const Admin = lazy(() => import('./Admin'))
const PublicNews = lazy(() => import('./PublicNews'))
export function CmsApp() {
  const path = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '')
  let slug: string | undefined
  try { slug = path.startsWith('/news/') ? decodeURIComponent(path.slice(6)) : /^\/\d{4}\/\d{2}\/\d{2}\//.test(path) ? decodeURIComponent(path.split('/').pop() || '') : undefined } catch { slug = '__invalid_url__' }
  return <Suspense fallback={<p className="p-12" role="status">Caricamento…</p>}><div className="min-h-screen flex flex-col">{path === '/admin' ? <Admin /> : <PublicNews slug={slug} />}</div></Suspense>
}
