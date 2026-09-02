import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import { projects } from '@/data/portfolio'
import { SectionHeading } from '@/components/molecules/section-heading'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'
import { lenis } from '@/hooks/use-lenis'
import { cn } from '@/lib/utils'
import { mediaCoverSrc, mediaExternalUrl, mediaKey } from '@/lib/media'

gsap.registerPlugin(ScrollTrigger)

const ALL_TAB = 'todos'

/** Imagem do lightbox no tamanho real (sem crop) — cai pro placeholder chapado
 * se o asset ainda não existir, num box com proporção de post (4:5). */
function LightboxImage({ src, alt, hue, label }: { src?: string; alt: string; hue?: string; label?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className="aspect-4/5 h-[70vh] max-h-[85vh]">
        <PlaceholderMedia alt={alt} hue={hue} label={label} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-auto max-h-[85vh] w-auto max-w-[95vw] rounded-[inherit]"
    />
  )
}

/**
 * Transição presa no scroll (pin, uma tela de altura), em 2 passos: 1) um
 * ponto preto sobe de baixo da tela até parar no centro; 2) só aí ele abre
 * (cresce) até cobrir tudo, enquanto a própria seção de materiais (presa a
 * uma tela de altura, cortada) ganha scale junto — os dois terminam 100%
 * juntos, e só nesse instante o pin solta o scroll (a seção volta a ter
 * altura normal, rolável). Scrollando pra cima roda ao contrário sozinho,
 * porque é um scrub. Sempre abre na aba "Todos" — filtrar já entrando
 * causava conteúdo de altura diferente e quebrava a transição.
 */
