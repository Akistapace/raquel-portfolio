/**
 * Conteúdo do portfólio. Edite aqui — nada de texto fixo nos componentes.
 * Assets: exporte as fotos do Canva e salve em `public/assets/`.
 * Se o arquivo não existir, os componentes mostram um placeholder elegante.
 */

import { calculateAge } from '@/lib/age'

/** Resolve um path de `public/` contra o base do Vite (`/raquel-portfolio/` no GitHub Pages). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** Aniversário da Raquel: 31/05. Idade recalculada sempre a partir do ano de nascimento. */
const RAQUEL_BIRTH_YEAR = 1999
const raquelAge = calculateAge(RAQUEL_BIRTH_YEAR, 5, 31)

export const profile = {
  name: 'Raquel Aquistapace',
  role: 'Social Media',
  tagline: 'Conteúdo com a cara da sua marca, para atrair o público certo.',
  about:
    'Social Media e Estrategista Digital. Ajudo marcas e profissionais a transformarem suas redes sociais em canais atraentes, autênticos e focados em conversão. Meu trabalho vai além da criação de posts bonitos: eu analiso o seu público, entendo seus objetivos de negócio e desenvolvo um planejamento de conteúdo que gera autoridade, conecta com a audiência e atrai novos clientes. Seja para estruturar a presença digital da sua empresa do zero ou para escalar seus resultados com conteúdos estratégicos em vídeo e feed, estou pronta para impulsionar a sua marca. Sou uma alma versátil, capaz de mergulhar em diferentes temas e estilos.',
  facts: [
    `${raquelAge} anos, estudante de marketing`,
    'Graduada em turismo',
    'Mochileira desbravando a Ásia',
    'Obcecada por fotografia, viagens, música, moda e beleza',
    'E também por gatinhos e chocolate ✿',
  ],
  experience:
    'Do recrutamento e seleção à educação, passando por psicologia, metalúrgica, doceria, viagens, studio de beleza, perfumaria e semijoias, já criei conteúdo para realidades bem diferentes. Como social media, produzo para Instagram, Facebook, YouTube e TikTok: edição de vídeo e foto, legendas, narração, ebooks, curso online, identidade visual, CTAs e roteiros para lives. E quando o cliente quer aprender a fazer sozinho, eu ensino: plataformas, aplicativos e imagem visual.',
  portrait: asset('/assets/raquel-no-bg.png'),
  phone: '+55 51 980451732',
  whatsapp: 'https://wa.me/5551980451732',
  instagram: '@raquelruffinomkt',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/raquelruffinomkt' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raquelrnascimento/' },
    { label: 'WhatsApp', href: 'https://wa.me/5551980451732' },
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

type MediaThumb = { thumb?: string }

