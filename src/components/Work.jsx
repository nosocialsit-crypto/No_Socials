import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { tag: 'Instagram', title: 'KC International Cricket Bats', result: 'The power-hitting reels and content showcased our bats brilliantly, driving a massive spike in direct orders from players!', bg: '#FFF5F2', dark: false },
  { tag: 'Instagram', title: 'Brunè Café',                   result: 'Their aesthetic food reels and community engagement brought our cozy vibe straight to local feed screens, filling up our tables.', bg: '#FFF0F3', dark: false },
  { tag: 'Instagram', title: 'Urban Soffit',                 result: 'They captured our architectural designs with stunning precision, turning our projects into major talking points online.', bg: '#1A1A1A', dark: true },
  { tag: 'Instagram', title: 'Chai Kaapi Hinjewadi',         result: 'That single viral reel brought in a massive wave of chai lovers right through our doors. Absolutely stellar work!', bg: '#F5F5F5', dark: false },
  { tag: 'Instagram', title: 'Yash Dixit',                   result: 'The corporate event reel captured the exact energy and professionalism we wanted to project to our audience.', bg: '#FFF5F2', dark: false },
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
      clearProps: 'transform,opacity', // only drop the tween's styles; keeps each card's background colour
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
            className={`work-card rounded-2xl${p.dark ? ' is-dark' : ''}`}
            style={{ backgroundColor: p.bg }}
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
                className="leading-relaxed italic"
                style={{
                  fontSize: '15px',
                  color: p.dark ? 'rgba(255,255,255,0.7)' : '#6B6B6B',
                }}
              >
                “{p.result}”
              </p>
            </div>
            <div className="brand-gradient" style={{ width: '2rem', height: '1px', marginTop: '2rem' }} />
          </div>
        ))}
      </div>
    </section>
  )
}
