import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '50+', label: 'Brands managed' },
  { value: '3.2M', label: 'Followers grown' },
  { value: '98%',  label: 'Client retention' },
]

const lines = [
  'We started Nosocials because we were tired of brands treating social media like a checkbox.',
  'Every post, reel, and story we make is built around one thing — your audience actually caring.',
  'No fluff. No vanity metrics. Just real growth, done with intention.',
]

const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

export default function About() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)

  useGSAP(() => {
    const textLines = pinRef.current.querySelectorAll('.about-line')
    const statsEls  = pinRef.current.querySelectorAll('.about-stat')

    const tl = gsap.timeline({
      scrollTrigger: { trigger: pinRef.current, start: 'top top', end: '+=700', scrub: 1, pin: true, anticipatePin: 1 },
    })
    tl.from(textLines, { y: 40, opacity: 0, stagger: 0.35, ease: 'power2.out' })
      .from(statsEls,  { y: 30, opacity: 0, stagger: 0.2,  ease: 'power2.out' }, '-=0.3')
  }, { scope: sectionRef })

  return (
    <section id="about" ref={sectionRef} className="bg-black">
      <div
        ref={pinRef}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}
      >
        <div style={pgStyle}>

          <p className="font-semibold tracking-widest uppercase text-gray-mid" style={{ fontSize: '11px', marginBottom: '2.5rem' }}>
            Our story
          </p>

          <div style={{ marginBottom: '4rem' }}>
            {lines.map((line, i) => (
              <p
                key={i}
                className="about-line font-bold text-white leading-snug"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)', marginBottom: '1.75rem' }}
              >
                {line}
              </p>
            ))}
          </div>

          <div
            className="grid grid-cols-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', gap: '2rem' }}
          >
            {stats.map((s) => (
              <div key={s.label} className="about-stat">
                <p className="font-black brand-gradient-text" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  {s.value}
                </p>
                <p className="text-gray-mid" style={{ fontSize: '13px', marginTop: '0.5rem' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
