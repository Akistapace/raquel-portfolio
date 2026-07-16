import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '@/data/portfolio'
import { lenis } from '@/hooks/use-lenis'

type PreloaderProps = {
  onDone: () => void
}

/** Abertura: "PORTFÓLIO" em serifa caixa-alta + contador em pílula rosa. */
export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.display = 'none'
      doneRef.current()
      return
    }

    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'

    const counterEl = root.querySelector('.pre-counter') as HTMLElement
    const counter = { v: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        root.style.display = 'none'
        document.documentElement.style.overflow = ''
        lenis?.start()
      },
    })

    tl.fromTo(
      root.querySelectorAll('.pre-word .split-word'),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
    )
      .fromTo(
        root.querySelector('.pre-pill'),
        { scale: 0, rotate: -8 },
        { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' },
        0.3,
      )
      .to(
        counter,
        {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            counterEl.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        },
        0.4,
      )
      .to(root.querySelector('.pre-inner'), { opacity: 0, y: -30, duration: 0.45, ease: 'power2.in' })
      .to(
        root,
        {
          yPercent: -100,
          duration: 0.9,
          ease: 'expo.inOut',
          // o reveal do hero começa junto com a subida da cortina — sincronizado
          onStart: () => doneRef.current(),
        },
        '-=0.1',
      )

    return () => {
      tl.kill()
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div ref={rootRef} className="fixed inset-0 z-120 flex items-center justify-center bg-paper">
      <div className="pre-inner flex flex-col items-center gap-8">
        <p className="pre-word font-display text-5xl font-bold tracking-tight text-ink uppercase sm:text-8xl">
          <span className="line-mask">
            <span className="split-word">Portfólio</span>
          </span>
        </p>
        <p className="pre-pill flex items-center gap-3 rounded-full border-2 border-ink bg-pink px-6 py-2.5 text-xs font-semibold tracking-[0.3em] text-ink uppercase">
          <span className="pre-counter font-display text-base font-bold">000</span>
          {profile.name}
        </p>
      </div>
    </div>
  )
}
