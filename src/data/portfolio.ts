/**
 * Conteúdo do portfólio. Edite aqui — nada de texto fixo nos componentes.
 * Assets: exporte as fotos do Canva e salve em `public/assets/`.
 * Se o arquivo não existir, os componentes mostram um placeholder elegante.
 */

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
  portrait: '/assets/raquel-no-bg.png',
  phone: '+55 (51) 98045-1745',
  whatsapp: 'https://wa.me/5551980451745',
  instagram: '@raquelruffinomkt',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/raquelruffinomkt' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raquelrnascimento/' },
    { label: 'WhatsApp', href: 'https://wa.me/5551980451745' },
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
    video: '/assets/video-reels.mp4',
    hue: '#F2B9DA',
  },
  {
    id: 'carrosseis',
    title: 'Carrosséis',
    category: 'Design',
    year: 'IG',
    description: 'Capas, títulos e legendas pensados para o público salvar e compartilhar.',
    image: '/assets/trabalho-carrossel.png',
    hue: '#CDBFEA',
  },
  {
    id: 'youtube',
    title: 'Vídeos longos',
    category: 'YouTube',
    year: 'YT',
    description: 'Roteiro, presença de câmera e edição completa para vídeos longos.',
    image: '/assets/trabalho-youtube.png',
    hue: '#F6CFE5',
  },
  {
    id: 'fotografia',
    title: 'Fotografia',
    category: 'Foto & edição',
    year: 'Estúdio',
    description: 'Produção e edição de fotos com olhar de moda e beleza.',
    image: '/assets/trabalho-foto.png',
    hue: '#DDD4F0',
  },
  {
    id: 'produtos-digitais',
    title: 'Produtos digitais',
    category: 'Ebook & curso',
    year: 'Digital',
    description: 'Ebook, curso online e link na bio, da estrutura ao design final.',
    image: '/assets/trabalho-digital.jpg',
    hue: '#EFA5CC',
  },
]

export const services = [
  {
    name: 'Criação de conteúdo',
    detail: 'Roteiro, vídeo, edição, narração e transições, com versatilidade de temas e estilos.',
  },
  {
    name: 'Design para redes',
    detail: 'Carrosséis, capas, títulos, legendas e identidade visual.',
  },
  {
    name: 'Fotografia',
    detail: 'Produção e edição de fotos, com desenvoltura em frente às câmeras.',
  },
  {
    name: 'Produtos digitais',
    detail: 'Ebook, curso online e link na bio, da criação à edição.',
  },
  {
    name: 'Mentoria de conteúdo',
    detail: 'Ensino você a criar seus próprios conteúdos: plataformas, apps e imagem visual.',
  },
]
