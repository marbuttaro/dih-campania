import { useEffect } from 'react'

import { GlowCursor } from '@/components/effects/GlowCursor'
import { About } from '@/components/sections/About'
import { Community } from '@/components/sections/Community'
import { ContactPrefooter } from '@/components/sections/ContactPrefooter'
import { Events } from '@/components/sections/Events'
import { Experience } from '@/components/sections/Experience'
import { FAQ } from '@/components/sections/FAQ'
import { Footer } from '@/components/sections/Footer'
import { Grants } from '@/components/sections/Grants'
import { Hero } from '@/components/sections/Hero'
import { Navbar } from '@/components/sections/Navbar'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'

function App() {
  // Pages without their own contact form link here with #contatti (e.g. the news pages)
  useEffect(() => {
    if (window.location.hash !== '#contatti') return

    const scrollToContact = () => {
      document.getElementById('contatti')?.scrollIntoView({ block: 'start' })
    }

    scrollToContact()
    window.addEventListener('load', scrollToContact)
    const timeout = window.setTimeout(scrollToContact, 600)

    return () => {
      window.removeEventListener('load', scrollToContact)
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <GlowCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Community />
        <Projects />
        <Experience />
        <Grants />
        <Events />
        <FAQ />
        <ContactPrefooter />
      </main>
      <Footer />
    </div>
  )
}

export default App
