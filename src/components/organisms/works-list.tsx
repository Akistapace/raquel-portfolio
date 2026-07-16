import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'
import { SectionHeading } from '@/components/molecules/section-heading'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'
import { Badge } from '@/components/atoms/badge'
import { useWordReveal } from '@/hooks/use-word-reveal'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lista editorial de projetos (estilo Dogstudio): títulos gigantes em serifa;
 * no desktop, um preview flutuante segue o cursor sobre o item ativo.
 * No mobile, a mídia aparece inline em cada item.
 */
export function WorksList() {
  const scope = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const hoveringRef = useRef(false)
  const scrollActiveRef = useRef<number | null>(null)
  const moveRef = useRef<{
    xTo: (v: number) => void
    yTo: (v: number) => void
    rTo: (v: number) => void
  } | null>(null)
  useWordReveal(scope)

  // move o preview até um ponto fixo, ancorado na linha ativa (modo scroll)
  const anchorPreviewTo = (i: number) => {
    const row = scope.current?.querySelectorAll<HTMLElement>('.work-row')[i]
    const move = moveRef.current
    if (!row || !move) return
    const rect = row.getBoundingClientRect()
    move.xTo(window.innerWidth * 0.72)
    move.yTo(gsap.utils.clamp(180, window.innerHeight - 160, rect.top + rect.height / 2))
    move.rTo(0)
  }

  // preview segue o cursor durante o hover
  useLayoutEffect(() => {
    const el = scope.current
    const preview = previewRef.current
    if (!el || !preview) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.85, opacity: 0 })
      const xTo = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3' })
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3' })
      const rTo = gsap.quickTo(preview, 'rotate', { duration: 0.7, ease: 'power3' })
      moveRef.current = { xTo, yTo, rTo }
      let lastX = 0
      const onMove = (e: MouseEvent) => {
        if (!hoveringRef.current) return
        xTo(e.clientX)
        yTo(e.clientY)
        rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6))
        lastX = e.clientX
      }
      el.addEventListener('mousemove', onMove)
      return () => {
        el.removeEventListener('mousemove', onMove)
        moveRef.current = null
      }
    })
    return () => mm.revert()
  }, [])

  // entrada dos itens da lista
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      el.querySelectorAll('.work-row').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    })
    return () => mm.revert()
  }, [])

  const showPreview = (i: number) => {
    setActive(i)
    if (previewRef.current) {
      gsap.to(previewRef.current, { scale: 1, opacity: 1, duration: 0.45, ease: 'expo.out' })
    }
  }
  const hidePreview = () => {
    setActive(null)
    if (previewRef.current) {
      gsap.to(previewRef.current, { scale: 0.85, opacity: 0, duration: 0.35, ease: 'power2.in' })
    }
  }

  // âncoras de scroll: a linha que cruza o centro da tela vira o item ativo,
  // com o preview ancorado nela — sem depender do mouse. Hover tem prioridade.
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    if (!window.matchMedia('(min-width: 64rem) and (pointer: fine)').matches) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // fora da seção de projetos o preview nunca fica visível — mata inclusive
      // o hover "preso" (scroll sem mover o mouse não dispara mouseleave)
      ScrollTrigger.create({
        trigger: el.querySelector('.work-rows'),
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          if (!self.isActive) {
            hoveringRef.current = false
            scrollActiveRef.current = null
            hidePreview()
          }
        },
      })

      el.querySelectorAll<HTMLElement>('.work-row').forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          end: 'bottom 38%',
          onToggle: (self) => {
            if (self.isActive) {
              scrollActiveRef.current = i
              if (!hoveringRef.current) {
                anchorPreviewTo(i)
                showPreview(i)
              }
            } else if (scrollActiveRef.current === i) {
              scrollActiveRef.current = null
              if (!hoveringRef.current) hidePreview()
            }
          },
        })
      })
    })
    return () => mm.revert()
  }, [])

  const onRowEnter = (i: number) => {
    hoveringRef.current = true
    showPreview(i)
  }
  const onRowLeave = () => {
    hoveringRef.current = false
    const s = scrollActiveRef.current
    if (s !== null) {
      anchorPreviewTo(s)
      showPreview(s)
    } else {
      hidePreview()
    }
  }

  return (
    <div ref={scope} className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 lg:py-36">
      <SectionHeading eyebrow="Projetos" title="O que eu *crio*" />

      <ul className="work-rows mt-16 border-t border-ink/10">
        {projects.map((project, i) => (
          <li key={project.id} className="work-row border-b border-ink/10">
            <a
              href="#contato"
              className="group block py-8"
              onMouseEnter={() => onRowEnter(i)}
              onMouseLeave={onRowLeave}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <h3
                  className={`font-display text-4xl leading-none font-bold tracking-tight uppercase transition-all duration-500 ease-out-expo sm:text-6xl lg:text-7xl ${
                    active === null || active === i
                      ? 'text-ink'
                      : 'text-ink/25'
                  } group-hover:translate-x-4 group-hover:italic group-hover:text-pink`}
                >
                  {project.title}
                </h3>
                <div className="flex shrink-0 items-center gap-4 text-sm text-smoke">
                  <span>{project.year}</span>
                  <Badge fill={i % 2 === 0 ? 'pink' : 'lavender'}>{project.category}</Badge>
                </div>
              </div>
              <p className="mt-2 max-w-xl text-sm text-smoke">{project.description}</p>
              {/* mídia inline — só em telas sem cursor fino */}
              <div className="mt-5 aspect-video overflow-hidden rounded-2xl border-2 border-ink lg:hidden">
                {project.video ? (
                  <video
                    src={project.video}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderMedia
                    src={project.image}
                    alt={`${project.title} (${project.category})`}
                    hue={project.hue}
                    label={project.title}
                  />
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* preview flutuante que segue o cursor (desktop) */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-64 w-88 overflow-hidden rounded-[3rem] border-2 border-ink opacity-0 shadow-[0_30px_80px_-20px_rgba(20,20,20,0.35)] lg:block"
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            className={`absolute inset-0 transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-0'}`}
          >
            {project.video ? (
              <video
                src={project.video}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <PlaceholderMedia src={project.image} alt="" hue={project.hue} label={project.title} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
