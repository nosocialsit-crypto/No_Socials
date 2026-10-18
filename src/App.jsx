import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from './hooks/useLenis'
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Work from './components/Work'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function App() {
  useLenis()

  return (
    <main>
      <Navbar />
      <Gallery />
      <Hero />
      <Services />
      <About />
      <Work />
      <Footer />
    </main>
  )
}
