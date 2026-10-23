import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  const rowRef = useRef(null)

  // arrow buttons: move by one card
  const slide = (dir) => {
    const row = rowRef.current
    const card = row.querySelector('.work-card')
    const step = card ? card.offsetWidth + 20 : row.clientWidth * 0.8
    row.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  useGSAP(() => {
    const row = rowRef.current
    const heading = sectionRef.current.querySelector('.work-heading')

    gsap.from(heading, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 85%' },
    })
    gsap.from('.work-card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 85%' },
    })

    // mouse click-and-drag to scroll the row (touch and trackpads scroll natively)
    let dragging = false
    let startX = 0
    let startScroll = 0

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      startX = e.clientX
      startScroll = row.scrollLeft
      row.setPointerCapture(e.pointerId)
      row.classList.add('is-dragging') // turns off snapping while dragging
    }
    const onMove = (e) => {
      if (!dragging) return
      row.scrollLeft = startScroll - (e.clientX - startX)
    }
    const onUp = (e) => {
      if (!dragging) return
      dragging = false
      if (row.hasPointerCapture(e.pointerId)) row.releasePointerCapture(e.pointerId)
      row.classList.remove('is-dragging') // snaps to the nearest card
    }

    row.addEventListener('pointerdown', onDown)
    row.addEventListener('pointermove', onMove)
    row.addEventListener('pointerup', onUp)
    row.addEventListener('pointercancel', onUp)

    return () => {
      row.removeEventListener('pointerdown', onDown)
      row.removeEventListener('pointermove', onMove)
      row.removeEventListener('pointerup', onUp)
      row.removeEventListener('pointercancel', onUp)
    }
  }, { scope: sectionRef })

  return (
    <section id="work" ref={sectionRef} className="bg-white">

      {/* heading + arrows */}
      <div className="work-heading-wrap" style={pgStyle}>
        <div className="work-heading flex items-end justify-between gap-6">
          <div>
            <p
              className="eyebrow"
              style={{ marginBottom: '1rem' }}
            >
              Case studies
            </p>
            <h2 className="font-black text-black" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Results that <span className="brand-gradient-text">speak.</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button type="button" className="work-arrow" aria-label="Previous case study" onClick={() => slide(-1)}>←</button>
            <button type="button" className="work-arrow" aria-label="Next case study" onClick={() => slide(1)}>→</button>
          </div>
        </div>
      </div>

      {/* cards: scroll sideways by swipe, trackpad, drag or arrows */}
      <div ref={rowRef} className="work-row">
        {projects.map((p, i) => (
          <div
            key={i}
            className="work-card rounded-2xl"
            style={{
              backgroundColor: p.bg,
              border: '1.5px solid',
              borderColor: p.dark ? '#2e2e2e' : '#e8e8e8',
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
    </section>
  )
}
