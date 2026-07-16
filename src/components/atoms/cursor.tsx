import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Cursor customizado: ponto que segue o mouse + anel com atraso.
 * Cresce sobre links/botões/[data-cursor]. Só em ponteiros finos.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.documentElement.classList.add('custom-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

    let visible = false
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const isTarget = (e: Event) =>
      (e.target as HTMLElement).closest?.('a, button, [data-cursor]') != null

    const onOver = (e: MouseEvent) => {
      if (!isTarget(e)) return
      gsap.to(ring, { scale: 2.2, opacity: 0.55, duration: 0.35, ease: 'power3' })
      gsap.to(dot, { scale: 0.4, duration: 0.35, ease: 'power3' })
    }
    const onOut = (e: MouseEvent) => {
      if (!isTarget(e)) return
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3' })
      gsap.to(dot, { scale: 1, duration: 0.35, ease: 'power3' })
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-110 hidden in-[.custom-cursor]:block">
      <div
        ref={ringRef}
        className="invisible fixed top-0 left-0 -mt-5 -ml-5 h-10 w-10 rounded-full border-2 border-ink/70 opacity-0"
      />
      <div
        ref={dotRef}
        className="invisible fixed top-0 left-0 -mt-1 -ml-1 h-2 w-2 rounded-full bg-pink opacity-0"
      />
    </div>
  )
}
