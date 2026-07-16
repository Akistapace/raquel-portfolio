import { useState } from 'react'
import { cn } from '@/lib/utils'

type PlaceholderMediaProps = {
  src?: string
  alt: string
  /** Cor chapada do placeholder enquanto o asset não existe em public/assets */
  hue?: string
  label?: string
  className?: string
}

/**
 * Tenta carregar a imagem real; se o arquivo ainda não foi exportado do Canva,
 * cai num placeholder chapado com inicial em serifa — estilo sticker.
 */
export function PlaceholderMedia({ src, alt, hue = '#F2B9DA', label, className }: PlaceholderMediaProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  if (showImage) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  const initial = (label ?? alt).trim().charAt(0).toUpperCase() || 'R'

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
      style={{ containerType: 'size', background: hue }}
    >
      <span
        aria-hidden
        className="font-display leading-none font-bold select-none"
        style={{ color: 'rgba(20, 20, 20, 0.18)', fontSize: 'min(50cqw, 75cqh)' }}
      >
        {initial}
      </span>
      <span
        aria-hidden
        className="absolute right-4 bottom-3 text-[10px] font-semibold tracking-[0.25em] uppercase"
        style={{ color: 'rgba(20, 20, 20, 0.45)' }}
      >
        asset em breve
      </span>
    </div>
  )
}
