import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Page-change curtain. On every route change after the initial mount, a
// blue (#157c99) panel sweeps up across the viewport — covering the page
// during the AnimatePresence exit/enter gap so the fixed footer never
// flashes through. A "Ciao" wordmark sits centred in the panel for brand
// polish during the sweep.
export default function CurtainOverlay() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const [show, setShow] = useState(false)
  const [isFirst, setIsFirst] = useState(true)

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false)
      return
    }
    setShow(true)
    const t = setTimeout(() => setShow(false), reduced ? 350 : 1100)
    return () => clearTimeout(t)
    // location.pathname is the trigger; isFirst tracks initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: reduced ? 0.3 : 1.0, ease: [0.7, 0, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-[#157c99]"
        >
          {/* Inner content: brand wordmark with its own fade so it pops
              in the middle of the sweep and doesn't feel like a flat panel. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
            transition={{ duration: 1.0, times: [0, 0.25, 0.75, 1], ease: 'easeInOut' }}
            className="text-center text-[#FBF8EF]"
          >
            <span className="block font-satt text-[26vw] md:text-[11vw] uppercase tracking-tighter leading-[0.85]">
              Ciao
            </span>
            <span className="mt-3 inline-block text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-80">
              Patisserie
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
