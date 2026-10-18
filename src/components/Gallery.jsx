import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import 'gsap/EasePack'

gsap.registerPlugin(ScrollTrigger, Flip)

// placeholder images — swap for real assets before going live
const images = [
  'https://assets.codepen.io/16327/portrait-pattern-1.jpg',
  'https://assets.codepen.io/16327/portrait-image-12.jpg',
  'https://assets.codepen.io/16327/portrait-image-8.jpg',
  'https://assets.codepen.io/16327/portrait-pattern-2.jpg',
  'https://assets.codepen.io/16327/portrait-image-4.jpg',
  'https://assets.codepen.io/16327/portrait-image-3.jpg',
  'https://assets.codepen.io/16327/portrait-pattern-3.jpg',
  'https://assets.codepen.io/16327/portrait-image-1.jpg',
]

export default function Gallery() {
  const wrapRef = useRef(null)
  const galleryRef = useRef(null)

  useGSAP(() => {
    const gallery = galleryRef.current
    const items = gallery.querySelectorAll('.gallery__item')
    let flipCtx

    const build = () => {
      flipCtx?.revert()
      gallery.classList.remove('gallery--final')

      flipCtx = gsap.context(() => {
        // temporarily add the final class to capture the final state
        gallery.classList.add('gallery--final')
        const flipState = Flip.getState(items)
        gallery.classList.remove('gallery--final')

        const flip = Flip.to(flipState, { simple: true, ease: 'expoScale(1, 5)' })

        gsap.timeline({
          scrollTrigger: {
            trigger: gallery,
            start: 'center center',
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

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      flipCtx?.revert()
    }
  }, { scope: wrapRef })

  return (
    <div ref={wrapRef} className="gallery-wrap">
      <div ref={galleryRef} className="gallery gallery--bento">
        {images.map((src) => (
          <div key={src} className="gallery__item">
            <img src={src} alt="" loading="eager" />
          </div>
        ))}
      </div>
    </div>
  )
}
