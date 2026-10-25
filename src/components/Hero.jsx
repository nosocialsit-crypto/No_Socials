import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const headline = ['We run', 'your socials.', 'Ironically.']

function HeroButtons() {
  return (
    <>
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
    </>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const badgeRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const panelRef = useRef(null)

  useGSAP(() => {
    const lines = containerRef.current.querySelectorAll('.hero-line')
    const rows = containerRef.current.querySelectorAll('.hero-row')
    const panel = panelRef.current
    const panelItems = panel.children

    // load-in
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

    const mm = gsap.matchMedia()

    // desktop: pin the hero, swipe the heading out left, bring the panel in from the right
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = containerRef.current.querySelector('.hero-stage')
      const word = rows[rows.length - 1] // "Ironically." stays and rises to the top
      const outgoing = [badgeRef.current, ...[...rows].slice(0, -1), subRef.current, ctaRef.current]
      const NAV_H = 73
      const WORD_TOP = NAV_H + 40 // where the word ends up, measured from the top of the pinned screen

      // offsetTop ignores transforms, so these stay correct mid-animation
      let rise = 0
      const measure = () => {
        const wordTop = stage.offsetTop + word.offsetTop
        rise = WORD_TOP - wordTop
        // start the panel just under the raised word
        panel.style.paddingTop = `${WORD_TOP + word.offsetHeight + 40 - stage.offsetTop}px`
      }
      measure()
      ScrollTrigger.addEventListener('refreshInit', measure)

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      scrollTl
        .fromTo(outgoing,
          { x: 0, opacity: 1, filter: 'blur(0px)' },
          { x: -220, opacity: 0, filter: 'blur(14px)', stagger: 0.12, ease: 'power2.in', immediateRender: false },
        )
        .fromTo(word,
          { y: 0 },
          { y: () => rise, duration: 0.9, ease: 'power2.inOut', immediateRender: false },
          0.45, // start once "your socials." has mostly cleared, so they don't overlap
        )
        .set(panel, { autoAlpha: 1 }, '-=0.35')
        .fromTo(panelItems,
          { x: 220, opacity: 0, filter: 'blur(14px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'power2.out' },
          '<',
        )
        .to({}, { duration: 0.4 }) // short rest before the pin releases

      // wipe everything the timeline touched, so a smaller screen gets a clean layout
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', measure)
        panel.style.paddingTop = ''
        gsap.set([...outgoing, word, ...panelItems], { clearProps: 'transform,opacity,filter' })
        gsap.set(panel, { clearProps: 'opacity,visibility' })
      }
    })

    // mobile / tablet: no pin, the panel just fades up below the heading
    mm.add('(max-width: 1023px)', () => {
      gsap.from(panelItems, {
        y: 30, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 85%' },
      })
    })

    return () => mm.revert()
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

      <div className="hero-stage pg relative z-10 w-full">
        <div className="flex flex-col items-center gap-8 text-center w-full">
          <span
            ref={badgeRef}
            className="eyebrow"
          >
            Social Media Agency
          </span>

          <h1
            className="font-black leading-[1.05] tracking-tight text-black w-full"
            style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6rem)' }}
          >
            {headline.map((line, i) => (
              <span
                key={i}
                className="hero-row overflow-hidden block"
                style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
              >
                <span className="hero-line inline-block">
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
            className="text-base md:text-lg text-gray-mid max-w-lg leading-relaxed"
          >
            Managing social media so you don't have to think about it — while
            actually growing your audience.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-center">
            <HeroButtons />
          </div>
        </div>

        {/* slides in from the right after the heading swipes out (desktop) */}
        <div ref={panelRef} className="hero-panel">
          <p
            className="font-bold text-black leading-snug"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', maxWidth: '900px' }}
          >
            We plan, create and post content that makes people{' '}
            <span className="brand-gradient-text">stop scrolling</span> — so your brand{' '}
            <span className="brand-gradient-text">grows</span> while you focus on running it.
          </p>
          {/* desktop only — on smaller screens the buttons above are already visible */}
          <div className="hero-panel__cta flex flex-col sm:flex-row gap-4 items-center">
            <HeroButtons />
          </div>
        </div>
      </div>
    </section>
  )
}
