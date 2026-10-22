import { Node, mergeAttributes } from '@tiptap/core'

function mediaNode(name: string, tag: string, attributes: Record<string, string | boolean>) {
  return Node.create({
    name, group: 'block', atom: true,
    addAttributes() { return { src: { default: null }, title: { default: null } } },
    parseHTML() { return [{ tag }] },
    renderHTML({ HTMLAttributes }) { return [tag, mergeAttributes(attributes, HTMLAttributes)] },
  })
}
export const Video = mediaNode('articleVideo', 'video', { controls: true, preload: 'metadata' })
export const Audio = mediaNode('articleAudio', 'audio', { controls: true, preload: 'metadata' })
export const Embed = mediaNode('articleEmbed', 'iframe', { allowfullscreen: true, sandbox: 'allow-scripts allow-same-origin allow-presentation' })

export function videoEmbedUrl(value: string) {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error('Usa un indirizzo HTTPS di YouTube o Vimeo.')
  if (url.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(url.pathname.slice(1))}`
  if (['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
    const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)$/)?.[1]
    if (id && /^[\w-]+$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
    const id = url.pathname.match(/(?:\/video)?\/(\d+)$/)?.[1]
    if (id) return `https://player.vimeo.com/video/${id}`
  }
  throw new Error('Indirizzo video non riconosciuto. Usa un link YouTube o Vimeo.')
}
