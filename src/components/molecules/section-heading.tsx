import { Eyebrow } from '@/components/atoms/eyebrow'
import { SplitWords } from '@/components/atoms/split-words'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  /** light = sobre fundo claro (padrão); dark = sobre painel escuro */
  tone?: 'light' | 'dark'
  /** pinta o título como texto selecionado (mesmo estilo do ::selection) */
  selected?: boolean
  className?: string
}

export function SectionHeading({ eyebrow, title, tone = 'light', selected, className }: SectionHeadingProps) {
  return (
    <header className={cn('space-y-6', className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          'font-display text-4xl leading-[1.05] font-bold tracking-tight uppercase sm:text-6xl lg:text-7xl',
          tone === 'light' ? 'text-ink' : 'text-paper',
        )}
      >
        <SplitWords text={title} wordClassName={selected ? 'bg-pink text-paper' : undefined} />
      </h2>
    </header>
  )
}
