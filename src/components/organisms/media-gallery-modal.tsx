import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Project } from '@/data/portfolio'
import { lenis } from '@/hooks/use-lenis'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'
import { cn } from '@/lib/utils'

type MediaGalleryModalProps = {
  projects: Project[]
  /** id do projeto pra abrir já filtrado; undefined = aba "Todos" */
  initialProjectId?: string
  onClose: () => void
}

const ALL_TAB = 'todos'

/** Modal full-screen com todas as mídias dos projetos: abas por projeto, grid e view focado. */
export function MediaGalleryModal({ projects, initialProjectId, onClose }: MediaGalleryModalProps) {
  const [tab, setTab] = useState(initialProjectId ?? ALL_TAB)
  const [focused, setFocused] = useState<{ projectId: string; index: number } | null>(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.body.style.overflow = prevOverflow
      lenis?.start()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (focused) setFocused(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused, onClose])

  const visibleProjects = tab === ALL_TAB ? projects : projects.filter((p) => p.id === tab)
  const focusedProject = focused ? projects.find((p) => p.id === focused.projectId) : undefined
  const focusedMedia = focusedProject && focused ? focusedProject.gallery[focused.index] : undefined

  const moveFocused = (dir: 1 | -1) => {
    if (!focused || !focusedProject) return
    const len = focusedProject.gallery.length
    setFocused({ projectId: focused.projectId, index: (focused.index + dir + len) % len })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-paper"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper transition-colors hover:bg-pink"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="flex gap-2 overflow-x-auto border-b border-ink/10 px-6 pt-6 pb-4 sm:px-8">
          <button
            type="button"
            onClick={() => setTab(ALL_TAB)}
            className={cn(
              'shrink-0 rounded-full border-2 border-ink px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors',
              tab === ALL_TAB ? 'bg-ink text-paper' : 'text-ink hover:bg-pink-soft',
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
                'shrink-0 rounded-full border-2 border-ink px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors',
                tab === project.id ? 'bg-ink text-paper' : 'text-ink hover:bg-pink-soft',
              )}
            >
              {project.title}
            </button>
          ))}
        </div>

        {focusedProject && focusedMedia ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-6 sm:p-8">
            <div className="relative flex aspect-video w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl border-2 border-ink bg-ink/5">
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
                    className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper hover:bg-pink-soft"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Próximo"
                    onClick={() => moveFocused(1)}
                    className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper hover:bg-pink-soft"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFocused(null)}
              className="text-xs font-semibold tracking-[0.2em] text-smoke uppercase hover:text-pink"
            >
              ← voltar pra grade
            </button>
          </div>
        ) : (
          <div className="flex-1 space-y-8 overflow-y-auto p-6 sm:p-8">
            {visibleProjects.map((project) => (
              <div key={project.id}>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink uppercase">
                  {project.title}
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {project.gallery.map((media, i) => (
                    <button
                      key={media.src}
                      type="button"
                      onClick={() => setFocused({ projectId: project.id, index: i })}
                      className="aspect-video overflow-hidden rounded-xl border border-ink/10 transition-opacity hover:opacity-80"
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