export function MaterialsSection() {
  const pinRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const contentInnerRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState(ALL_TAB)
  const [focused, setFocused] = useState<{ projectId: string; index: number; subIndex: number } | null>(null)
  const [revealed, setRevealed] = useState(false)

  useLayoutEffect(() => {
    const pin = pinRef.current
    const circle = circleRef.current
    const content = contentRef.current
    const inner = contentInnerRef.current
    if (!pin || !circle || !content || !inner) return

    const mm = gsap.matchMedia(pin)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const diameter = Math.hypot(window.innerWidth, window.innerHeight)
      const dotSize = 90
      const riseFrom = window.innerHeight * 0.35
      // xPercent/yPercent (não a classe CSS -translate-1/2) porque recalculam
      // a cada frame com base no tamanho atual — width/height animam, então
      // um translate percentual "congelado" pelo GSAP descentralizaria o
      // círculo conforme ele cresce.
      gsap.set(circle, { xPercent: -50, yPercent: -50, width: dotSize, height: dotSize, y: riseFrom })
      // enquanto presa (h-svh + overflow-hidden), a seção só mostra o topo
      // (título/abas) numa tela só, crescendo em scale a partir daí — evita
      // qualquer pedaço do conteúdo (que é bem mais alto que uma tela)
      // aparecer fora do círculo antes da hora.
      gsap.set(inner, { scale: 0.001, opacity: 0, transformOrigin: 'top center' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.3}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onLeave: () => gsap.set(content, { height: 'auto', overflow: 'visible' }),
          onEnterBack: () => gsap.set(content, { height: '100svh', overflow: 'hidden' }),
        },
      })
      // sobe até o centro, depois abre — e a seção ganha scale junto, os
      // dois terminando 100% exatamente quando o pin solta
      tl.to(circle, { y: 0, ease: 'none', duration: 0.45 })
        .to(circle, { width: diameter, height: diameter, ease: 'none', duration: 0.55 })
        .to(inner, { scale: 1, ease: 'none', duration: 0.55 }, '<')
        // opacidade fica em 0 até ~90% do total, só aparece nos 10% finais
        .to(inner, { opacity: 1, ease: 'none', duration: 0.1 }, 0.9)
    })
    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return
    ScrollTrigger.create({
      trigger: content,
      start: 'top 90%',
      once: true,
      onEnter: () => setRevealed(true),
    })
  }, [])

  // item aberto vira um modal de verdade (portal + trava scroll) — trocar o
  // conteúdo do grid pelo viewer *dentro* da seção mudava a altura da página
  // no meio do scroll e jogava a viewport pro rodapé.
  useEffect(() => {
    if (!focused) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocused(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [focused])

  const visibleProjects = tab === ALL_TAB ? projects : projects.filter((p) => p.id === tab)
  const focusedProject = focused ? projects.find((p) => p.id === focused.projectId) : undefined
  const focusedMedia = focusedProject && focused ? focusedProject.gallery[focused.index] : undefined
  const focusedImageSrc =
    focusedMedia?.type === 'image'
      ? focusedMedia.src
      : focusedMedia?.type === 'carousel' && focused
        ? focusedMedia.images[focused.subIndex]
        : undefined
  const canNavigate =
    !!focusedProject &&
    (focusedProject.gallery.length > 1 || (focusedMedia?.type === 'carousel' && focusedMedia.images.length > 1))

  const moveFocused = (dir: 1 | -1) => {
    if (!focused || !focusedProject) return
    if (focusedMedia?.type === 'carousel') {
      const nextSub = focused.subIndex + dir
      if (nextSub >= 0 && nextSub < focusedMedia.images.length) {
        setFocused({ ...focused, subIndex: nextSub })
        return
      }
    }
    const len = focusedProject.gallery.length
    // pula itens que abrem link externo (youtube/link) — não têm o que mostrar no lightbox
    let nextIndex = focused.index
    for (let step = 0; step < len; step++) {
      nextIndex = (nextIndex + dir + len) % len
      if (!mediaExternalUrl(focusedProject.gallery[nextIndex])) break
    }
    const nextMedia = focusedProject.gallery[nextIndex]
    const nextSubIndex = nextMedia.type === 'carousel' && dir === -1 ? nextMedia.images.length - 1 : 0
    setFocused({ projectId: focused.projectId, index: nextIndex, subIndex: nextSubIndex })
  }

  return (
    <>
      <div ref={pinRef} className="relative h-svh overflow-hidden bg-paper">
        <div
          ref={circleRef}
          aria-hidden
          className="absolute top-1/2 left-1/2 rounded-full bg-ink"
        />
      </div>

      {/* -mt cancela a altura própria da caixa do pin (h-svh, que sobra parada
          e preta depois que solta) — o conteúdo passa a começar exatamente
          onde o pin solta, sem esse andar extra vazio no meio. h-svh +
          overflow-hidden aqui também (removidos assim que o pin solta, via
          onLeave) pra conter o scale do miolo numa tela só. */}
      <div ref={contentRef} className="-mt-[100svh] h-svh overflow-hidden bg-ink text-paper">
        <div ref={contentInnerRef} className="mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 lg:py-36">
          <SectionHeading eyebrow="Serviços" title="Mais *criações*" tone="dark" />

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

          {!revealed ? null : (
            <div className="mt-10 space-y-16">
              {visibleProjects.map((project) => {
                // Identidade Visual: tamanhos livres, empilhado tipo masonry (sem aspect-ratio fixo)
                const isMasonry = project.id === 'identidade-visual'
                return (
                  <div key={project.id}>
                    <h3 className="font-display text-3xl font-bold tracking-tight uppercase sm:text-4xl">
                      {project.title}
                    </h3>
                    <div
                      className={cn(
                        'mt-6 gap-4',
                        isMasonry ? 'columns-1 sm:columns-2' : 'grid grid-cols-1 sm:grid-cols-2',
                        !isMasonry && project.id !== 'youtube' && 'lg:grid-cols-3',
                      )}
                    >
                      {project.gallery.map((media, i) => {
                        const externalUrl = mediaExternalUrl(media)
                        const coverSrc = mediaCoverSrc(media)
                        const aspectClass = isMasonry
                          ? media.type !== 'video' && !coverSrc
                            ? 'aspect-4/5' // sem asset ainda — precisa de altura própria pro placeholder
                            : ''
                          : project.id === 'video-curto' ||
                              project.id === 'stories' ||
                              project.id === 'produtos-digitais' ||
                              project.id === 'identidade-visual-perfis'
                            ? // Reels, TikTok, Stories, Produtos digitais e Perfis: formato de tela cheia (1080×1920, 9:16)
                              'aspect-9/16'
                            : project.id === 'carrosseis' ||
                                project.id === 'posts' ||
                                project.id === 'fotografia' ||
                                project.id === 'criativos'
                              ? // Carrosséis, Posts, Fotografia e Criativos: formato de post do Instagram (1080×1350, 4:5)
                                'aspect-4/5'
                              : 'aspect-video'

                        const tileClassName = cn(
                          'group relative block overflow-hidden rounded-2xl border-2 border-paper/15 transition-colors hover:border-pink',
                          aspectClass,
                          isMasonry && 'mb-4 w-full',
                        )
                        const mediaClassName = isMasonry ? 'h-auto w-full object-contain' : 'h-full w-full object-cover'

                        const tileContent = (
                          <>
                            {media.type === 'video' ? (
                              <video src={media.src} muted loop autoPlay playsInline className={mediaClassName} />
                            ) : (
                              <PlaceholderMedia
                                src={coverSrc}
                                alt={project.title}
                                hue={project.hue}
                                label={project.title}
                                className={isMasonry ? mediaClassName : undefined}
                              />
                            )}
                            {media.type === 'carousel' && (
                              <span
                                aria-hidden
                                className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-[10px] font-semibold text-paper backdrop-blur-sm"
                              >
                                <Images className="h-3 w-3" strokeWidth={2.5} />
                                {media.images.length}
                              </span>
                            )}
                            <span
                              aria-hidden
                              className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/30 group-hover:opacity-100"
                            >
                              <ArrowUpRight className="h-8 w-8 text-paper" strokeWidth={2.5} />
                            </span>
                          </>
                        )

                        return externalUrl ? (
                          <a
                            key={mediaKey(media)}
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={tileClassName}
                          >
                            {tileContent}
                          </a>
                        ) : (
                          <button
                            key={mediaKey(media)}
                            type="button"
                            onClick={() => setFocused({ projectId: project.id, index: i, subIndex: 0 })}
                            className={tileClassName}
                          >
                            {tileContent}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {focusedProject &&
        focusedMedia &&
        createPortal(
          <div
            className="fixed inset-0 z-90 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
            onClick={() => setFocused(null)}
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setFocused(null)}
              className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper text-paper transition-colors hover:bg-pink hover:text-ink"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div
              className="relative flex max-h-[85vh] max-w-[95vw] items-center justify-center overflow-hidden rounded-4xl border-2 border-paper/30 bg-paper/5"
              onClick={(e) => e.stopPropagation()}
            >
              {focusedMedia.type === 'video' ? (
                <video
                  key={focusedMedia.src}
                  src={focusedMedia.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="h-auto max-h-[85vh] w-auto max-w-[95vw] rounded-[inherit]"
                />
              ) : (
                <LightboxImage
                  key={focusedImageSrc}
                  src={focusedImageSrc}
                  alt={focusedProject.title}
                  hue={focusedProject.hue}
                  label={focusedProject.title}
                />
              )}
              {focusedMedia.type === 'carousel' && focusedMedia.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {focusedMedia.images.map((_, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className={cn('h-1.5 w-1.5 rounded-full', i === focused?.subIndex ? 'bg-pink' : 'bg-paper/40')}
                    />
                  ))}
                </div>
              )}
              {canNavigate && (
                <>
                  <button
                    type="button"
                    aria-label="Anterior"
                    onClick={() => moveFocused(-1)}
                    className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper bg-ink/60 text-paper hover:bg-pink hover:text-ink"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Próximo"
                    onClick={() => moveFocused(1)}
                    className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper bg-ink/60 text-paper hover:bg-pink hover:text-ink"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
