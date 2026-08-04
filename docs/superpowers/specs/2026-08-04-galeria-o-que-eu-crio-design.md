# Galeria de materiais — seção "O que eu crio"

Status: aprovado. Data: 2026-08-04.

## Contexto

`WorksList` (`src/components/organisms/works-list.tsx`) renderiza a seção
"O que eu *crio*" a partir de `projects` em `src/data/portfolio.ts`. Hoje
cada projeto tem no máximo 1 mídia (`video` ou `image`). Novos assets
chegaram em `C:\Users\ferna\Downloads\assets` e precisam popular essa
seção, com jeito de ver tudo de uma vez e também por item.

## Mapeamento de assets

De `Downloads/assets` para `public/assets/` (nomes novos, descritivos):

| Origem | Destino | Projeto |
|---|---|---|
| `reels.mp4` | `reels-2.mp4` | Reels & TikTok (principal) |
| `youtube.mp4` | `youtube-2.mp4` | Vídeos longos (principal) |
| `carrosseis.mp4` | `carrossel-1.mp4` | Carrosséis |
| `carrosseis1.mp4` | `carrossel-2.mp4` | Carrosséis |
| `carrosseis2.mp4` | `carrossel-3.mp4` | Carrosséis |
| `carroseis3.mp4` | `carrossel-4.mp4` | Carrosséis |
| `carrossel.mp4` | `carrossel-5.mp4` | Carrosséis |
| `carroseis - instagram.mp4` | `carrossel-6.mp4` | Carrosséis |
| `instagram.mp4` | `carrossel-7.mp4` | Carrosséis |
| `instagram-links.mp4` | `carrossel-8.mp4` | Carrosséis |
| `posts.jpeg` | `carrossel-post-1.jpeg` | Carrosséis |
| `posts1.jpeg` | `carrossel-post-2.jpeg` | Carrosséis |
| `post3.jpeg` | `carrossel-post-3.jpeg` | Carrosséis |

Fotografia e Produtos digitais não ganham asset novo — mantêm a imagem
atual como único item da galeria.

Sem conversão para GIF: sem ffmpeg disponível no ambiente, e
`<video autoplay muted loop playsinline>` trocando de `src` a cada
2.5s reproduz o mesmo efeito ("passa uns segundos e vai pro próximo")
com qualidade e custo menores que GIF.

## Modelo de dados (`src/data/portfolio.ts`)

```ts
export type ProjectMedia = { type: 'video' | 'image'; src: string }

export type Project = {
  id: string
  title: string
  category: string
  year: string
  description: string
  image: string
  video?: string
  hue: string
  /** todas as mídias do projeto; índice 0 = principal (usado no preview atual) */
  gallery: ProjectMedia[]
  /** plataformas onde esse tipo de conteúdo roda — vira badge extra */
  platforms?: string[]
}
```

- `image`/`video` continuam existindo (compat com `PlaceholderMedia` e
  fallback), sempre iguais a `gallery[0]`.
- Carrosséis: `platforms: ['Instagram', 'LinkedIn']`.
- Reels & TikTok: `platforms: ['Instagram', 'TikTok']`.
- Vídeos longos (YouTube): `platforms: ['YouTube']`.
- Fotografia / Produtos digitais: sem `platforms` (nenhum badge extra).

## Componente novo: `MediaGalleryModal`

`src/components/organisms/media-gallery-modal.tsx`.

Props:

```ts
type MediaGalleryModalProps = {
  projects: Project[]
  /** id do projeto pra abrir já filtrado; undefined = aba "todos" */
  initialProjectId?: string
  onClose: () => void
}
```

- Overlay full-screen, `fixed inset-0 z-80`, scrim escuro + card central
  com borda 2px ink, cantos arredondados — mesma linguagem visual do
  preview flutuante existente (`border-2 border-ink`, sticker).
- Tabs no topo: "Todos" + 1 por projeto (título curto). Clique troca o
  grid exibido.
- Grid de thumbs: vídeo (autoplay muted loop, sem controles) ou imagem,
  aspect-video, rounded-xl, border ink/10.
- Clique num thumb → view focado (mídia grande, vídeo com controls) com
  setas prev/next dentro do mesmo projeto; Esc ou X fecha o focado (volta
  pro grid) ou o modal inteiro (fecha tudo).
- Fechar: botão X, tecla Esc, clique no backdrop.
- Enquanto aberto: `lenis?.stop()` + `document.body.style.overflow =
  'hidden'`; restaura no unmount/close.
- Renderizado via portal no fim do `body` (evita clipping/stacking
  issues dentro da section).

## Mudanças em `WorksList`

- Estado: `galleryModal: { open: boolean; projectId?: string }`.
- Botão global "Ver todos os materiais" (`Button` atom, `variant="outline"`,
  `size="sm"`) abaixo do `SectionHeading`, abre modal com
  `initialProjectId: undefined`.
- Botão por item "Ver materiais": só renderiza se
  `project.gallery.length > 1`. Fica dentro do `work-row`, texto pequeno
  tipo link. Handler chama `e.preventDefault(); e.stopPropagation()`
  antes de abrir o modal (a row inteira é um `<a href="#contato">` — não
  pode deixar o clique do botão também navegar).
- Badges de plataforma: `platforms.map(p => <Badge>{p}</Badge>)` ao lado
  do badge de categoria já existente, mesmo padrão visual (fill
  alternado).
- Preview atual (flutuante desktop + inline mobile) passa a ciclar pelo
  `gallery` do projeto a cada 2.5s via `setInterval`, só enquanto o
  projeto estiver ativo/visível (evita ciclar 5 projetos em paralelo à
  toa). Índice reseta pra 0 quando o projeto deixa de estar ativo.
- Preview flutuante desktop: hoje monta os 5 vídeos sempre (só oculta
  com `opacity`). Com Carrosséis tendo 11 itens isso pesa. Muda pra
  montar a mídia só do projeto ativo (`active === i`) — os demais ficam
  sem `<video>`/`<img>` no DOM até ativar.
- Mantém 100% do layout/animação atual das rows (título gigante, hover,
  scroll-anchor) — mudanças são aditivas.

## Fora de escopo

- Conversão real pra GIF.
- Reordenar ou editar os projetos existentes (Fotografia, Produtos
  digitais) além de badges de plataforma se aplicável.
- Upload/gestão de assets fora do fluxo atual (substituir arquivo em
  `public/assets` + editar `portfolio.ts`).
