import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { whatsappLink } from '../config'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#work', label: 'Work' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const [open, setOpen] = useState(false)

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
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-coral transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink("Hi Nosocials! I'd like to get started with your social media services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', fontSize: '14px' }}
          >
            Get Started
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden flex flex-col items-center justify-center gap-1.25 w-10 h-10 rounded-full border border-black/10"
          >
            <span
              className="block w-5 h-0.5 bg-black rounded transition-transform duration-300"
              style={{ transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-0.5 bg-black rounded transition-opacity duration-300"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-black rounded transition-transform duration-300"
              style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className="md:hidden overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: open ? '240px' : '0px' }}
      >
        <ul
          className="pg flex flex-col text-base font-medium text-black border-t border-black/5"
          style={{ paddingTop: '8px', paddingBottom: '16px' }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block hover:text-coral transition-colors"
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
