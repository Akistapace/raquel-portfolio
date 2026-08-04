import { useEffect, useState } from 'react'
import type { ProjectMedia } from '@/data/portfolio'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'

type CyclingMediaProps = {
  gallery: ProjectMedia[]
  /** cicla pro próximo item da galeria a cada `intervalMs` enquanto true */
  active: boolean
  intervalMs?: number
  alt: string
  hue?: string
  label?: string
  className?: string
}

/** Mostra o item atual da galeria do projeto; avança pro próximo enquanto `active`. */
export function CyclingMedia({
  gallery,
  active,
  intervalMs = 2500,
  alt,
  hue,
  label,
  className,
}: CyclingMediaProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active || gallery.length <= 1) {
      setIndex(0)
      return
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % gallery.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [active, gallery.length, intervalMs])

  const current = gallery[index]
  if (!current) return null

  // pré-carrega o próximo item do ciclo (vídeo escondido, sem tocar) pra troca
  // não esperar o buffer — sem baixar a galeria inteira de uma vez.
  const next = gallery.length > 1 ? gallery[(index + 1) % gallery.length] : undefined
  const preload =
    next && next.src !== current.src && next.type === 'video' ? (
      <video src={next.src} preload="auto" muted playsInline className="hidden" aria-hidden />
    ) : null

  if (current.type === 'video') {
    return (
      <>
        <video
          key={current.src}
          src={current.src}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          className={className ?? 'h-full w-full object-cover'}
        />
        {preload}
      </>
    )
  }

  return (
    <>
      <PlaceholderMedia src={current.src} alt={alt} hue={hue} label={label} className={className} />
      {preload}
    </>
  )
}
