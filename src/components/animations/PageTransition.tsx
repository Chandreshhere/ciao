import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

// Page entrance/exit choreography. Used at the root of every page
// component. The visual page-swap is owned by <CurtainOverlay /> in
// App.tsx — a solid blue panel that mounts covering the viewport on
// route change, so this wrapper only needs a subtle y-slide for the
// new page to feel "settled" once the curtain has revealed it.
//
// Important: we DO NOT fade pages with opacity any more. An opacity
// fade made pages briefly transparent, which let the fixed footer
// (z-0) show through during the swap on mobile. y-only animation
// keeps pages fully opaque end-to-end.
const variants: Variants = {
  initial: { y: 16 },
  animate: {
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.55, // wait for the curtain to start sliding off
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  // No exit animation — pages unmount instantly when their key changes;
  // the curtain is what the user sees during the swap.
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      variants={reduced ? undefined : variants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}
