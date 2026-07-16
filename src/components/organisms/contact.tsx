import { Eyebrow } from '@/components/atoms/eyebrow'
import { SplitWords } from '@/components/atoms/split-words'
import { profile } from '@/data/portfolio'
import { useMagnetic } from '@/hooks/use-magnetic'
import { useWordReveal } from '@/hooks/use-word-reveal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fecho escuro: entra como cortina (cantos arredondados que se achatam,
 * conteúdo com parallax) e traz um botão de e-mail magnético.
 */
export function Contact() {
  const scope = useRef<HTMLDivElement>(null)
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3)
  useWordReveal(scope)

  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { borderTopLeftRadius: 64, borderTopRightRadius: 64, yPercent: 6 },
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 25%', scrub: true },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={scope} className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-between px-6 pt-28 pb-8 sm:px-10">
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <Eyebrow tone="dark">Contato</Eyebrow>
            <h2 className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.98] tracking-tight text-paper">
              <em className="font-medium">
                <SplitWords text="Vamos trabalhar" />
              </em>
              <br />
              <strong className="font-bold text-pink uppercase">
                <SplitWords text="juntos!" />
              </strong>
            </h2>
            <div className="flex flex-col items-start gap-1 text-sm tracking-[0.15em] uppercase">
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-paper/70 underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink"
              >
                {profile.phone}
              </a>
              <a
                href="https://instagram.com/raquelruffinomkt"
                target="_blank"
                rel="noreferrer"
                className="text-paper/70 underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink"
              >
                {profile.instagram}
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <a
              ref={magneticRef}
              href={profile.whatsapp}
              target="_blank"
              rel="noreferrer"
              data-cursor
              className="group flex h-44 w-44 flex-col items-center justify-center gap-2 rounded-full border-2 border-paper bg-pink text-center transition-colors duration-500 hover:bg-lavender sm:h-56 sm:w-56"
            >
              <ArrowUpRight
                aria-hidden
                className="h-10 w-10 text-ink transition-transform duration-500 group-hover:rotate-45 sm:h-12 sm:w-12"
                strokeWidth={2.5}
              />
              <span className="font-display text-xl font-bold text-ink uppercase sm:text-2xl">
                me chama
                <span className="block font-body text-[10px] font-semibold tracking-[0.2em] text-ink/70 normal-case">
                  no WhatsApp
                </span>
              </span>
            </a>
          </div>
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex gap-6" aria-label="Redes sociais">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="tracking-wide uppercase transition-colors hover:text-pink-soft"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p>
            © {new Date().getFullYear()} | {profile.name} feito com amor e muito café
          </p>
        </footer>
      </div>
    </div>
  )
}
