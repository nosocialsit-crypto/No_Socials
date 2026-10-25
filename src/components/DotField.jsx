import { useEffect, useRef } from 'react'

// brand-coloured floating dots that drift constantly and push away from the cursor
const COLORS = [
  { rgb: '244, 123, 91', weight: 0.45 }, // coral
  { rgb: '232, 38, 74', weight: 0.35 },  // pink
  { rgb: '255, 255, 255', weight: 0.2 }, // soft white
]
const REPEL_RADIUS = 120
const LINK_RADIUS = 160

function pickColor() {
  let r = Math.random()
  for (const c of COLORS) {
    if ((r -= c.weight) <= 0) return c.rgb
  }
  return COLORS[0].rgb
}

export default function DotField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dots = []
    let frame = 0
    let visible = false
    const mouse = { x: -9999, y: -9999 }

    const makeDots = () => {
      const isMobile = width < 768
      const count = Math.min(isMobile ? 60 : 140, Math.round((width * height) / 9000))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        px: 0, // extra velocity from the cursor push
        py: 0,
        r: 1 + Math.random() * 1.5,
        color: pickColor(),
        alpha: 0.35 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeDots()
      if (reduceMotion) draw(0)
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height)

      for (const d of dots) {
        if (!reduceMotion) {
          // push away from the cursor
          const dx = d.x - mouse.x
          const dy = d.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < REPEL_RADIUS && dist > 0.1) {
            const force = (1 - dist / REPEL_RADIUS) * 1.2
            d.px += (dx / dist) * force
            d.py += (dy / dist) * force
          }
          d.px *= 0.9
          d.py *= 0.9
          d.x += d.vx + d.px
          d.y += d.vy + d.py

          // wrap around the edges
          if (d.x < -10) d.x = width + 10
          else if (d.x > width + 10) d.x = -10
          if (d.y < -10) d.y = height + 10
          else if (d.y > height + 10) d.y = -10
        }

        const twinkle = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(t * 0.002 + d.phase)
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.color}, ${d.alpha * twinkle})`
        ctx.fill()

        // faint coral line from the cursor to nearby dots
        if (!reduceMotion) {
          const ld = Math.hypot(d.x - mouse.x, d.y - mouse.y)
          if (ld < LINK_RADIUS) {
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(d.x, d.y)
            ctx.strokeStyle = `rgba(244, 123, 91, ${(1 - ld / LINK_RADIUS) * 0.25})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    const loop = (t) => {
      draw(t)
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (reduceMotion || frame) return
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    // only animate while the section is on screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(parent)

    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
