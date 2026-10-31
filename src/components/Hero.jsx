import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const headline = ['We run', 'your socials.', 'Ironically.']

// scroll-animation values per device (laptop values are the originals)
//   end: pin length · swipe: slide distance in px · blur: px (0 = none, smoother on phones)
//   wordGap: space above "Ironically." once it has risen, and between it and the paragraph
//   wordStart: when "Ironically." starts rising (later = "your socials." has cleared further)
const HERO_DESK = { end: '+=150%', swipe: 220, blur: 14, wordGap: 40, wordStart: 0.45 }
const HERO_TAB = { end: '+=130%', swipe: 160, blur: 10, wordGap: 32, wordStart: 0.55 }
const HERO_PHONE = { end: '+=110%', swipe: 110, blur: 0, wordGap: 24, wordStart: 0.65 }

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

    // same animation everywhere, tuned per device
    mm.add({
      desk: '(min-width: 1024px)',
      tab: '(min-width: 768px) and (max-width: 1023px)',
      motion: '(prefers-reduced-motion: no-preference)',
    }, (ctx) => {
      const { desk, tab, motion } = ctx.conditions

      // reduced motion: no pin, the panel just fades up below the heading
      if (!motion) {
        gsap.from(panelItems, {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 85%' },
        })
        return
      }

      const S = desk ? HERO_DESK : tab ? HERO_TAB : HERO_PHONE
      const blurOut = S.blur ? `blur(${S.blur}px)` : 'blur(0px)'
      const stage = containerRef.current.querySelector('.hero-stage')
      const word = rows[rows.length - 1] // "Ironically." stays and rises to the top
      const outgoing = [badgeRef.current, ...[...rows].slice(0, -1), subRef.current, ctaRef.current]
      const NAV_H = 73
      const WORD_TOP = NAV_H + S.wordGap // where the word ends up, measured from the top of the pinned screen

      // offsetTop ignores transforms, so these stay correct mid-animation
      let rise = 0
      const measure = () => {
        const wordTop = stage.offsetTop + word.offsetTop
        rise = WORD_TOP - wordTop
        // start the panel just under the raised word. `top` (not padding) because on tall
        // phones/tablets the value is negative — the heading block sits lower than the target
        const panelTop = WORD_TOP + word.offsetHeight + S.wordGap - stage.offsetTop
        panel.style.top = `${panelTop}px`
        panel.style.bottom = 'auto'
        // empty space left under the buttons when the hero unpins — Services pulls itself
        // up by this much (see .svc-sec in index.css) so there's no big white gap
        const buttonsBottom = stage.offsetTop + panelTop + panel.offsetHeight
        const blank = Math.max(0, containerRef.current.offsetHeight - buttonsBottom - 48)
        document.documentElement.style.setProperty('--hero-blank', `${blank}px`)
      }
      measure()
      ScrollTrigger.addEventListener('refreshInit', measure)

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: S.end,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      scrollTl
        .fromTo(outgoing,
          { x: 0, opacity: 1, filter: 'blur(0px)' },
          { x: -S.swipe, opacity: 0, filter: blurOut, stagger: 0.12, ease: 'power2.in', immediateRender: false },
        )
        .fromTo(word,
          { y: 0 },
          { y: () => rise, duration: 0.9, ease: 'power2.inOut', immediateRender: false },
          S.wordStart, // start once "your socials." has mostly cleared, so they don't overlap
        )
        .set(panel, { autoAlpha: 1 }, '-=0.35')
        .fromTo(panelItems,
          { x: S.swipe, opacity: 0, filter: blurOut },
          { x: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'power2.out' },
          '<',
        )
        .to({}, { duration: 0.4 }) // short rest before the pin releases

      // wipe everything the timeline touched, so the next screen size starts clean
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', measure)
        panel.style.top = ''
        panel.style.bottom = ''
        document.documentElement.style.removeProperty('--hero-blank')
        gsap.set([...outgoing, word, ...panelItems], { clearProps: 'transform,opacity,filter' })
        gsap.set(panel, { clearProps: 'opacity,visibility' })
      }
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
            Brand Strategist
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
