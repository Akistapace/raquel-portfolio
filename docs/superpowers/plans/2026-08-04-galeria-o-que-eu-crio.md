# Galeria de materiais — "O que eu crio" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Popular a seção "O que eu *crio*" com os novos assets de `Downloads/assets`, com um botão global "ver todos os materiais" (modal com todas as mídias, por aba de projeto) e um botão por item (mesmo modal, já filtrado), sem alterar a visualização em lista que existe hoje.

**Architecture:** `Project` em `src/data/portfolio.ts` ganha um array `gallery` (todas as mídias) e `platforms` (badges). Um componente `CyclingMedia` troca de item da galeria a cada 2.5s e substitui a mídia estática atual (preview flutuante desktop + inline mobile). Um componente `MediaGalleryModal`, montado via portal, mostra tabs por projeto + grid + view focado com prev/next.

**Tech Stack:** React 19 + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis. Sem test runner no repo (`package.json` só tem `dev`/`build`/`lint`/`preview`) — verificação por task é `npx tsc -b --noEmit` (type-check) + `npm run lint` (oxlint); verificação visual final via `npm run dev` + checagem manual no navegador.

## Global Constraints

- Sem conversão para GIF — usar `<video autoplay muted loop playsinline>` com troca de `src` a cada 2.5s.
- Não alterar layout/animações das rows existentes (título gigante, hover, scroll-anchor) — mudanças são aditivas.
- Botão por item só aparece quando `project.gallery.length > 1`.
- Assets novos entram em `public/assets/` com nomes descritivos (ver Task 1); nenhum arquivo existente em `public/assets/` é removido ou sobrescrito.
- Componentes novos ficam em `src/components/organisms/` (mesmo nível de `works-list.tsx`, já que só são consumidos por ele).

---

## Task 1: Copiar assets novos para `public/assets/`

**Files:**
- Create: `public/assets/reels-2.mp4`
- Create: `public/assets/youtube-2.mp4`
- Create: `public/assets/carrossel-1.mp4` .. `public/assets/carrossel-8.mp4`
- Create: `public/assets/carrossel-post-1.jpeg` .. `public/assets/carrossel-post-3.jpeg`

**Interfaces:**
- Produces: os 13 caminhos acima, referenciados pelo Task 2 em `src/data/portfolio.ts`.

- [ ] **Step 1: Copiar os arquivos**

```bash
cp "C:/Users/ferna/Downloads/assets/reels.mp4" "public/assets/reels-2.mp4"
cp "C:/Users/ferna/Downloads/assets/youtube.mp4" "public/assets/youtube-2.mp4"
cp "C:/Users/ferna/Downloads/assets/carrosseis.mp4" "public/assets/carrossel-1.mp4"
cp "C:/Users/ferna/Downloads/assets/carrosseis1.mp4" "public/assets/carrossel-2.mp4"
cp "C:/Users/ferna/Downloads/assets/carrosseis2.mp4" "public/assets/carrossel-3.mp4"
cp "C:/Users/ferna/Downloads/assets/carroseis3.mp4" "public/assets/carrossel-4.mp4"
cp "C:/Users/ferna/Downloads/assets/carrossel.mp4" "public/assets/carrossel-5.mp4"
cp "C:/Users/ferna/Downloads/assets/carroseis - instagram.mp4" "public/assets/carrossel-6.mp4"
cp "C:/Users/ferna/Downloads/assets/instagram.mp4" "public/assets/carrossel-7.mp4"
cp "C:/Users/ferna/Downloads/assets/instagram-links.mp4" "public/assets/carrossel-8.mp4"
cp "C:/Users/ferna/Downloads/assets/posts.jpeg" "public/assets/carrossel-post-1.jpeg"
cp "C:/Users/ferna/Downloads/assets/posts1.jpeg" "public/assets/carrossel-post-2.jpeg"
cp "C:/Users/ferna/Downloads/assets/post3.jpeg" "public/assets/carrossel-post-3.jpeg"
```

