import { useRef, useEffect } from 'react'

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeIn = (t: number) => t * t * t

// The "come here" hand for the pinned section after the hero — scroll-driven:
//   2vh  -> 2.5vh — slides in from off-screen-right (eased, unhurried).
//   2.5vh -> 3.3vh — holds, beckoning (a good, long hold).
//   3.3vh -> 3.7vh — slides back out to the right.
// It shows on every DOWNWARD pass through the section; scrolling up keeps it
// hidden (scroll back up and down again and it plays once more).
export default function HandScene() {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastY = window.scrollY
    let scrollingDown = true

    const compute = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const y = window.scrollY

      const slideIn = easeOut(clamp((y - 2 * vh) / (0.5 * vh), 0, 1))
      const slideOut = easeIn(clamp((y - 3.3 * vh) / (0.4 * vh), 0, 1))

      // Off-screen-right before sliding in and after sliding back out.
      const slideX = (1 - slideIn + slideOut) * vw * 0.8
      const opacity = clamp(slideIn, 0, 1) * (1 - slideOut)

      // Show the hand only while scrolling DOWN — every downward pass plays it
      // again; scrolling up keeps it hidden.
      const visible = scrollingDown && y > 1.5 * vh && slideOut < 1

      const el = innerRef.current
      if (el) {
        el.style.transform = `translateX(${slideX}px)`
        el.style.opacity = String(opacity)
        el.style.display = visible ? 'block' : 'none'
      }
    }

    const onScroll = () => {
      const y = window.scrollY
      scrollingDown = y > lastY
      lastY = y
      compute()
    }

    compute() // sync initial state (e.g. on refresh mid-page)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
    }
  }, [])

  return (
    // Fixed layer near the right edge. z-[35] sits above the pinned section's
    // box (z-30) so the hand is never hidden behind it, but still below the
    // donut (z-40) and the navbar (z-50).
    <div className="pointer-events-none fixed left-[91%] top-1/2 z-[35] h-[clamp(500px,58vw,900px)] w-[clamp(440px,50vw,760px)] -translate-x-1/2 -translate-y-1/2">
      <div ref={innerRef} className="h-full w-full opacity-0 will-change-transform">
        <iframe
          src="/hand/hand-widget.html?pose=beckon&roty=90"
          title="Come here — 3D hand"
          className="h-full w-full -rotate-90 -scale-x-100 border-0 bg-transparent"
        />
      </div>
    </div>
  )
}
