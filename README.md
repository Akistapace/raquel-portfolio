# Portfólio — Raquel

Portfólio one-page em React com estética sticker-collage editorial: papel branco, tinta preta, pílulas rosa (`#EC79B4`) e lavanda (`#B5A6DC`) com contorno, setas ↗, Playfair Display bold em caixa-alta (display) + Archivo (corpo). Contato fecha em painel escuro para contraste.

## Rodar

```bash
npm install
npm run dev
```

## Assets do Canva

O link do Canva exige login, então os assets não puderam ser baixados automaticamente. Exporte as imagens/vídeos do Canva e salve em `public/assets/` com os nomes listados em [src/data/portfolio.ts](src/data/portfolio.ts) (ex.: `retrato.jpg`, `projeto-aurora.jpg`…). Enquanto o arquivo não existe, cada mídia mostra um placeholder com gradiente. Todo o texto do site também é editado nesse mesmo arquivo de dados.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (tokens em `src/index.css`) + componentes padrão shadcn (`cn`, CVA em `src/components/atoms/button.tsx`)
- GSAP + ScrollTrigger para animações

## Arquitetura (design atômico)

```text
src/
  data/portfolio.ts        ← todo o conteúdo (textos, projetos, links)
  lib/utils.ts             ← cn()
  hooks/                   ← use-lenis (scroll suave), use-magnetic, use-word-reveal
  components/
    atoms/      button, badge (pílula), eyebrow (pílula), split-words, placeholder-media, cursor
    molecules/  section-heading, marquee
    organisms/  preloader, navbar, hero, manifesto, works-list, services, contact
  App.tsx                  ← composição das seções
```

## Animações (referências: Active Theory / Dogstudio)

- **Fundo de pílulas:** pílulas e círculos sticker fixos nas laterais (`pill-field.tsx`), com flutuação contínua, parallax de scroll em velocidades diferentes e parallax de mouse; entram em elástico após o preloader.
- **Preloader:** "PORTFÓLIO" em serifa + contador 000→100 em pílula; cortina sobe ao terminar e o reveal do hero dispara junto com a subida.
- **Cursor customizado:** ponto rosa + anel com atraso; cresce sobre links.
- **Scroll suave com inércia:** Lenis sincronizado com o ScrollTrigger.
- **Hero collage:** letras sobem em stagger, stickers (pílulas, círculo-seta, ↗) entram com `back.out` e reagem ao mouse em camadas de profundidade (parallax).
- **Manifesto:** texto gigante revelado palavra por palavra conforme o scroll (scrub).
- **Projetos:** lista editorial; no desktop um preview flutuante segue o cursor com rotação por velocidade; no mobile a mídia aparece inline.
- **Serviços:** faixa de texto vazado que anda com o scroll + linhas com stagger.
- **Contato:** painel escuro entra como cortina (cantos que se achatam) com botão circular magnético.
- `prefers-reduced-motion` desliga tudo.