- [ ] **Step 2: Verificar**

Run: `ls public/assets/ | grep -E "reels-2|youtube-2|carrossel-"`
Expected: 13 arquivos listados (8 `carrossel-N.mp4`, 3 `carrossel-post-N.jpeg`, `reels-2.mp4`, `youtube-2.mp4`).

- [ ] **Step 3: Commit**

```bash
git add public/assets/reels-2.mp4 public/assets/youtube-2.mp4 public/assets/carrossel-*.mp4 public/assets/carrossel-post-*.jpeg
git commit -m "assets: add new gallery media for works section"
```

---

## Task 2: Modelo de dados — `gallery` e `platforms` em `Project`

**Files:**
- Modify: `src/data/portfolio.ts`

**Interfaces:**
- Consumes: caminhos criados no Task 1.
- Produces: `type ProjectMedia = { type: 'video' | 'image'; src: string }`; `Project.gallery: ProjectMedia[]`; `Project.platforms?: string[]`. Usados por `CyclingMedia` (Task 3) e `MediaGalleryModal` (Task 4) e `WorksList` (Task 5).

- [ ] **Step 1: Substituir o bloco de tipos e a lista `projects`**

Substitua de `export type Project = {` até o fechamento de `export const projects: Project[] = [...]` (linhas 43–103 do arquivo atual) por:

```ts
export type ProjectMedia = { type: 'video' | 'image'; src: string }

export type Project = {
  id: string
  title: string
  category: string
  year: string
  description: string
  image: string
  /** vídeo curto (mp4) — toca no preview flutuante em vez da imagem */
  video?: string
  hue: string // cor pastel do placeholder enquanto não há asset
  /** todas as mídias do projeto; índice 0 é sempre igual a `video ?? image` */
  gallery: ProjectMedia[]
  /** plataformas onde esse tipo de conteúdo roda — vira badge extra na lista */
  platforms?: string[]
}

/** Tipos de conteúdo que produzo — viram a lista grande de "trabalhos". */
export const projects: Project[] = [
  {
    id: 'video-curto',
    title: 'Reels & TikTok',
    category: 'Vídeo curto',
    year: 'IG · TT',
    description: 'Do roteiro à transição: vídeos curtos que prendem nos primeiros segundos.',
    image: '/assets/trabalho-reels.png',
    video: '/assets/reels-2.mp4',
    hue: '#F2B9DA',
    platforms: ['Instagram', 'TikTok'],
    gallery: [
      { type: 'video', src: '/assets/reels-2.mp4' },
      { type: 'video', src: '/assets/video-reels.mp4' },
    ],
  },
  {
    id: 'carrosseis',
    title: 'Carrosséis',
    category: 'Design',
    year: 'IG · LI',
    description: 'Capas, títulos e legendas pensados para o público salvar e compartilhar.',
    image: '/assets/trabalho-carrossel.png',
    video: '/assets/carrossel-1.mp4',
    hue: '#CDBFEA',
    platforms: ['Instagram', 'LinkedIn'],
    gallery: [
      { type: 'video', src: '/assets/carrossel-1.mp4' },
      { type: 'video', src: '/assets/carrossel-2.mp4' },
      { type: 'video', src: '/assets/carrossel-3.mp4' },
      { type: 'video', src: '/assets/carrossel-4.mp4' },
      { type: 'video', src: '/assets/carrossel-5.mp4' },
      { type: 'video', src: '/assets/carrossel-6.mp4' },
      { type: 'video', src: '/assets/carrossel-7.mp4' },
      { type: 'video', src: '/assets/carrossel-8.mp4' },
      { type: 'image', src: '/assets/carrossel-post-1.jpeg' },
      { type: 'image', src: '/assets/carrossel-post-2.jpeg' },
      { type: 'image', src: '/assets/carrossel-post-3.jpeg' },
    ],
  },
  {
    id: 'youtube',
    title: 'Vídeos longos',
    category: 'YouTube',
    year: 'YT',
    description: 'Roteiro, presença de câmera e edição completa para vídeos longos.',
    image: '/assets/trabalho-youtube.png',
    video: '/assets/youtube-2.mp4',
    hue: '#F6CFE5',
    platforms: ['YouTube'],
    gallery: [
      { type: 'video', src: '/assets/youtube-2.mp4' },
      { type: 'image', src: '/assets/trabalho-youtube.png' },
    ],
  },
  {
    id: 'fotografia',
    title: 'Fotografia',
    category: 'Foto & edição',
    year: 'Estúdio',
    description: 'Produção e edição de fotos com olhar de moda e beleza.',
    image: '/assets/trabalho-foto.png',
    hue: '#DDD4F0',
    gallery: [{ type: 'image', src: '/assets/trabalho-foto.png' }],
  },
  {
    id: 'produtos-digitais',
    title: 'Produtos digitais',
    category: 'Ebook & curso',
    year: 'Digital',
    description: 'Ebook, curso online e link na bio, da estrutura ao design final.',
    image: '/assets/trabalho-digital.jpg',
    hue: '#EFA5CC',
    gallery: [{ type: 'image', src: '/assets/trabalho-digital.jpg' }],
  },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b --noEmit`
