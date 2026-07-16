import { useLayoutEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Instância global — usada por navbar (scrollTo) e preloader (stop/start). */
export let lenis: Lenis | null = null

/** Scroll suave com inércia, sincronizado com o ScrollTrigger. */
export function useLenis() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}
