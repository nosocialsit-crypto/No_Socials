import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import 'gsap/EasePack'

gsap.registerPlugin(ScrollTrigger, Flip)

// gallery media (compressed; raw files live in /media-originals)
const CENTRE = 'centre' // the tile that fills the screen first
// the centre video differs by device: laptop/desktop vs mobile + tablet
const CENTRE_LAPTOP = '/centre1.mp4'
const CENTRE_MOBILE = '/centremob.mp4'
const LAPTOP_QUERY = '(min-width: 1024px)'
const images = [
  '/bike.webp',
  // '/r15.webp',
  '/coffee1.mp4',
  CENTRE,
  '/bts.mp4',
  '/cardimg.webp',
  '/phonescroll.mp4',
  '/eyes.mp4',
  '/gif1.mp4',
]
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src)

export default function Gallery() {
  const wrapRef = useRef(null)
  const galleryRef = useRef(null)
  const hintRef = useRef(null)
  const [isLaptop, setIsLaptop] = useState(() => window.matchMedia(LAPTOP_QUERY).matches)

  // switch the centre video when the screen crosses the laptop breakpoint (e.g. tablet rotation)
  useEffect(() => {
    const mq = window.matchMedia(LAPTOP_QUERY)
    const onChange = (e) => setIsLaptop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useGSAP(() => {
    const gallery = galleryRef.current
    const items = gallery.querySelectorAll('.gallery__item')
    let flipCtx

    const build = () => {
      flipCtx?.revert()
      // resting layout is full-screen; scrolling shrinks it into the bento grid
      gallery.classList.add('gallery--final')

      flipCtx = gsap.context(() => {
        // temporarily drop the final class to capture the bento grid as the target
        gallery.classList.remove('gallery--final')
        const flipState = Flip.getState(items)
        gallery.classList.add('gallery--final')

        const flip = Flip.to(flipState, { simple: true, ease: 'expoScale(5, 1)' })

        gsap.timeline({
          scrollTrigger: {
            trigger: gallery,
            // pin just below the fixed navbar so it never covers the gallery
            start: () => `top ${document.querySelector('nav')?.offsetHeight ?? 0}px`,
            end: '+=100%',
            scrub: true,
            pin: wrapRef.current,
            refreshPriority: 1,
          },
        }).add(flip)

        return () => gsap.set(items, { clearProps: 'all' })
      })
    }

    build()

    // "Scroll" hint fades out over the first ~120px of scrolling, returns at the top
    gsap.to(hintRef.current, {
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { start: 0, end: 120, scrub: true },
    })

    // rebuild on width changes only — mobile address bars fire height-only resizes constantly
    let lastWidth = window.innerWidth
    let timer
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      clearTimeout(timer)
      timer = setTimeout(build, 200)
    }
    window.addEventListener('resize', onResize)

    // only play videos while they're on screen (saves CPU and battery)
    const visible = new Set()
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          visible.add(target)
          if (target.src) target.play().catch(() => {})
        } else {
          visible.delete(target)
          target.pause()
        }
      })
    })
    gallery.querySelectorAll('video').forEach((v) => io.observe(v))

    // the other tiles start off-screen, so fetch their media only once the visitor scrolls
    const loadRest = () => {
      gallery.querySelectorAll('[data-src]').forEach((el) => {
        el.src = el.dataset.src
        el.removeAttribute('data-src')
        if (el.tagName === 'VIDEO' && visible.has(el)) el.play().catch(() => {})
      })
    }
    if (window.scrollY > 0) loadRest()
    else window.addEventListener('scroll', loadRest, { passive: true, once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', loadRest)
      io.disconnect()
      flipCtx?.revert()
    }
  }, { scope: wrapRef })

  return (
    <div ref={wrapRef} className="gallery-wrap">
      <div ref={galleryRef} className="gallery gallery--bento gallery--final">
        {images.map((src) => (
          <div key={src} className="gallery__item">
            {src === CENTRE ? (
              // muted + playsInline are required for autoplay on mobile
              <video
                src={isLaptop ? CENTRE_LAPTOP : CENTRE_MOBILE}
                poster={isLaptop ? '/centre1-poster.webp' : '/centremob-poster.webp'}
                autoPlay loop muted playsInline preload="auto" />
            ) : isVideo(src) ? (
              <video data-src={src} loop muted playsInline preload="auto" />
            ) : (
              <img data-src={src} alt="" decoding="async" />
            )}
          </div>
        ))}
      </div>
      {/* tells first-time visitors there's more below the full-screen video */}
      <div ref={hintRef} className="scroll-hint" aria-hidden="true">
        Scroll
        <svg className="scroll-hint__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}
