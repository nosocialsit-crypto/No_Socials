import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { whatsappLink } from '../config'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// placeholder plans and prices — swap for real ones before going live
const plans = [
  {
    badge: 'Most popular',
    label: 'Up to 1 hour shoot',
    name: 'Quick Reel',
    price: '₹1,999',
    per: '/reel', // one-off shoot, not monthly
    cta: 'Book Quick Reel',
    quote: 'For moments that deserve to be shared, instantly.',
    features: [
      'A focused shoot built around one key moment',
      'One polished, high-quality reel made for Instagram & social',
      'Trending audio, captions & smooth transitions',
      'Delivered fast, so your moment stays fresh',
      'Handled by trained Nosocials creators',
    ],
  },
  {
    badge: 'Best value',
    label: 'Per month',
    name: 'Starter',
    price: '₹14,999',
    quote: 'For brands ready to show up on social, consistently.',
    features: [
      '2 platforms managed',
      '12-15 posts every month',  
      '4-5 reels',
      '7-10 static post',
      '15-30 stories',
      'Captions & hashtag research',
      'Monthly performance report',
    ],
  },
  {
    badge: 'Premium',
    label: 'Starting at',
    name: 'Website & App Building',
    price: '₹6,999',
    per: '', // one-time project, not monthly
    cta: 'Build my site',
    quote: 'A fast, modern website or app built for your brand.',
    features: [
      'Custom UI/UX design',
      'Responsive website or mobile app',
      'SEO-ready & fast loading',
      'Contact forms & WhatsApp integration',
      'Hosting & domain setup (pricing excluded)',
      '1 month free support',
    ],
  },
]

const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

function Check({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ flex: 'none', marginTop: '1px' }}>
      <circle cx="9" cy="9" r="9" fill={active ? '#FFFFFF' : 'rgba(232, 38, 74, 0.12)'} />
      <path d="M5.5 9.2l2.3 2.3 4.7-4.9" fill="none" stroke="#E8264A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Pricing() {
  const sectionRef = useRef(null)
  const [selected, setSelected] = useState(1) // Starter (middle card) highlighted by default

  useGSAP(() => {
    const heading = sectionRef.current.querySelector('.pricing-heading')
    gsap.from(heading, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 85%' },
    })
    gsap.from('.price-card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      clearProps: 'all', // drop inline transforms after the fade-in so CSS hover works
      scrollTrigger: { trigger: '.pricing-grid', start: 'top 85%' },
    })
  }, { scope: sectionRef })

  return (
    <section id="pricing" ref={sectionRef} className="pricing-sec bg-white">
      <div style={pgStyle}>

        {/* heading */}
        <div className="pricing-heading text-center" style={{ marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>
            Pricing
          </p>
          <h2 className="font-black text-black leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Pick the plan that<br />
            fits your <span className="brand-gradient-text">growth.</span>
          </h2>
          <p className="text-gray-mid" style={{ fontSize: '15px', marginTop: '1rem' }}>
            Simple monthly pricing. No hidden charges, cancel anytime.
          </p>
        </div>

        {/* cards — click one to select it */}
        <div className="pricing-grid">
          {plans.map((p, i) => {
            const active = i === selected
            return (
              <div
                key={p.name}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(i)
                  }
                }}
                className={`price-card${active ? ' is-active' : ''}`}
              >
                <div className="price-card__badge">✦ {p.badge}</div>

                <div className="price-card__body">
                  <span className="price-card__label">{p.label}</span>
                  <h3 className="font-black" style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>
                    {p.name}
                  </h3>
                  <div className="font-black" style={{ fontSize: 'clamp(2.25rem, 3.5vw, 2.75rem)', marginTop: '1rem', lineHeight: 1 }}>
                    {p.price}
                    {(p.per ?? '/mo') && <span className="price-card__per">{p.per ?? '/mo'}</span>}
                  </div>
                  <p className="price-card__quote">“{p.quote}”</p>

                  <div className="price-card__divider" />

                  <ul className="price-card__list">
                    {p.features.map((f) => (
                      <li key={f}>
                        <Check active={active} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappLink(
                      p.per === ''
                        ? `Hi Nosocials! I'm interested in ${p.name} (starting at ${p.price}).`
                        : `Hi Nosocials! I'm interested in the ${p.name} plan (${p.price}${p.per ?? '/month'}).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="price-card__cta"
                  >
                    {p.cta ?? `Get ${p.name}`} <span className="price-card__arrow" aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* custom plan note */}
        <div className="pricing-note">
          Need something custom: a product launch, one-off campaign, or multiple brands?{' '}
          <a
            href={whatsappLink("Hi Nosocials! I'd like to discuss a custom plan.")}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient-text font-bold"
          >Talk to us →</a>
        </div>

      </div>
    </section>
  )
}
