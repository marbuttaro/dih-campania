export type GalleryPhoto = {
  /** Versione grande, aperta nel visore */
  src: string
  /** Miniatura per la striscia di foto */
  thumb: string
  width: number
  height: number
}

export type EventGallery = {
  id: string
  /** Prima parte della didascalia, in evidenza (es. il nome del progetto) */
  label: string
  caption: string
  photos: GalleryPhoto[]
}

const photos = (folder: string, sizes: [number, number][]): GalleryPhoto[] =>
  sizes.map(([width, height], i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      src: `/assets/eventi/gallery/${folder}/foto-${n}.webp`,
      thumb: `/assets/eventi/gallery/${folder}/foto-${n}-mini.webp`,
      width,
      height,
    }
  })

// Dal più recente al meno recente. Le foto si aggiungono in public/assets/eventi/gallery/<cartella>/
export const EVENT_GALLERIES: EventGallery[] = [
  {
    id: 'pride-2026-04-28',
    label: 'PRIDE',
    caption: 'Risultati, Impatti e Visioni per la Trasformazione Digitale. Napoli, 28 aprile 2026',
    photos: photos('pride-2026-04-28', [
      [1200, 1600],
      [1200, 1600],
      [900, 1600],
      [1200, 1600],
      [1200, 1600],
      [1145, 1600],
      [1200, 1600],
      [900, 1600],
      [900, 1600],
      [900, 1600],
      [1200, 1600],
      [1200, 1600],
      [900, 1600],
    ]),
  },
]
