import { profile } from '@/data/portfolio'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

type HeroProps = {
  /** dispara a entrada quando o preloader termina */
  ready: boolean
}

/**
 * Collage sticker: nome gigante em serifa caixa-alta cercado de pílulas,
 * círculo com seta e seta ↗ — cada forma numa profundidade de parallax.
 */
export function Hero({ ready }: HeroProps) {
  const scope = useRef<HTMLDivElement>(null)

  // estado inicial escondido JÁ na montagem — evita flash de conteúdo
  // estático enquanto a cortina do preloader ainda está subindo
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(el.querySelectorAll('.hero-letter'), { yPercent: 120, rotate: 6 })
    gsap.set(el.querySelectorAll('.hero-sticker'), { opacity: 0, scale: 0, rotate: -12 })
    gsap.set(el.querySelectorAll('.hero-fade'), { opacity: 0, y: 24 })
  }, [])

  // camadas com profundidade reagem ao mouse
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const layers = el.querySelectorAll<HTMLElement>('[data-depth]')
      const setters = Array.from(layers).map((layer) => ({
        depth: Number(layer.dataset.depth),
        x: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3' }),
        y: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3' }),
      }))
      const onMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        for (const s of setters) {
          s.x(nx * s.depth * 60)
          s.y(ny * s.depth * 40)
        }
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    })
    return () => mm.revert()
  }, [])

  // entrada após o preloader + saída com parallax de scroll
  useLayoutEffect(() => {
    const el = scope.current
    if (!el || !ready) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(el.querySelectorAll('.hero-letter'), {
        yPercent: 0,
        rotate: 0,
        duration: 1.2,
        stagger: 0.05,
      })
        .to(
          el.querySelectorAll('.hero-sticker'),
          { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.09 },
          0.5,
        )
        .to(
          el.querySelectorAll('.hero-fade'),
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          0.85,
        )

      // o conteúdo sobe mais devagar que o scroll ao sair (profundidade)
      gsap.to(el.querySelector('.hero-stage'), {
        yPercent: 18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [ready])

  return (
    <div
      ref={scope}
      className="relative flex h-svh flex-col justify-between overflow-hidden px-6 pt-24 pb-8 sm:px-10"
    >
      <div className="hero-stage relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center text-center">
        <p
          className="hero-fade mb-6 text-xs font-semibold tracking-[0.35em] text-smoke uppercase"
          data-depth="0.4"
        >
          Portfólio {new Date().getFullYear()}
        </p>

        <h1
          aria-label={profile.name}
          data-depth="0.2"
          className="font-display text-[clamp(4rem,15vw,11rem)] leading-[0.95] font-bold tracking-tight text-ink uppercase"
        >
          {/* só o primeiro nome no display gigante */}
          {profile.name.split(' ')[0].split('').map((letter, i) => (
            <span key={i} aria-hidden className="line-mask">
              <span className={`hero-letter ${(i === 0 || i === 3 ) ? 'text-pink italic' : ''}`}>{letter}</span>
            </span>
          ))}
        </h1>

        {/* pílula do papel profissional abaixo do nome */}
        <div className="mt-8" data-depth="0.7">
          <span className="hero-sticker inline-flex h-14 items-center rounded-full border-2 border-ink bg-pink px-6 text-xs font-semibold tracking-[0.2em] text-ink uppercase sm:h-16 sm:px-9 sm:text-sm">
            {profile.role}
          </span>
        </div>

        <p className="hero-fade mt-10 max-w-md font-display text-xl text-smoke italic sm:text-2xl">
          {profile.tagline}
        </p>

      </div>

      <div className="hero-fade relative mx-auto flex w-full max-w-7xl items-center justify-between text-xs font-semibold tracking-[0.25em] text-smoke uppercase">
        <span>Disponível para projetos</span>
        <span aria-hidden className="flex items-center gap-2">
          role para explorar
          <ArrowDown className="h-4 w-4 animate-bounce text-pink" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  )
}
