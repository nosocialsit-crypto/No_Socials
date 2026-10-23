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

const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

export default function Services() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const heading = sectionRef.current.querySelector('.services-heading')
    const cards = sectionRef.current.querySelectorAll('.service-card')
    gsap.from(heading, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 85%' } })
    gsap.from(cards,   { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 85%' } })
  }, { scope: sectionRef })

  return (
    <section id="services" ref={sectionRef} className="bg-white" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
      <div style={pgStyle}>

        {/* heading */}
        <div className="services-heading" style={{ marginBottom: '2.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>
            What we do
          </p>
          <h2 className="font-black text-black leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Everything your social<br />
            presence <span className="brand-gradient-text">needs.</span>
          </h2>
        </div>

        {/* cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.25rem' }}>
          {services.map((s) => (
            <div
              key={s.number}
              className="service-card rounded-2xl cursor-default"
              style={{ border: '1.5px solid #E8E8E8', padding: '2.5rem' }}
            >
              <span className="brand-gradient-text font-bold tracking-widest" style={{ fontSize: '11px' }}>
                {s.number}
              </span>
              <h3 className="font-bold text-black" style={{ fontSize: '1.2rem', marginTop: '1.25rem', marginBottom: '0.75rem' }}>
                {s.title}
              </h3>
              <p className="text-gray-mid leading-relaxed" style={{ fontSize: '14px' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
