import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from './hooks/useLenis'
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Pricing from './components/Pricing'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// the phone address bar showing/hiding shouldn't re-measure the pinned sections mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true })

export default function App() {
  useLenis()

  return (
    <main>
      <Navbar />
      <Gallery />
      <Hero />
      <Services />
      <About />
      <Pricing />
      <Work />
      <Contact />
      <Footer />
    </main>
  )
}