export type ProjectMedia =
  | ({ type: 'video'; src: string } & MediaThumb)
  | ({ type: 'image'; src: string } & MediaThumb)
  /** sequência de imagens de 1 post carrossel do Instagram — várias imagens, 1 item só */
  | ({ type: 'carousel'; images: string[] } & MediaThumb)
  /** vídeo hospedado no YouTube — clicar abre o vídeo original em nova aba */
  | ({ type: 'youtube'; id: string } & MediaThumb)
  /** vídeo hospedado fora (ex: Facebook) — clicar abre o link original em nova aba */
  | ({ type: 'link'; url: string } & MediaThumb)

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
  /** true = some da lista editorial "O que eu crio" (home); continua na grid de materiais */
  hideFromList?: boolean
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
      { type: 'video', src: asset('/assets/reels-02.mp4') },
      { type: 'video', src: asset('/assets/reels-3.mp4') },
      { type: 'video', src: asset('/assets/reels-4.mp4') },
      { type: 'video', src: asset('/assets/reels-5.mp4') },
      { type: 'video', src: asset('/assets/reels-6.mp4') },
      { type: 'video', src: asset('/assets/reels-1.mp4') },
      { type: 'video', src: asset('/assets/reels-7.mp4') },
      { type: 'video', src: asset('/assets/reels-8.mp4') },
      { type: 'video', src: asset('/assets/reels-9.mp4') },
      { type: 'video', src: asset('/assets/reels-10.mp4') },
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
      {
        type: 'carousel',
        images: [
          asset('/assets/carrossel-beleza-1.jpg'),
          asset('/assets/carrossel-beleza-2.jpg'),
          asset('/assets/carrossel-beleza-3.jpg'),
          asset('/assets/carrossel-beleza-4.jpg'),
          asset('/assets/carrossel-beleza-5.jpg'),
          asset('/assets/carrossel-beleza-6.jpg'),
          asset('/assets/carrossel-beleza-7.jpg'),
          asset('/assets/carrossel-beleza-8.jpg'),
        ],
      },
      {
        type: 'carousel',
        images: [
          asset('/assets/carrossel-mocha-1.jpg'),
          asset('/assets/carrossel-mocha-2.jpg'),
          asset('/assets/carrossel-mocha-3.jpg'),
        ],
      },
      {
        type: 'carousel',
        images: [
          asset('/assets/carrossel-leitura-1.jpg'),
          asset('/assets/carrossel-leitura-2.jpg'),
          asset('/assets/carrossel-leitura-3.jpg'),
        ],
      },
      {
        type: 'carousel',
        images: [
          asset('/assets/carrossel-selecao-1.jpg'),
          asset('/assets/carrossel-selecao-2.jpg'),
          asset('/assets/carrossel-selecao-3.jpg'),
          asset('/assets/carrossel-selecao-4.jpg'),
          asset('/assets/carrossel-selecao-5.jpg'),
          asset('/assets/carrossel-selecao-6.jpg'),
          asset('/assets/carrossel-selecao-7.jpg'),
          // asset('/assets/carrossel-4.mp4'),
        ],
      },
      {
        type: 'carousel',
        images: [
          asset('/assets/carrossel-cilios-1.jpg'),
          asset('/assets/carrossel-cilios-2.jpg'),
          asset('/assets/carrossel-cilios-3.jpg'),
          asset('/assets/carrossel-cilios-4.jpg'),
          asset('/assets/carrossel-cilios-5.jpg'),
          asset('/assets/carrossel-cilios-6.jpeg'),
        ],
      },
      
      { type: 'video', src: asset('/assets/carrossel-1.mp4') },
      { type: 'video', src: asset('/assets/carrossel-2.mp4') },
      { type: 'video', src: asset('/assets/carrossel-3.mp4') },
      { type: 'video', src: asset('/assets/carrossel-5.mp4') },
      { type: 'video', src: asset('/assets/carrossel-6.mp4') },
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
      { type: 'carousel', images: [
        asset('/assets/carrossel-post-2.jpeg'),
        asset('/assets/post-3.jpeg'),
      ]},
      { type: 'carousel', images: [
        asset('/assets/carrossel-post-3.jpeg'), 
        asset('/assets/post-1.jpeg'),
      ]},
      {
        type: 'carousel',
        images: [
          asset('/assets/post-2.jpeg'),
        ],
      },
      { type: 'image', src: asset('/assets/trabalho-digital.jpg') },
      { type: 'image', src: asset('/assets/post-4.jpeg') },
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
      { type: 'image', src: asset('/assets/stories-1.jpg') },
      { type: 'image', src: asset('/assets/stories-2.jpg') },
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
      { type: 'image', src: asset('/assets/certificado.jpeg') },
      { type: 'image', src: asset('/assets/criativos4.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-7.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-8.jpeg') },
      { type: 'image', src: asset('/assets/criativos.jpeg') },
      { type: 'image', src: asset('/assets/carrossel-post-10.jpeg') },
      {
        type: 'carousel',
        images: [
          asset('/assets/criativo-carrossel-4.jpeg'),
          asset('/assets/criativo-carrossel-3.jpeg'),
          asset('/assets/criativo-carrossel-2.jpeg'),
          asset('/assets/criativo-carrossel-1.jpeg'),
          asset('/assets/criativo-1.jpeg'),
        ],
      },
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
      { type: 'video', src: asset('/assets/video-1.mp4') },
      { type: 'youtube', id: 'omaVr5AFUlY' },
      { type: 'youtube', id: 'ksMpTcc0oBg' },
      { type: 'youtube', id: 'p19gm7Q_vgQ' },
      { type: 'youtube', id: '8BCuby0fNWo' },
      { type: 'youtube', id: 'y7VIc5UFChw' },
      { type: 'youtube', id: 'Xv7VVQiytGw' },
    ],
  },
  {
    id: 'suporte-lives',
    title: 'Suporte a Lives',
    category: 'Lives',
    year: 'YT',
    description: 'Roteirização de perguntas, suporte ao vivo, respostas a seguidores...',
    image: asset('/assets/trabalho-youtube.png'),
    hue: '#FFB4A2',
    platforms: ['YouTube', 'Facebook'],
    gallery: [
      { type: 'youtube', id: 'RfcY2D8Pn38' },
      { 
        type: 'youtube',
        id: 'iJ-FeT01pnI',
        thumb: asset('/assets/thumb-1.jpeg'),
      },
      {
        type: 'link',
        url: 'https://www.facebook.com/share/v/1Ejgdcx4VS/',
        thumb: asset('/assets/fb-1.jpg'),
      },
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
    gallery: [
      { type: 'image', src: asset('/assets/fotografia-1.jpg') },
      { type: 'image', src: asset('/assets/fotografia-2.jpg') },
      { type: 'image', src: asset('/assets/fotografia-3.jpg') },
      { type: 'image', src: asset('/assets/fotografia-4.jpg') },
      { type: 'image', src: asset('/assets/fotografia-5.jpg') },
      { type: 'image', src: asset('/assets/fotografia-6.jpg') },
      { type: 'image', src: asset('/assets/fotografia-8.jpg') },
      { type: 'image', src: asset('/assets/fotografia-9.jpg') },
      { type: 'image', src: asset('/assets/fotografia-10.jpg') },
      { type: 'image', src: asset('/assets/fotografia-11.jpg') },
      { type: 'image', src: asset('/assets/fotografia-12.jpg') },
      { type: 'image', src: asset('/assets/fotografia-13.jpg') },
      { type: 'image', src: asset('/assets/fotografia-14.jpg') },
      { type: 'image', src: asset('/assets/fotografia-15.jpg') },
      { type: 'image', src: asset('/assets/fotografia-16.jpg') },
    ],
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
      { type: 'video', src: asset('/assets/ebook.mp4') },
      { type: 'video', src: asset('/assets/prod-digital-1.mp4') },
    ],
  },
  {
    id: 'identidade-visual-perfis',
    title: 'Identidade Visual · Perfis',
    category: 'Branding',
    year: 'Redes',
    description: 'Vídeos de apresentação para perfis de redes sociais, no formato de tela cheia.',
    image: asset('/assets/identidade-visual-logo.jpeg'),
    video: asset('/assets/idv-redes.mp4'),
    hue: '#A8D8CC',
    platforms: ['Instagram'],
    hideFromList: true,
    gallery: [
      { type: 'video', src: asset('/assets/idv-redes.mp4') },
      { type: 'video', src: asset('/assets/idv-redes-1.mp4') },
      { type: 'video', src: asset('/assets/idv-redes-3.mp4') },
    ],
  },
  {
    id: 'consultoria-redes-sociais',
    title: 'Consultoria de redes sociais',
    category: 'Estratégia',
    year: 'Perfil',
    description:
      'Te ajudo a virar a chave com as melhorias necessárias em seu perfil para deixá-lo visualmente atrativo, estratégico e pronto para conectar com as pessoas certas.',
    image: asset('/assets/consultoria-redes-sociais.png'),
    hue: '#F4C7D8',
    platforms: ['Instagram'],
    gallery: [{ type: 'image', src: asset('/assets/consultoria-redes-sociais.png') }],
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
      // { type: 'image', src: asset('/assets/identidade-visual-logo.jpeg') },
      { type: 'image', src: asset('/assets/identidade-visual-cartao-1.jpeg') },
      { type: 'image', src: asset('/assets/identidade-visual-cartao-2.jpeg') },
      { type: 'image', src: asset('/assets/identidade-visual-cartao.jpeg') },
      { type: 'image', src: asset('/assets/idv-1.png') },
      { type: 'image', src: asset('/assets/idv-2.jpeg') },
      { type: 'image', src: asset('/assets/idv-3.jpeg') },
    ],
  },
]
