import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
  /** light = sobre fundo claro (padrão); dark = sobre painel escuro */
  tone?: 'light' | 'dark'
  /** cor da pílula — alterna para dar ritmo de collage */
  fill?: 'lavender' | 'pink' | 'none'
}

export function Badge({ className, tone = 'light', fill = 'lavender', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-2 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase',
        tone === 'light' ? 'border-ink text-ink' : 'border-paper text-paper',
        fill === 'lavender' && 'bg-lavender-soft',
        fill === 'pink' && 'bg-pink-soft',
        className,
      )}
      {...props}
    />
  )
}
