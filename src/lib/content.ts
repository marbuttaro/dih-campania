import DOMPurify from 'dompurify'

const embedHosts = new Set(['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'])
DOMPurify.addHook('afterSanitizeAttributes', node => {
  if (node.tagName === 'IFRAME') {
    try {
      const url = new URL(node.getAttribute('src') || '')
      if (url.protocol !== 'https:' || !embedHosts.has(url.hostname)) { node.remove(); return }
      node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation')
      node.setAttribute('loading', 'lazy')
      node.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
      if (!node.getAttribute('title')) node.setAttribute('title', 'Video incorporato')
    } catch { node.remove() }
  }
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') node.setAttribute('rel', 'noopener noreferrer')
})

export function safeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'], ADD_ATTR: ['allowfullscreen', 'target'],
    FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select', 'style', 'svg', 'math', 'object', 'embed'],
    FORBID_ATTR: ['srcdoc'],
  })
}

export function plainText(html: string) {
  const doc = new DOMParser().parseFromString(safeHtml(html), 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}
