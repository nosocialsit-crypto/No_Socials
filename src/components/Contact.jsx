import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { whatsappLink, WHATSAPP_DISPLAY } from '../config'

gsap.registerPlugin(ScrollTrigger)

const EVENT_TYPES = [
  'Wedding / Pre-Wedding',
  'Engagement / Roka Ceremony',
  'Haldi / Mehendi',
  'Birthday / House Party',
  'Anniversary / Couple Shoot',
  'Baby Shower / Naming Ceremony',
  'College Event / Farewell',
  'Brand Launch / Product Launch',
  'Store Opening / Cafe Launch',
  'Car Delivery / Bike Delivery',
  'Corporate Event / Office Party',
  'Influencer Shoot / Content Day',
  'Personal Shoot / Lifestyle Shoot',
  'Festive Celebration / Family Function',
  'Concert / Live Event',
  'Club Event / Night Event',
  'Fashion Shoot / Portfolio Shoot',
  'Gym Shoot / Fitness Shoot',
  'Food Shoot / Restaurant Shoot',
  'Other',
]

const EMAIL = 'nosocials.in@gmail.com'

const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

// today's date as YYYY-MM-DD in local time (min value for the date picker)
function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function prettyDate(iso) {
  return new Date(`${iso}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Field({ label, required, full, children }) {
  return (
    <label className={`bk-field${full ? ' bk-full' : ''}`}>
      <span className="bk-label">
        {label} {required && <span className="bk-req">*</span>}
      </span>
      {children}
    </label>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)
  const [sent, setSent] = useState(false)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelectorAll('.bk-reveal'), {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
  }, { scope: sectionRef })

  const onSubmit = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const lines = [
      'Hi NoSocials! New enquiry from the website 👋',
      '',
      `Name: ${f.name.trim()}`,
      `Phone: ${f.phone.trim()}`,
      `Email: ${f.email.trim()}`,
      `Event type: ${f.eventType}`,
      `City: ${f.city.trim()}`,
      `Event date: ${prettyDate(f.eventDate)}`,
    ]
    if (f.reference.trim()) lines.push(`Reference: ${f.reference.trim()}`)
    if (f.notes.trim()) lines.push('', `Notes: ${f.notes.trim()}`)

    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <section id="book" ref={sectionRef} className="bk-sec bg-white">
      <div style={pgStyle} className="bk-grid">

        {/* left: pitch + direct contacts */}
        <div className="bk-reveal">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>Book a call</p>
          <h2 className="font-black text-black leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Let&apos;s make your brand<br />
            impossible to <span className="brand-gradient-text">scroll past.</span>
          </h2>
          <p className="text-gray-mid" style={{ fontSize: '15px', marginTop: '1rem', maxWidth: '420px', lineHeight: 1.6 }}>
            Tell us about your shoot or event. The form opens WhatsApp with everything filled in. Just hit send.
          </p>

          <div className="bk-contacts">
            <a href={`mailto:${EMAIL}`} className="bk-contact">
              <span className="bk-contact__icon brand-gradient"><MailIcon /></span>
              {EMAIL}
            </a>
            <a
              href={whatsappLink("Hi NoSocials! I'd like to know more about your services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bk-contact"
            >
              <span className="bk-contact__icon brand-gradient"><PhoneIcon /></span>
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        {/* right: enquiry form → WhatsApp */}
        <form className="bk-card bk-reveal" onSubmit={onSubmit}>
          <div className="bk-form-grid">
            <Field label="Your name" required>
              <input className="bk-input" name="name" type="text" placeholder="Full name" autoComplete="name" required />
            </Field>
            <Field label="Phone" required>
              <input
                className="bk-input"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                pattern="^\+?[0-9\s\-]{10,16}$"
                title="Enter a valid phone number (at least 10 digits)"
                required
              />
            </Field>
            <Field label="Email" required full>
              <input className="bk-input" name="email" type="email" placeholder="you@email.com" autoComplete="email" required />
            </Field>
            <Field label="Event type" required>
              <select className="bk-input bk-select" name="eventType" defaultValue="" required>
                <option value="" disabled>Select event type</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="City" required>
              <input className="bk-input" name="city" type="text" placeholder="Your city" autoComplete="address-level2" required />
            </Field>
            <Field label="Event date" required>
              <input className="bk-input" name="eventDate" type="date" min={todayISO()} required />
            </Field>
            <Field label="Reference link">
              <input className="bk-input" name="reference" type="url" placeholder="Instagram / Drive / Pinterest link" />
            </Field>
            <Field label="Anything else? (optional)" full>
              <textarea
                className="bk-input bk-textarea"
                name="notes"
                rows={3}
                placeholder="Venue, expected guest count, must-have shots, vibe references…"
              />
            </Field>
          </div>

          <div className="bk-actions">
            {sent && <p className="bk-sent">WhatsApp opened, just hit send ✓</p>}
            <button type="submit" className="bk-submit brand-gradient">
              Send on WhatsApp <SendIcon />
            </button>
          </div>
        </form>

      </div>
    </section>
  )
}
