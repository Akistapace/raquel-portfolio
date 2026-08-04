import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Project } from '@/data/portfolio'
import { lenis } from '@/hooks/use-lenis'
import { Eyebrow } from '@/components/atoms/eyebrow'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'
import { cn } from '@/lib/utils'

type MediaGalleryModalProps = {
  projects: Project[]
  /** id do projeto pra abrir já filtrado; undefined = aba "Todos" */
  initialProjectId?: string
  /** ponto da tela onde o botão foi clicado — de onde o círculo nasce */
  origin: { x: number; y: number }
  onClose: () => void
}

const ALL_TAB = 'todos'

/** raio (px) suficiente pro círculo cobrir a tela inteira a partir do ponto de origem */
function coverRadius(x: number, y: number) {
  const w = window.innerWidth
  const h = window.innerHeight
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
}

/**
 * Portal em tela cheia (mesma vibe escura do rodapé/Contato): abre com um
 * círculo que nasce no botão clicado e preenche a tela; fecha do mesmo jeito
 * ao contrário.
 */
export function MediaGalleryModal({ projects, initialProjectId, origin, onClose }: MediaGalleryModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState(initialProjectId ?? ALL_TAB)
  const [focused, setFocused] = useState<{ projectId: string; index: number } | null>(null)
  const [closing, setClosing] = useState(false)

  useLayoutEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.body.style.overflow = prevOverflow
      lenis?.start()
    }
  }, [])

  useLayoutEffect(() => {
    const el = panelRef.current
    if (!el) return
    const radius = coverRadius(origin.x, origin.y)
    const from = `circle(0px at ${origin.x}px ${origin.y}px)`
    const to = `circle(${radius}px at ${origin.x}px ${origin.y}px)`

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { clipPath: to })
      return
    }
    gsap.fromTo(el, { clipPath: from }, { clipPath: to, duration: 0.9, ease: 'power3.out' })
  }, [origin.x, origin.y])

  const handleClose = () => {
    const el = panelRef.current
    if (closing) return
    setClosing(true)
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose()
      return
    }
    const radius = coverRadius(origin.x, origin.y)
    gsap.to(el, {
      clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
      duration: 0.6,
      ease: 'power3.in',
      onComplete: onClose,
    })
    void radius
  }

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (focused) setFocused(null)
      else handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused])

  const visibleProjects = tab === ALL_TAB ? projects : projects.filter((p) => p.id === tab)
  const focusedProject = focused ? projects.find((p) => p.id === focused.projectId) : undefined
  const focusedMedia = focusedProject && focused ? focusedProject.gallery[focused.index] : undefined

  const moveFocused = (dir: 1 | -1) => {
    if (!focused || !focusedProject) return
    const len = focusedProject.gallery.length
    setFocused({ projectId: focused.projectId, index: (focused.index + dir + len) % len })
  }

  return createPortal(
    <div ref={panelRef} className="fixed inset-0 z-80 flex flex-col overflow-y-auto bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-10 pb-16 sm:px-10">
        <div className="flex items-start justify-between gap-6">
          <Eyebrow tone="dark">Materiais</Eyebrow>
          <button
            type="button"
            aria-label="Fechar"
            onClick={handleClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-paper transition-colors hover:bg-pink hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <nav
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-paper/10 pb-6 text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm"
          aria-label="Filtrar por projeto"
        >
          <button
            type="button"
            onClick={() => setTab(ALL_TAB)}
            className={cn(
              'transition-colors',
              tab === ALL_TAB ? 'text-pink' : 'text-paper/50 hover:text-paper',
            )}
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

        {focusedProject && focusedMedia ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
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
    </div>,
    document.body,
  )
}
