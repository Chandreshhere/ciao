import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// Fade + subtle rise on viewport entry. Fires once per element via
// `viewport.once`. The -80px margin makes the reveal trigger slightly
// before the element is fully in view, so it feels welcoming rather
// than reactive.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
