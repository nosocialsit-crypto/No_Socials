import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const headline = ['We run', 'your socials.', 'Ironically.']

export default function Hero() {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const badgeRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)

  useGSAP(() => {
    const lines = containerRef.current.querySelectorAll('.hero-line')
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.6 })
      .from(lines, { y: 90, opacity: 0, stagger: 0.14, duration: 0.9 }, '-=0.2')
      .from(subRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
      .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')

    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="hero-sec relative flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(244,123,91,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="pg relative z-10 flex flex-col items-center text-center w-full">
        <span
          ref={badgeRef}
          className="inline-flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-gray-mid mb-10"
        >
          Social Media Agency
          <span className="w-8 h-px brand-gradient inline-block" />
        </span>

        <h1 className="font-black leading-[1.05] tracking-tight text-black mb-8 w-full">
          {headline.map((line, i) => (
            <span key={i} className="overflow-hidden block">
              <span
                className="hero-line inline-block"
                style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6rem)' }}
              >
                {i === 2 ? (
                  <span className="brand-gradient-text">{line}</span>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="text-base md:text-lg text-gray-mid max-w-md leading-relaxed mb-10"
        >
          Managing social media so you don't have to think about it — while
          actually growing your audience.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#services"
            className="brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 40px', fontSize: '15px' }}
          >
            See what we do
          </a>
          <a
            href="#work"
            className="text-black font-semibold rounded-full transition-colors hover:border-coral"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 40px', fontSize: '15px', border: '2px solid rgba(26,26,26,0.12)' }}
          >
            View our work
          </a>
        </div>
      </div>

      {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 brand-gradient" />
      </div> */}
    </section>
  )
}
