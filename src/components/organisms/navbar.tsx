import { profile } from '@/data/portfolio'
import { lenis } from '@/hooks/use-lenis'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#contato', label: 'Contato' },
]

function goTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!lenis) return // sem smooth scroll (reduced motion): âncora nativa
  e.preventDefault()
  lenis.scrollTo(href, { duration: 1.4 })
}

export function Navbar() {
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 top-0 z-60 mix-blend-difference">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-white sm:px-10">
        <a
          href="#topo"
          onClick={(e) => goTo(e, '#topo')}
          className="font-display text-xl font-semibold tracking-tight italic"
        >
          {profile.name.toLowerCase()}
          <span className="opacity-60">.</span>
        </a>
        <ul className="hidden items-center gap-8 text-sm sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => goTo(e, link.href)}
                className="tracking-wide uppercase opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contato"
          onClick={(e) => goTo(e, '#contato')}
          className="text-sm tracking-wide uppercase underline underline-offset-4 sm:hidden"
        >
          Contato
        </a>
      </div>
    </nav>
  )
}
