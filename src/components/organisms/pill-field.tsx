import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type PillSpec = {
  /** posição na viewport */
  top: string
  left?: string
  right?: string
  /** tamanho em px (antes da rotação) */
  w: number
  h: number
  /** visual da forma */
  cls: string
  /** parallax de mouse (0 = parado) */
  depth: number
  /** deslocamento com o scroll, em px no fim da página (negativo sobe) */
  drift: number
  rot?: number
  /** atraso da flutuação contínua, pra dessincronizar */
  delay?: number
}

const PILLS: PillSpec[] = [
  // laterais esquerdas — sempre meio pra fora da tela
  { top: '5%', left: '-4.5rem', w: 170, h: 68, cls: 'bg-lavender-soft', depth: 0.05, drift: -240, rot: -18 },
  { top: '28%', left: '-4rem', w: 130, h: 56, cls: 'border-2 border-ink bg-pink', depth: 0.09, drift: -400, rot: 12, delay: 2 },
  { top: '50%', left: '-1.5rem', w: 56, h: 56, cls: 'rounded-full border-2 border-ink bg-paper', depth: 0.12, drift: -170, delay: 4 },
  { top: '70%', left: '-4.5rem', w: 150, h: 60, cls: 'bg-pink-soft', depth: 0.06, drift: -480, rot: -8, delay: 1 },
  { top: '92%', left: '-3rem', w: 110, h: 48, cls: 'border-2 border-ink bg-lavender-soft', depth: 0.1, drift: -320, rot: 20, delay: 3 },
  // laterais direitas — idem
  { top: '10%', right: '-4rem', w: 150, h: 60, cls: 'border-2 border-ink bg-pink-soft', depth: 0.08, drift: -360, rot: 14, delay: 2.5 },
  { top: '34%', right: '-1rem', w: 44, h: 44, cls: 'rounded-full bg-pink', depth: 0.13, drift: -210, delay: 0.5 },
  { top: '56%', right: '-5rem', w: 180, h: 70, cls: 'bg-lavender-soft', depth: 0.05, drift: -440, rot: -14, delay: 3.5 },
  { top: '76%', right: '-3.5rem', w: 120, h: 52, cls: 'border-2 border-ink bg-lavender', depth: 0.1, drift: -280, rot: 8, delay: 1.5 },
  { top: '95%', right: '-4rem', w: 140, h: 56, cls: 'bg-pink-soft', depth: 0.07, drift: -520, rot: -22, delay: 4.5 },
]

type PillFieldProps = {
  /** entra em cena quando o preloader termina */
  ready: boolean
}

/**
 * Fundo vivo: pílulas e círculos sticker fixos nas laterais, com flutuação
 * contínua, parallax de scroll (cada um numa velocidade) e parallax de mouse.
 */
export function PillField({ ready }: PillFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  // parallax de scroll + mouse
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const pills = root.querySelectorAll<HTMLElement>('.pill-item')

      pills.forEach((pill) => {
        gsap.to(pill, {
          y: Number(pill.dataset.drift),
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'max',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        })
      })

      if (window.matchMedia('(pointer: fine)').matches) {
        const setters = Array.from(pills).map((pill) => ({
          depth: Number(pill.dataset.depth),
          x: gsap.quickTo(pill, 'x', { duration: 1, ease: 'power3' }),
        }))
        const onMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2
          for (const s of setters) s.x(nx * s.depth * 80)
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
      }
    })
    return () => mm.revert()
  }, [])

  // entrada elástica depois do preloader
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !ready) return

    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        root.querySelectorAll('.pill-pop'),
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.07 },
      )
    })
    return () => mm.revert()
  }, [ready])

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PILLS.map((pill, i) => (
        <div
          key={i}
          className="pill-item absolute"
          data-depth={pill.depth}
          data-drift={pill.drift}
          style={{ top: pill.top, left: pill.left, right: pill.right }}
        >
          <div className="pill-pop" style={ready ? undefined : { opacity: 0 }}>
            <div
              className="shape-drift"
              style={{ animationDelay: `${pill.delay ?? 0}s`, animationDuration: `${10 + (i % 5) * 3}s` }}
            >
              <div
                className={cn('rounded-full', pill.cls)}
                style={{ width: pill.w, height: pill.h, transform: `rotate(${pill.rot ?? 0}deg)` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
