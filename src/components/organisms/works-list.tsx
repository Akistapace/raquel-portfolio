import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'
import { SectionHeading } from '@/components/molecules/section-heading'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { CyclingMedia } from '@/components/organisms/works-list-media'
import { useWordReveal } from '@/hooks/use-word-reveal'
import { lenis } from '@/hooks/use-lenis'

gsap.registerPlugin(ScrollTrigger)

type WorksListProps = {
  /** chamado ao clicar num item — a seção de materiais abre já filtrada nele */
  onSelectProject: (projectId?: string) => void
}

/**
 * Lista editorial de projetos (estilo Dogstudio): títulos gigantes em serifa,
 * a linha ativa (hover no desktop, cruzando o centro no scroll) fica em
 * destaque e as outras esmaecem. No mobile, a mídia aparece inline.
 */
export function WorksList({ onSelectProject }: WorksListProps) {
  const scope = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const hoveringRef = useRef(false)
  const scrollActiveRef = useRef<number | null>(null)
  useWordReveal(scope)

  const selectAndScroll = (projectId?: string) => {
    onSelectProject(projectId)
    if (lenis) {
      // o pin da seção de materiais tem seu próprio scroll-spacer; pular
      // direto pra lá com o lenis.scrollTo às vezes deixa o ScrollTrigger
      // dessincronizado da posição real (a animação do círculo trava).
      // Recalcular tudo ao terminar o scroll resolve.
      lenis.scrollTo('#servicos', { duration: 1.4, onComplete: () => ScrollTrigger.refresh() })
    } else {
      document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

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

  // âncoras de scroll: a linha que cruza o centro da tela vira a ativa —
  // sem depender do mouse. Hover tem prioridade sobre isso.
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    if (!window.matchMedia('(min-width: 64rem) and (pointer: fine)').matches) return

    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: el.querySelector('.work-rows'),
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          if (!self.isActive) {
            hoveringRef.current = false
            scrollActiveRef.current = null
            setActive(null)
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
              if (!hoveringRef.current) setActive(i)
            } else if (scrollActiveRef.current === i) {
              scrollActiveRef.current = null
              if (!hoveringRef.current) setActive(null)
            }
          },
        })
      })
    })
    return () => mm.revert()
  }, [])

  const onRowEnter = (i: number) => {
    hoveringRef.current = true
    setActive(i)
  }
  const onRowLeave = () => {
    hoveringRef.current = false
    setActive(scrollActiveRef.current)
  }

  return (
    <div ref={scope} className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-10 sm:px-10 lg:pt-36 lg:pb-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Serviços" title="O que eu *crio*" />
        <Button variant="outline" size="sm" onClick={() => selectAndScroll()} className="shrink-0">
          Ver todos os materiais
        </Button>
      </div>

      <ul className="work-rows mt-16 border-t border-ink/10">
        {projects.map((project, i) => {
          const hasGallery = project.gallery.length > 1
          const content = (
            <>
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
                <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm text-smoke sm:gap-4">
                  <span>{project.year}</span>
                  <Badge fill={i % 2 === 0 ? 'pink' : 'lavender'}>{project.category}</Badge>
                  {project.platforms?.map((platform) => (
                    <Badge key={platform} fill={i % 2 === 0 ? 'lavender' : 'pink'}>
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="mt-2 max-w-xl text-sm text-smoke">{project.description}</p>
              {hasGallery && (
                <span className="mt-3 inline-flex items-center text-xs font-semibold tracking-[0.2em] text-smoke uppercase transition-colors group-hover:text-pink">
                  Ver materiais ({project.gallery.length})
                </span>
              )}
              {/* mídia inline — só em telas sem cursor fino */}
              <div className="mt-5 aspect-video overflow-hidden rounded-2xl border-2 border-ink lg:hidden">
                <CyclingMedia
                  gallery={project.gallery}
                  active
                  alt={`${project.title} (${project.category})`}
                  hue={project.hue}
                  label={project.title}
                />
              </div>
            </>
          )

          return (
            <li key={project.id} className="work-row border-b border-ink/10">
              {hasGallery ? (
                <button
                  type="button"
                  className="group block w-full py-8 text-left"
                  onMouseEnter={() => onRowEnter(i)}
                  onMouseLeave={onRowLeave}
                  onClick={() => selectAndScroll(project.id)}
                >
                  {content}
                </button>
              ) : (
                <a
                  href="#contato"
                  className="group block py-8"
                  onMouseEnter={() => onRowEnter(i)}
                  onMouseLeave={onRowLeave}
                >
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
