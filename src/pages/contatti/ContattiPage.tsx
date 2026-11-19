import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { ContactPrefooter } from '@/components/sections/ContactPrefooter'

/** Pagina /contatti: lo stesso form generico del prefooter, aperto dal tasto "Contattaci" del menu */
export function ContattiPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow relative">
        <ContactPrefooter />
      </main>
      <Footer />
    </>
  )
}
