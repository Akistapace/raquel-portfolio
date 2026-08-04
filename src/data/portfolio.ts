/**
 * Conteúdo do portfólio. Edite aqui — nada de texto fixo nos componentes.
 * Assets: exporte as fotos do Canva e salve em `public/assets/`.
 * Se o arquivo não existir, os componentes mostram um placeholder elegante.
 */

/** Resolve um path de `public/` contra o base do Vite (`/raquel-portfolio/` no GitHub Pages). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const profile = {
  name: 'Raquel Aquistapace',
  role: 'Social Media',
  tagline: 'Conteúdo com a cara da sua marca, para atrair o público certo.',
  about:
    'Eu crio conteúdos de alta qualidade alinhados com o estilo único da sua marca, para atrair o seu público-alvo. Conheço tendências e marketing de mídia social e me sinto à vontade para criar uma ampla variedade de conteúdo. Sou uma alma versátil, capaz de mergulhar em diferentes temas e estilos.',
  facts: [
    '27 anos, estudante de marketing',
    'Graduada em turismo',
    'Mochileira desbravando a Ásia',
    'Obcecada por fotografia, viagens, música, moda e beleza',
    'E também por gatinhos e chocolate ✿',
  ],
  experience:
    'Do recrutamento ao ensino, passando por psicologia, doceria, viagens e beleza, já criei conteúdo para realidades bem diferentes. Como social media, produzo para Instagram, Facebook, YouTube e TikTok: edição de vídeo e foto, legendas, narração, ebooks, curso online, identidade visual, CTAs e roteiros para lives. E quando o cliente quer aprender a fazer sozinho, eu ensino: plataformas, aplicativos e imagem visual.',
  portrait: asset('/assets/raquel-no-bg.png'),
  phone: '+55 51 9880451732',
  whatsapp: 'https://wa.me/55519880451732',
  instagram: '@raquelruffinomkt',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/raquelruffinomkt' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raquelrnascimento/' },
    { label: 'WhatsApp', href: 'https://wa.me/55519880451732' },
  ],
  skills: [
    'Reels & TikTok',
    'Carrosséis',
    'Fotografia',
    'Edição de vídeo',
    'Narração',
    'Legendas & CTAs',
    'Identidade visual',
    'Roteiros',
  ],
}

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
    image: asset('/assets/trabalho-reels.png'),
    video: asset('/assets/reels-2.mp4'),
    hue: '#F2B9DA',
    platforms: ['Instagram', 'TikTok'],
    gallery: [
      { type: 'video', src: asset('/assets/reels-2.mp4') },
      { type: 'video', src: asset('/assets/video-reels.mp4') },
    ],
  },
  {
    id: 'carrosseis',
    title: 'Carrosséis',
    category: 'Design',
    year: 'IG · LI',
    description: 'Capas, títulos e legendas pensados para o público salvar e compartilhar.',
    image: asset('/assets/trabalho-carrossel.png'),
    video: asset('/assets/carrossel-1.mp4'),
    hue: '#CDBFEA',
    platforms: ['Instagram', 'LinkedIn'],
    gallery: [
      { type: 'video', src: asset('/assets/carrossel-1.mp4') },
      { type: 'video', src: asset('/assets/carrossel-2.mp4') },
      { type: 'video', src: asset('/assets/carrossel-3.mp4') },
      { type: 'video', src: asset('/assets/carrossel-4.mp4') },
      { type: 'video', src: asset('/assets/carrossel-5.mp4') },
      { type: 'video', src: asset('/assets/carrossel-6.mp4') },
      { type: 'video', src: asset('/assets/carrossel-7.mp4') },
      { type: 'video', src: asset('/assets/carrossel-8.mp4') },
      { type: 'video', src: asset('/assets/carrossel-9.mp4') },
    ],
  },
  {
    id: 'posts',
    title: 'Posts',
    category: 'Design',
    year: 'IG · LI',
    description: 'Peças únicas para feed: capa, texto e identidade em uma imagem só.',
    image: asset('/assets/carrossel-post-1.jpeg'),
    hue: '#FBE3B0',
    platforms: ['Instagram', 'LinkedIn'],
    gallery: [
      { type: 'image', src: asset('/assets/carrossel-post-1.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-2.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-3.jpeg') },
    ],
  },
  {
    id: 'stories',
    title: 'Stories',
    category: 'Design',
    year: 'IG',
    description: 'Stories rápidos pra manter a audiência por perto todos os dias.',
    image: asset('/assets/criativos1.jpeg'),
    hue: '#C6D8F0',
    platforms: ['Instagram'],
    gallery: [
      { type: 'image', src: asset('/assets/criativos1.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-12.jpeg') },
    ],
  },
  {
    id: 'criativos',
    title: 'Criativos',
    category: 'Design',
    year: 'IG · LI',
    description: 'Artes avulsas prontas pra usar: banners, capas e peças de campanha.',
    image: asset('/assets/criativos3.jpeg'),
    hue: '#F5C6AA',
    platforms: ['Instagram', 'LinkedIn'],
    gallery: [
      { type: 'image', src: asset('/assets/criativos3.jpeg') },
      { type: 'image', src: asset('/assets/criativos4.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-7.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-8.jpeg') },
      { type: 'image', src: asset('/assets/criativos.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-10.jpeg') },
    ],
  },
  {
    id: 'youtube',
    title: 'Vídeos longos',
    category: 'YouTube',
    year: 'YT',
    description: 'Roteiro, presença de câmera e edição completa para vídeos longos.',
    image: asset('/assets/trabalho-youtube.png'),
    video: asset('/assets/youtube-2.mp4'),
    hue: '#F6CFE5',
    platforms: ['YouTube'],
    gallery: [
      { type: 'video', src: asset('/assets/youtube-2.mp4') },
      { type: 'image', src: asset('/assets/trabalho-youtube.png') },
    ],
  },
  {
    id: 'fotografia',
    title: 'Fotografia',
    category: 'Foto & edição',
    year: 'Estúdio',
    description: 'Produção e edição de fotos com olhar de moda e beleza.',
    image: asset('/assets/trabalho-foto.png'),
    hue: '#DDD4F0',
    gallery: [{ type: 'image', src: asset('/assets/trabalho-foto.png') }],
  },
  {
    id: 'produtos-digitais',
    title: 'Produtos digitais',
    category: 'Ebook & curso',
    year: 'Digital',
    description: 'Ebook, curso online e link na bio, da estrutura ao design final.',
    image: asset('/assets/trabalho-digital.jpg'),
    video: asset('/assets/ebook-1.mp4'),
    hue: '#EFA5CC',
    gallery: [
      { type: 'video', src: asset('/assets/ebook-1.mp4') },
      { type: 'image', src: asset('/assets/trabalho-digital.jpg') },
    ],
  },
  {
    id: 'identidade-visual',
    title: 'Identidade Visual',
    category: 'Branding',
    year: 'Marca',
    description: 'Logo, cartão de visita e apresentação da marca, prontos pra usar em qualquer canal.',
    image: asset('/assets/identidade-visual-logo.jpeg'),
    video: asset('/assets/identidade-visual-1.mp4'),
    hue: '#B9E3D8',
    gallery: [
      { type: 'video', src: asset('/assets/identidade-visual-1.mp4') },
      { type: 'image', src: asset('/assets/identidade-visual-logo.jpeg') },
      { type: 'image', src: asset('/assets/identidade-visual-cartao-1.jpeg') },
      { type: 'image', src: asset('/assets/identidade-visual-cartao-2.jpeg') },
      { type: 'image', src: asset('/assets/identidade-visual-cartao.jpeg') },
    ],
  },
]
