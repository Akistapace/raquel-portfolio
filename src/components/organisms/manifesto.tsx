import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '@/data/portfolio'
import { Badge } from '@/components/atoms/badge'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'
import { Marquee } from '@/components/molecules/marquee'
import { SectionHeading } from '@/components/molecules/section-heading'
import { useWordReveal } from '@/hooks/use-word-reveal'

gsap.registerPlugin(ScrollTrigger)

/**
 * Sobre: apresentação com o texto-manifesto revelado palavra por palavra
 * no scrub do scroll, fatos rápidos ao lado do retrato e experiência.
 */
export function Manifesto() {
  const scope = useRef<HTMLDivElement>(null)
  useWordReveal(scope)

  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el.querySelectorAll('.scrub-word'),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: el.querySelector('.scrub-block'), start: 'top 75%', end: 'bottom 45%', scrub: true },
        },
      )
      const portrait = el.querySelector('.manifesto-portrait')
      const portraitImg = el.querySelector('.manifesto-portrait-img')

      gsap.fromTo(
        portrait,
        { yPercent: 10 },
        {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )

      // reveal bruto como na hero: a foto sobe de dentro da máscara
      // (yPercent 120 → 0 com leve rotação, expo.out)
      gsap.fromTo(
        portraitImg,
        { yPercent: 120, rotate: 6 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: portrait, start: 'top 80%' },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={scope} className="relative">
      <Marquee items={profile.skills} />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 pt-24 pb-14 sm:px-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <SectionHeading eyebrow="Sobre mim" title="Hello!! Sou a Raquel" selected />
          <p
            aria-label={profile.about}
            className="scrub-block font-display text-2xl leading-snug font-medium text-ink sm:text-3xl lg:text-4xl"
          >
            {profile.about.split(' ').map((word, i) => (
              <span key={i} aria-hidden className="scrub-word inline-block">
                {word}&nbsp;
              </span>
            ))}
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Habilidades">
            {profile.skills.map((skill, i) => (
              <li key={skill}>
                <Badge fill={i % 2 === 0 ? 'pink' : 'lavender'}>{skill}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-105">
          <div className="manifesto-portrait w-full overflow-hidden rounded-b-full">
            <PlaceholderMedia
              src={profile.portrait}
              alt={`Retrato de ${profile.name}`}
              hue="#CDBFEA"
              label={profile.name}
              className="manifesto-portrait-img h-auto"
            />
          </div>
          <ul className="mt-8 space-y-2 text-sm text-smoke">
            {profile.facts.map((fact) => (
              <li key={fact} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-pink" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* experiência */}
      <div className="mx-auto w-full max-w-7xl px-6 pb-28 sm:px-10">
        <div className="rounded-[2.5rem] border-2 border-ink bg-lavender-soft/60 p-8 sm:p-12">
          <span className="inline-flex items-center rounded-full border-2 border-ink bg-paper px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Experiência
          </span>
          <p className="mt-6 max-w-4xl text-base leading-relaxed text-ink/80 sm:text-lg">
            {profile.experience}
          </p>
        </div>
      </div>
    </div>
  )
}
