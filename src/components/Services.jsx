import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { number: '01', title: 'Content Creation',     desc: 'Scroll-stopping visuals, captions, and reels crafted for your brand voice.' },
  { number: '02', title: 'Strategy & Growth',    desc: 'Data-backed plans that turn followers into customers, consistently.' },
  { number: '03', title: 'Community Management', desc: 'We respond, engage, and build relationships — daily, in your tone.' },
  { number: '04', title: 'Paid Social Ads',      desc: 'Targeted campaigns across Instagram, TikTok, and LinkedIn that convert.' },
]

export default function Services() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(() => {
    const heading = sectionRef.current.querySelector('.svc-heading')
    const track = trackRef.current
    const cards = track.querySelectorAll('.svc-card')

    gsap.from(heading, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })

    const mm = gsap.matchMedia()

    // heading stays fixed, cards rise over it in a zigzag; sizes come from CSS per device
    mm.add({
      phone: '(max-width: 767px)',
      motion: '(prefers-reduced-motion: no-preference)',
    }, (ctx) => {
      const { phone, motion } = ctx.conditions

      // reduced motion: plain grid with a fade-up
      if (!motion) {
        gsap.from(cards, {
          y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: track, start: 'top 85%' },
        })
        return
      }

      // phones get a shorter pin, so it's fewer swipes to get through
      const pinScreens = phone ? 0.6 : 1

      gsap.fromTo(track,
        { y: () => window.innerHeight },
        {
          y: () => -track.offsetHeight,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * pinScreens + track.offsetHeight}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      )
      // clear the track's offset so the next screen size starts clean
      return () => gsap.set(track, { clearProps: 'transform' })
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section id="services" ref={sectionRef} className="svc-sec">
      <div className="svc-stage">

        {/* big heading — stays put in the background on desktop */}
        <div className="svc-heading pg">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>
            What we do
          </p>
          <h2 className="svc-title font-black text-black leading-tight">
            Everything your social<br />
            presence <span className="brand-gradient-text">needs.</span>
          </h2>
        </div>

        {/* cards — rise over the heading, alternating left and right */}
        <div ref={trackRef} className="svc-track pg">
          {services.map((s) => (
            <div key={s.number} className="svc-card">
              <span className="svc-num brand-gradient">{s.number}</span>
              <h3 className="font-bold text-black" style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                {s.title}
              </h3>
              <p className="text-gray-mid leading-relaxed" style={{ fontSize: '15px' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