Expected: sem erros (o `works-list.tsx` ainda usa só `project.video`/`project.image`, que continuam existindo).

- [ ] **Step 3: Commit**

```bash
git add src/data/portfolio.ts
git commit -m "feat: add gallery and platforms to project data"
```

---

## Task 3: Componente `CyclingMedia`

**Files:**
- Create: `src/components/organisms/works-list-media.tsx`

**Interfaces:**
- Consumes: `ProjectMedia` de `@/data/portfolio` (Task 2); `PlaceholderMedia` de `@/components/atoms/placeholder-media`.
- Produces: `CyclingMedia({ gallery, active, intervalMs?, alt, hue?, label?, className? })` — usado por `WorksList` (Task 5).

- [ ] **Step 1: Criar o componente**

```tsx
import { useEffect, useState } from 'react'
import type { ProjectMedia } from '@/data/portfolio'
import { PlaceholderMedia } from '@/components/atoms/placeholder-media'

type CyclingMediaProps = {
  gallery: ProjectMedia[]
  /** cicla pro próximo item da galeria a cada `intervalMs` enquanto true */
  active: boolean
  intervalMs?: number
  alt: string
  hue?: string
  label?: string
  className?: string
}

/** Mostra o item atual da galeria do projeto; avança pro próximo enquanto `active`. */
export function CyclingMedia({
  gallery,
  active,
  intervalMs = 2500,
  alt,
  hue,
  label,
  className,
}: CyclingMediaProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active || gallery.length <= 1) {
      setIndex(0)
      return
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % gallery.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [active, gallery.length, intervalMs])

  const current = gallery[index]
  if (!current) return null

  if (current.type === 'video') {
    return (
      <video
        key={current.src}
        src={current.src}
        muted
        loop
        autoPlay
        playsInline
        className={className ?? 'h-full w-full object-cover'}
      />
    )
  }

  return <PlaceholderMedia src={current.src} alt={alt} hue={hue} label={label} className={className} />
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/works-list-media.tsx
git commit -m "feat: add CyclingMedia component for auto-advancing gallery preview"
```

---

## Task 4: Componente `MediaGalleryModal`

**Files:**
- Create: `src/components/organisms/media-gallery-modal.tsx`

**Interfaces:**
- Consumes: `Project` de `@/data/portfolio` (Task 2); `lenis` de `@/hooks/use-lenis`; `PlaceholderMedia`; `cn` de `@/lib/utils`.
- Produces: `MediaGalleryModal({ projects, initialProjectId?, onClose })` — usado por `WorksList` (Task 5).

