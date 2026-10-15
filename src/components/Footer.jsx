const pgStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
  paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-black" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={pgStyle}>

        {/* top grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: '3rem', marginBottom: '4rem' }}
        >
          {/* brand */}
          <div>
            <img
              src="/logo.png"
              alt="Nosocials"
              className="brightness-0 invert"
              style={{ height: '2rem', width: 'auto', marginBottom: '1.5rem' }}
            />
            <p className="text-white leading-relaxed" style={{ fontSize: '14px', opacity: 0.45, maxWidth: '260px' }}>
              We manage your social media with strategy, creativity, and a little irony.
            </p>
          </div>

          {/* company */}
          <div>
            <p
              className="font-semibold tracking-widest uppercase text-gray-mid"
              style={{ fontSize: '11px', marginBottom: '1.25rem' }}
            >
              Company
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Services', 'About', 'Work'].map((item) => (
                <li key={item} style={{ marginBottom: '0.875rem' }}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-white hover:text-white transition-colors"
                    style={{ fontSize: '14px', opacity: 0.55, textDecoration: 'none' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <p
              className="font-semibold tracking-widest uppercase text-gray-mid"
              style={{ fontSize: '11px', marginBottom: '1.25rem' }}
            >
              Contact
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'nosocials.it@gmail.com', href: 'mailto:nosocials.it@gmail.com' },
                { label: 'Instagram', href: '#' },
                { label: 'LinkedIn', href: '#' },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: '0.875rem' }}>
                  <a
                    href={item.href}
                    className="text-white hover:text-white transition-colors"
                    style={{ fontSize: '14px', opacity: 0.55, textDecoration: 'none', wordBreak: 'break-all' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* bottom row */}
        <div
          className="flex flex-col md:flex-row justify-between items-center"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            gap: '1.5rem',
          }}
        >
          <p className="text-white" style={{ fontSize: '12px', opacity: 0.25 }}>
            © 2025 Nosocials. Ironically managing your socials.
          </p>
          <a
            href="mailto:nosocials.it@gmail.com"
            className="brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 32px', fontSize: '14px' }}
          >
            Start a project →
          </a>
        </div>

      </div>
    </footer>
  )
}
