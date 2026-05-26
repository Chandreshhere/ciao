import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

// Page entrance/exit choreography. Used at the root of every page
// component. AnimatePresence in App.tsx coordinates the swap so the
// outgoing page lifts away as the incoming page rises in.
const variants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] },
  },
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      variants={reduced ? undefined : variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
