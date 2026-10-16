import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { tag: 'Instagram',      title: 'Brew & Bloom',    result: '+42K followers in 3 months',    bg: '#FFF5F2', dark: false },
  { tag: 'TikTok',         title: 'Drift Apparel',   result: '1.2M views on launch reel',     bg: '#FFF0F3', dark: false },
  { tag: 'LinkedIn',       title: 'Stackr Finance',  result: '3× inbound leads from content', bg: '#1A1A1A', dark: true  },
  { tag: 'Multi-platform', title: 'Solara Skincare', result: '98% engagement rate increase',  bg: '#F5F5F5', dark: false },
  { tag: 'Instagram',      title: 'Kura Studios',    result: '0 to 25K in 60 days',           bg: '#FFF5F2', dark: false },
]

const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

export default function Work() {
  const sectionRef = useRef(null)
  const stripRef = useRef(null)

  useGSAP(() => {
    const strip = stripRef.current
    const heading = sectionRef.current.querySelector('.work-heading')

    gsap.from(heading, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 85%' },
    })

    const mm = gsap.matchMedia()

    // desktop: section pins while the strip slides.
    // tablet / mobile: no pin (it leaves a big empty screen) — the strip slides
    // as it scrolls past instead.
    mm.add({ isDesktop: '(min-width: 1024px)', isSmall: '(max-width: 1023px)' }, (ctx) => {
      const { isDesktop } = ctx.conditions
      const tween = gsap.to(strip, {
        x: () => -(strip.scrollWidth - strip.parentElement.offsetWidth),
        ease: 'none',
        scrollTrigger: isDesktop
          ? {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => '+=' + strip.scrollWidth,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            }
          : {
              trigger: strip,
              scrub: 1,
              start: 'top 85%',
              end: 'bottom 15%',
              invalidateOnRefresh: true,
            },
      })
      const st = tween.scrollTrigger

      // drag / swipe the strip: converts horizontal drag into page scroll,
      // so dragging and scrolling always drive the same position
      const pxPerScroll = () => (strip.scrollWidth - strip.parentElement.offsetWidth) / (st.end - st.start)
      const currentScroll = () => getLenis()?.scroll ?? window.scrollY
      const scrollToClamped = (target, opts) => {
        const current = currentScroll()
        // never scroll past the end of the strip, never pull the page back above it
        const clamped = gsap.utils.clamp(Math.min(current, st.start), Math.max(current, st.end), target)
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(clamped, opts)
        else window.scrollTo(0, clamped)
      }

      let dragging = false
      let lastX = 0
      let lastT = 0
      let velocity = 0

      const onDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        dragging = true
        lastX = e.clientX
        lastT = performance.now()
        velocity = 0
        strip.setPointerCapture(e.pointerId)
        strip.style.cursor = 'grabbing'
      }
      const onMove = (e) => {
        if (!dragging) return
        const now = performance.now()
        const dx = e.clientX - lastX
        velocity = dx / Math.max(1, now - lastT)
        lastX = e.clientX
        lastT = now
        scrollToClamped(currentScroll() - dx / pxPerScroll(), { immediate: true })
      }
      const onUp = (e) => {
        if (!dragging) return
        dragging = false
        strip.style.cursor = ''
        if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId)
        // flick: keep gliding in the drag direction
        if (e.type === 'pointerup' && Math.abs(velocity) > 0.2) {
          scrollToClamped(currentScroll() - (velocity * 300) / pxPerScroll(), { duration: 0.8 })
        }
      }

      strip.addEventListener('pointerdown', onDown)
      strip.addEventListener('pointermove', onMove)
      strip.addEventListener('pointerup', onUp)
      strip.addEventListener('pointercancel', onUp)

      return () => {
        strip.removeEventListener('pointerdown', onDown)
        strip.removeEventListener('pointermove', onMove)
        strip.removeEventListener('pointerup', onUp)
        strip.removeEventListener('pointercancel', onUp)
      }
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section id="work" ref={sectionRef} className="bg-white">

      {/* heading */}
      <div className="work-heading-wrap" style={pgStyle}>
        <div className="work-heading">
          <p
            className="font-semibold tracking-widest uppercase text-gray-mid"
            style={{ fontSize: '11px', marginBottom: '1rem' }}
          >
            Case studies
          </p>
          <h2 className="font-black text-black" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Results that <span className="brand-gradient-text">speak.</span>
          </h2>
        </div>
      </div>

      {/* horizontal strip: pinned scroll on desktop, native swipe on smaller screens */}
      <div className="work-strip-wrap">
        <div
          ref={stripRef}
          className="work-strip"
          style={{
            display: 'flex',
            gap: '1.25rem',
            width: 'max-content',
            alignItems: 'stretch',
            paddingLeft: 'max(1.5rem, calc((100vw - 1200px) / 2 + clamp(1.5rem, 5vw, 5rem)))',
            paddingRight: '4rem',
          }}
        >
          {projects.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl"
              style={{
                backgroundColor: p.bg,
                border: '1.5px solid',
                borderColor: p.dark ? '#2e2e2e' : '#e8e8e8',
                width: '300px',
                minHeight: '320px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  className="font-bold tracking-widest uppercase"
                  style={{ fontSize: '11px', color: p.dark ? '#666' : '#9A9A9A' }}
                >
                  {p.tag}
                </span>
                <h3
                  className="font-black leading-tight"
                  style={{
                    fontSize: '1.5rem',
                    marginTop: '1.25rem',
                    marginBottom: '0.75rem',
                    color: p.dark ? '#FFFFFF' : '#1A1A1A',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: '14px',
                    color: p.dark ? 'rgba(255,255,255,0.55)' : '#9A9A9A',
                  }}
                >
                  {p.result}
                </p>
              </div>
              <div className="brand-gradient" style={{ width: '2rem', height: '1px', marginTop: '2rem' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
