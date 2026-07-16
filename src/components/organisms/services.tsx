import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '@/data/portfolio'
import { SectionHeading } from '@/components/molecules/section-heading'

import { useWordReveal } from '@/hooks/use-word-reveal'

gsap.registerPlugin(ScrollTrigger)

/** Faixa gigante em serifa vazada que anda com o scroll (velocity strip). */
function ScrollStrip() {
  const stripRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const mm = gsap.matchMedia(strip)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        strip,
        { xPercent: 4 },
        {
          xPercent: -24,
          ease: 'none',
          scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      )
    })
    return () => mm.revert()
  }, [])

  const word = 'criatividade · estratégia · estética · '
  return (
    <div aria-hidden className="overflow-hidden py-10 select-none">
      <div
        ref={stripRef}
        className="font-display text-[clamp(4rem,10vw,8rem)] leading-none font-bold whitespace-nowrap uppercase"
        style={{
          WebkitTextStroke: '1.5px rgba(20, 20, 20, 0.85)',
          color: 'transparent',
        }}
      >
        {word.repeat(4)}
      </div>
    </div>
  )
}

export function Services() {
  const scope = useRef<HTMLDivElement>(null)
  useWordReveal(scope)

  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el.querySelectorAll('.service-row'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el.querySelector('.service-rows'), start: 'top 80%' },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={scope} className="relative overflow-hidden py-20 lg:py-28">
      <span
        aria-hidden
        className="shape-drift absolute top-16 -right-24 h-24 w-56 rounded-full bg-lavender opacity-70"
      />
      <span
        aria-hidden
        className="shape-drift absolute -bottom-10 -left-16 h-20 w-44 rounded-full border-2 border-ink bg-pink-soft"
      />
      <ScrollStrip />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 sm:px-10">
        <SectionHeading eyebrow="Serviços" title="Como posso *ajudar*" />
        <ul className="service-rows divide-y divide-ink/10 border-y border-ink/10">
          {services.map((service) => (
            <li key={service.name} className="service-row group">
              <div className="flex flex-col gap-2 py-7 transition-transform duration-500 ease-out-expo sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:group-hover:translate-x-3">
                <h3 className="font-display text-4xl font-medium text-ink transition-colors group-hover:text-pink sm:text-5xl">
                  {service.name}
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-smoke sm:text-right">
                  {service.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
