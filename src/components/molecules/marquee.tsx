import { Fragment } from 'react'
import { ArrowUpRight } from 'lucide-react'

type MarqueeProps = {
  items: string[]
}

/** Faixa infinita — o conteúdo é duplicado para o loop ser contínuo. */
export function Marquee({ items }: MarqueeProps) {
  const strip = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex items-center">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="px-6 font-display text-xl font-bold text-ink uppercase sm:text-2xl">
            {item}
          </span>
          <ArrowUpRight aria-hidden className="h-6 w-6 text-pink" strokeWidth={2.5} />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className="overflow-hidden border-y-2 border-ink bg-lavender-soft py-4">
      <div className="marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  )
}
