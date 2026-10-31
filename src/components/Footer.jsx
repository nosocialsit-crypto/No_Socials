import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../hooks/useLenis'
import { whatsappLink, WHATSAPP_DISPLAY } from '../config'

gsap.registerPlugin(ScrollTrigger)

const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

const InstagramIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg {...iconProps}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
)

const LinkedInIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
)

const ArrowUpIcon = () => (
  <svg {...iconProps}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const companyLinks = ['Services', 'About', 'Pricing', 'Work']

const contactLinks = [
  { label: WHATSAPP_DISPLAY, href: whatsappLink("Hi NoSocials! I'd like to know more about your services."), Icon: WhatsAppIcon, external: true },
  { label: 'nosocials.in@gmail.com', href: 'mailto:nosocials.in@gmail.com', Icon: MailIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/nosocials.in?dlrf=MWVsY2E3Mzk0eGc1cw==', Icon: InstagramIcon },
  { label: 'LinkedIn', href: '#', Icon: LinkedInIcon },
]

const year = new Date().getFullYear()

const marqueeWords = ['NoSocials', 'ironically', 'strategy', 'content', 'growth']

export default function Footer() {
  const footerRef = useRef(null)

  useGSAP(() => {
    gsap.from('.ft-reveal', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: footerRef.current, start: 'top 80%', once: true },
    })
  }, { scope: footerRef })

  const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="ft relative bg-black overflow-hidden"
      style={{ paddingTop: '5rem', paddingBottom: '2.5rem' }}
    >
      <div className="ft-glow" aria-hidden="true" />

      <div className="relative" style={pgStyle}>

        {/* CTA */}
        <div
          className="ft-reveal flex flex-col md:flex-row md:items-end justify-between"
          style={{ gap: '2rem', marginBottom: '4.5rem' }}
        >
          <div>
            <span className="ft-status">
              <span className="ft-dot" />
              Available for new projects
            </span>
            <h2
              className="text-white font-black tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', marginTop: '1.25rem' }}
            >
              Let's make your<br />
              feed <span className="brand-gradient-text">unignorable.</span>
            </h2>
          </div>
          <a
            href={whatsappLink("Hi NoSocials! I'd like to start a project with you.")}
            target="_blank"
            rel="noopener noreferrer"
            className="ft-cta brand-gradient text-white font-semibold rounded-full whitespace-nowrap self-start md:self-auto"
          >
            Start a project
            <span className="ft-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        {/* top grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: '3rem',
            paddingTop: '3.5rem',
            marginBottom: '3.5rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* brand */}
          <div className="ft-reveal">
            <img
              src="/hdlogo.webp"
              alt="NoSocials"
              width="330"
              height="132"
              loading="lazy"
              className="brightness-0 invert"
              style={{ height: '2rem', width: 'auto', marginBottom: '1.5rem' }}
            />
            <p className="text-white leading-relaxed" style={{ fontSize: '14px', opacity: 0.45, maxWidth: '260px' }}>
              We manage your social media with strategy, creativity, and a little irony.
            </p>
            <div className="flex" style={{ gap: '0.75rem', marginTop: '1.75rem' }}>
              {contactLinks.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={external ? `WhatsApp ${label}` : label}
                  className="ft-social"
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* company */}
          <div className="ft-reveal">
            <p className="ft-heading eyebrow">
              Company
            </p>
            <ul style={{ listStyle: 'none' }}>
              {companyLinks.map((item) => (
                <li key={item} style={{ marginBottom: '0.875rem' }}>
                  <a href={`#${item.toLowerCase()}`} className="ft-link">
                    <span className="ft-link-arrow" aria-hidden="true">→</span>
                    <span className="ft-link-text">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="ft-reveal">
            <p className="ft-heading eyebrow">
              Contact
            </p>
            <ul style={{ listStyle: 'none' }}>
              {contactLinks.map(({ label, href, Icon, external }) => (
                <li key={label} style={{ marginBottom: '0.875rem' }}>
                  <a
                    href={href}
                    className="ft-link"
                    style={{ wordBreak: 'break-all' }}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span className="ft-link-icon"><Icon /></span>
                    <span className="ft-link-text">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className="ft-marquee" aria-hidden="true">
        <div className="ft-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="ft-marquee-group">
              {marqueeWords.map((w) => (
                <span key={w} className="ft-marquee-item">
                  {w}
                  <span className="ft-marquee-star">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* bottom row */}
      <div className="relative" style={pgStyle}>
        <div
          className="flex flex-col-reverse md:flex-row justify-between items-center"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            gap: '1.25rem',
          }}
        >
          <p className="text-white text-center md:text-left" style={{ fontSize: '12px', opacity: 0.3 }}>
            © {year} NoSocials. Ironically managing your socials.
          </p>
          <button type="button" onClick={scrollToTop} className="ft-top">
            Back to top
            <span className="ft-top-icon"><ArrowUpIcon /></span>
          </button>
        </div>
      </div>
    </footer>
  )
}
