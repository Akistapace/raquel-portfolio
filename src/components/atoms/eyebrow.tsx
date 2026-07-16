import * as React from 'react'
import { cn } from '@/lib/utils'

type EyebrowProps = React.ComponentPropsWithoutRef<'p'> & {
  /** light = sobre fundo claro (padrão); dark = sobre painel escuro */
  tone?: 'light' | 'dark'
}

/** Rótulo de seção em pílula rosa com contorno — estilo sticker. */
export function Eyebrow({ className, tone = 'light', children, ...props }: EyebrowProps) {
  return (
    <p className={cn('inline-flex', className)} {...props}>
      <span
        className={cn(
          'inline-flex items-center rounded-full border-2 px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase',
          tone === 'light'
            ? 'border-ink bg-pink text-ink'
            : 'border-paper bg-pink text-ink',
        )}
      >
        {children}
      </span>
    </p>
  )
}
