import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Navbar() {
  const navRef = useRef(null)

  useGSAP(() => {
    gsap.from(navRef.current, { y: -60, opacity: 0, duration: 0.8, ease: 'power2.out' })
  }, { scope: navRef })

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/5"
    >
      <div
        className="pg flex items-center justify-between"
        style={{ paddingTop: '14px', paddingBottom: '14px' }}
      >
        <img src="/logo.png" alt="Nosocials" className="h-11 w-auto" />

        <ul className="hidden md:flex items-center gap-10 text-sm font-medium text-black">
          <li><a href="#services" className="hover:text-coral transition-colors">Services</a></li>
          <li><a href="#about" className="hover:text-coral transition-colors">About</a></li>
          <li><a href="#work" className="hover:text-coral transition-colors">Work</a></li>
        </ul>

        <a
          href="#contact"
          className="brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', fontSize: '14px' }}
        >
          Get Started
        </a>
      </div>
    </nav>
  )
}
