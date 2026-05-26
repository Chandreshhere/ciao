import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Brand-aligned initial page loader. Full-screen blue overlay with the
// Ciao wordmark in cream Apfel Grotezk; lifts out of view after ~2.2s,
// revealing the page underneath. The Hero's own entrance animations
// (text reveals + image fade) are timed so they play UNDER the loader
// as it's sliding away — feels like the page is being unveiled.
const DURATION_MS = 2200

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Lock background scroll while the loader is on screen so the
    // initial paint isn't disturbed by Lenis or wheel events.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setVisible(false), reduced ? 250 : DURATION_MS)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [reduced])

  // Restore scroll the moment the exit animation begins, so the page
  // is interactive while the overlay slides away.
  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.7, 0, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#157c99] text-[#FBF8EF]"
        >
          {/* Top tracked label with a gold accent dot */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="absolute top-10 flex items-center gap-3 md:top-14"
          >
            <span className="h-2 w-2 rounded-full bg-[#d4a64a]" />
            <span className="text-[10px] tracking-[0.45em] uppercase opacity-90">
              French Patisserie · Sector 58
            </span>
          </motion.div>

          {/* Main wordmark — rises from below an overflow clip */}
          <div className="overflow-hidden px-4">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="font-satt text-[34vw] md:text-[14vw] uppercase tracking-tighter leading-[0.85] text-center"
            >
              Ciao
            </motion.h1>
          </div>

          {/* Subline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 px-6 text-center"
          >
            <p className="text-[11px] md:text-sm tracking-[0.32em] uppercase opacity-90">
              Crafted in Paris · Made for You
            </p>
          </motion.div>

          {/* Bottom progress bar — fills across the visible duration */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: (DURATION_MS - 200) / 1000, ease: 'easeInOut' }}
            className="absolute bottom-16 h-[2px] w-32 origin-left bg-[#FBF8EF]/60"
          />

          {/* Bottom tracked label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute bottom-6 text-[9px] tracking-[0.4em] uppercase"
          >
            Loading
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
