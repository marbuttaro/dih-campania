import { About } from '@/components/sections/About'
import { Community } from '@/components/sections/Community'
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
  return (
    <div className="flex flex-col min-h-screen">
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
      </main>
      <Footer />
    </div>
  )
}

export default App
