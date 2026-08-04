import { useState } from 'react'
import { Cursor } from '@/components/atoms/cursor'
import { PillField } from '@/components/organisms/pill-field'
import { Preloader } from '@/components/organisms/preloader'
import { Navbar } from '@/components/organisms/navbar'
import { Hero } from '@/components/organisms/hero'
import { Manifesto } from '@/components/organisms/manifesto'
import { WorksList } from '@/components/organisms/works-list'
import { MaterialsSection } from '@/components/organisms/materials-section'
import { Contact } from '@/components/organisms/contact'
import { useLenis } from '@/hooks/use-lenis'

/**
 * One-page estilo sticker-collage: preloader → hero (collage com parallax de
 * mouse) → manifesto (scrub) → projetos (preview que segue o cursor) →
 * materiais (círculo que abre com o scroll) → contato (cortina escura).
 */
function App() {
  const [ready, setReady] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>()
  useLenis()

  return (
    <>
      <Cursor />
      <Preloader onDone={() => setReady(true)} />
      <PillField ready={ready} />
      <Navbar />
      <main id="topo" className="relative z-10">
        <section aria-label="Apresentação">
          <Hero ready={ready} />
        </section>
        <section id="sobre">
          <Manifesto />
        </section>
        <section id="projetos">
          <WorksList onSelectProject={setActiveProjectId} />
        </section>
        <section id="servicos">
          <MaterialsSection activeProjectId={activeProjectId} />
        </section>
        <section id="contato">
          <Contact />
        </section>
      </main>
    </>
  )
}

export default App
