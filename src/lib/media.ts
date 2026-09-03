import type { ProjectMedia } from '@/data/portfolio'

/** Imagem de capa pra qualquer tipo de mídia da galeria — usada na grid e no preview cíclico. */
export function mediaCoverSrc(media: ProjectMedia): string | undefined {
  if (media.thumb) return media.thumb

  switch (media.type) {
    case 'video':
    case 'image':
      return media.src
    case 'carousel':
      return media.images[0]
    case 'youtube':
      return `https://img.youtube.com/vi/${media.id}/hqdefault.jpg`
    case 'link':
      return undefined
  }
}

export async function preloadMediaImages(media: ProjectMedia): Promise<void> {
  const sources = media.type === 'image' ? [media.src] : media.type === 'carousel' ? media.images : []

  await Promise.all(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          const finish = () => resolve()
          image.onload = finish
          image.onerror = finish
          image.src = src
          if (image.complete) finish()
        }),
    ),
  )
}

/** Chave estável de React pra um item de galeria, qualquer que seja o tipo. */
export function mediaKey(media: ProjectMedia): string {
  switch (media.type) {
    case 'video':
    case 'image':
      return media.src
    case 'carousel':
      return media.images[0]
    case 'youtube':
      return media.id
    case 'link':
      return media.url
  }
}

/** URL externa pra onde o item deve linkar (em vez de abrir o lightbox interno). */
export function mediaExternalUrl(media: ProjectMedia): string | undefined {
  switch (media.type) {
    case 'youtube':
      return `https://www.youtube.com/watch?v=${media.id}`
    case 'link':
      return media.url
    default:
      return undefined
  }
}
