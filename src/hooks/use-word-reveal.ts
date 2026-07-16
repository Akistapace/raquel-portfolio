import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Revela `.split-word` (ver <SplitWords/>) subindo da linha quando a seção
 * entra na viewport. Respeita prefers-reduced-motion.
 */
export function useWordReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el.querySelectorAll('.split-word'),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 70%' },
        },
      )
    })
    return () => mm.revert()
  }, [scope])
}