- [ ] **Step 1: Criar o componente**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/media-gallery-modal.tsx
git commit -m "feat: add MediaGalleryModal with tabs, grid and focused view"
```

---

## Task 5: Ligar tudo em `WorksList`

**Files:**
- Modify: `src/components/organisms/works-list.tsx` (arquivo inteiro substituído — ver Step 1)

**Interfaces:**
- Consumes: `CyclingMedia` (Task 3), `MediaGalleryModal` (Task 4), `Button` de `@/components/atoms/button`, `project.gallery`/`project.platforms` (Task 2).

- [ ] **Step 1: Substituir o conteúdo de `src/components/organisms/works-list.tsx` por**

```tsx
import { useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'
import { SectionHeading } from '@/components/molecules/section-heading'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { CyclingMedia } from '@/components/organisms/works-list-media'
import { MediaGalleryModal } from '@/components/organisms/media-gallery-modal'
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
  const [galleryModal, setGalleryModal] = useState<{ open: boolean; projectId?: string }>({
    open: false,
  })
  const hoveringRef = useRef(false)
  const scrollActiveRef = useRef<number | null>(null)
  const moveRef = useRef<{
    xTo: (v: number) => void
    yTo: (v: number) => void
    rTo: (v: number) => void
  } | null>(null)
  useWordReveal(scope)

  const openGallery = (e: ReactMouseEvent, projectId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setGalleryModal({ open: true, projectId })
  }

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

      <div className="mt-8 flex justify-start sm:justify-end">
        <Button variant="outline" size="sm" onClick={() => setGalleryModal({ open: true })}>
          Ver todos os materiais
        </Button>
      </div>

      <ul className="work-rows mt-10 border-t border-ink/10">
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
              {project.gallery.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => openGallery(e, project.id)}
                  className="mt-3 inline-flex items-center text-xs font-semibold tracking-[0.2em] text-smoke uppercase transition-colors hover:text-pink"
                >
                  Ver materiais ({project.gallery.length})
                </button>
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
            {active === i && (
              <CyclingMedia
                gallery={project.gallery}
                active
                alt={`${project.title} (${project.category})`}
                hue={project.hue}
                label={project.title}
              />
            )}
          </div>
        ))}
      </div>

      {galleryModal.open && (
        <MediaGalleryModal
          projects={projects}
          initialProjectId={galleryModal.projectId}
          onClose={() => setGalleryModal({ open: false })}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check e lint**

Run: `npx tsc -b --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/works-list.tsx
git commit -m "feat: wire gallery modal and platform badges into works list"
```

---

## Task 6: Verificação final — build + checagem visual

**Files:** nenhum (só verificação).

- [ ] **Step 1: Build de produção**

Run: `npm run build`
Expected: build termina sem erros de TypeScript/Vite.

- [ ] **Step 2: Checagem visual manual**

Run: `npm run dev`, abrir a seção "O que eu crio" no navegador e conferir:
- Botão "Ver todos os materiais" abre o modal na aba "Todos", com os 5 projetos e seus grids.
- Aba "Carrosséis" mostra os 11 itens (8 vídeos + 3 fotos), vídeos tocando em loop mudo no grid.
- Clique num thumb abre o view focado com setas prev/next; Esc volta pra grade; Esc de novo fecha o modal.
- Em cada row com mais de 1 item na galeria, o botão "Ver materiais (N)" aparece e abre o modal já na aba certa, sem navegar pra `#contato`.
- Badges de plataforma aparecem ao lado da categoria (Instagram/TikTok, Instagram/LinkedIn, YouTube).
- Preview flutuante (desktop, hover numa row) e mídia inline (mobile) trocam de item a cada ~2.5s.
- Scroll da página continua travado (Lenis parado) enquanto o modal está aberto, e volta ao normal ao fechar.

- [ ] **Step 3: Commit final (se ajustes forem feitos na checagem visual)**

```bash
git add -A
git commit -m "fix: address visual QA issues in works gallery"
```

(Pule este commit se nenhum ajuste foi necessário.)
