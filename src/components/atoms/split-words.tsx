import { cn } from '@/lib/utils'

type SplitWordsProps = {
  /** texto a quebrar; palavras entre *asteriscos* ganham destaque rosa itálico */
  text: string
  className?: string
  /** classe aplicada a cada palavra interna, alvo dos tweens GSAP (`.split-word`) */
  wordClassName?: string
}

/**
 * Quebra o texto em palavras mascaradas (overflow hidden) para reveals de
 * "subir da linha" com GSAP. Alvo: `.split-word`.
 * Destaque: "O que eu *crio*" deixa "crio" rosa itálico, como no hero.
 */
export function SplitWords({ text, className, wordClassName }: SplitWordsProps) {
  const plain = text.replaceAll('*', '')
  return (
    <span className={className} aria-label={plain} role="text">
      {text.split(' ').map((word, i) => {
        const accent = word.includes('*')
        const shown = word.replaceAll('*', '')
        return (
          <span key={i} aria-hidden className="line-mask">
            <span className={cn('split-word', accent && 'text-pink italic', wordClassName)}>
              {shown}&nbsp;
            </span>
          </span>
        )
      })}
    </span>
  )
}
