import { useEffect } from 'react'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip Lenis on mobile — even with `smoothTouch: false`, Lenis still
    // intercepts scroll events, which on touch devices causes visible lag
    // between the finger position and the rendered scroll position, and
    // interferes with sticky / fixed elements (looks like "the layout is
    // shifting on drag"). On mobile we let the browser handle touch
    // scrolling natively; Lenis is purely a desktop wheel-smoothing thing.
    if (window.matchMedia('(max-width: 767px)').matches) return

    let lenisInstance: any = null

    const initLenis = async () => {
      const Lenis = (await import('lenis')).default
      lenisInstance = new Lenis({
        // Snappier than the Lenis default — shorter ease + a touch more travel
        // per wheel notch, so scrolling feels quicker without losing smoothing.
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.25,
      })

      function raf(time: number) {
        lenisInstance.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy()
      }
    }
  }, [])

  return <>{children}</>
}
