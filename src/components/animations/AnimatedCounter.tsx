import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

// Counts up from 0 to `to` over `duration` once the element enters the
// viewport. Eased with a cubic-out so the last increments settle rather
// than stop. Short-circuits to the final number under reduced-motion.
export default function AnimatedCounter({
  to,
  duration = 1400,
  className,
}: {
  to: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? to : 0)

  useEffect(() => {
    if (!isInView || reduced) return
    let start: number | null = null
    let raf = 0
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.floor(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setN(to)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, reduced, to, duration])

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  )
}
