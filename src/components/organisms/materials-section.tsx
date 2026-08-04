import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '@/data/portfolio'
import { SectionHeading } from '@/components/molecules/section-heading'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type MaterialsSectionProps = {
  /** projeto pra abrir já filtrado — setado ao clicar num item de "O que eu crio" */
  activeProjectId?: string
}

const ALL_TAB = 'todos'

/**
 * Seção escura (mesma vibe do rodapé/Contato, logo em seguida): abre com um
 * círculo que cresce junto com o scroll, revelando a galeria de materiais.
 */
export function MaterialsSection({ activeProjectId }: MaterialsSectionProps) {
  const scope = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState(activeProjectId ?? ALL_TAB)
  const [focused, setFocused] = useState<{ projectId: string; index: number } | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (activeProjectId) setTab(activeProjectId)
  }, [activeProjectId])

  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(150% at 50% 50%)',
          ease: 'none',
          // fica em branco (clipado) até o topo da seção chegar no meio da
          // tela — aí o círculo cresce e termina pouco depois. Usa o topo (não
          // o centro) do trigger pra não depender da altura do conteúdo, que
          // varia com a aba selecionada.
          scrollTrigger: { trigger: el, start: 'top center', end: 'top 15%', scrub: true },
        },
      )
    })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => setRevealed(true),
    })
    return () => mm.revert()
  }, [])

  const visibleProjects = tab === ALL_TAB ? projects : projects.filter((p) => p.id === tab)
  const focusedProject = focused ? projects.find((p) => p.id === focused.projectId) : undefined
  const focusedMedia = focusedProject && focused ? focusedProject.gallery[focused.index] : undefined

  const moveFocused = (dir: 1 | -1) => {
    if (!focused || !focusedProject) return
    const len = focusedProject.gallery.length
    setFocused({ projectId: focused.projectId, index: (focused.index + dir + len) % len })
  }

  return (
    <div ref={scope} className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 lg:py-36">
        <SectionHeading eyebrow="Serviços" title="Como posso *ajudar*" tone="dark" />

        <nav
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-paper/10 pb-6 text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm"
          aria-label="Filtrar por projeto"
        >
          <button
            type="button"
            onClick={() => setTab(ALL_TAB)}
            className={cn('transition-colors', tab === ALL_TAB ? 'text-pink' : 'text-paper/50 hover:text-paper')}
          >
            Todos
          </button>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setTab(project.id)}
              className={cn(
                'transition-colors',
                tab === project.id ? 'text-pink' : 'text-paper/50 hover:text-paper',
              )}
            >
              {project.title}
            </button>
          ))}
        </nav>

        {!revealed ? null : focusedProject && focusedMedia ? (
          <div className="flex flex-col items-center justify-center gap-6 py-10">
            <div className="relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-4xl border-2 border-paper/30 bg-paper/5">
              {focusedMedia.type === 'video' ? (
                <video
                  key={focusedMedia.src}
                  src={focusedMedia.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <PlaceholderMedia
                  src={focusedMedia.src}
                  alt={focusedProject.title}
                  hue={focusedProject.hue}
                  label={focusedProject.title}
                  className="object-contain"
                />
              )}
              {focusedProject.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Anterior"
                    onClick={() => moveFocused(-1)}
                    className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper bg-ink/60 hover:bg-pink hover:text-ink"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Próximo"
                    onClick={() => moveFocused(1)}
                    className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper bg-ink/60 hover:bg-pink hover:text-ink"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFocused(null)}
              className="text-xs font-semibold tracking-[0.2em] text-paper/60 uppercase transition-colors hover:text-pink-soft"
            >
              ← voltar pra grade
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-16">
            {visibleProjects.map((project) => (
              <div key={project.id}>
                <h3 className="font-display text-3xl font-bold tracking-tight uppercase sm:text-4xl">
                  {project.title}
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.gallery.map((media, i) => (
                    <button
                      key={media.src}
                      type="button"
                      onClick={() => setFocused({ projectId: project.id, index: i })}
                      className="group relative aspect-video overflow-hidden rounded-2xl border-2 border-paper/15 transition-colors hover:border-pink"
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <PlaceholderMedia src={media.src} alt={project.title} hue={project.hue} label={project.title} />
                      )}
                      <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/30 group-hover:opacity-100"
                      >
                        <ArrowUpRight className="h-8 w-8 text-paper" strokeWidth={2.5} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
