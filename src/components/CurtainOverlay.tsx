import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Page-change curtain. On every route change after the initial mount, a
// solid blue panel snaps into the covering position (y:0%) the SAME
// render the route changes — covering the whole viewport so the page
// swap underneath is fully hidden, with no frame-delay flash of the
// fixed footer. It then holds covering briefly and slides up off the
// top, revealing the new page.
//
// Critical: we detect the navigation during render (ref mutation)
// instead of useEffect, so the curtain motion.div is mounted in the
// same render that the routes change. With useEffect there's a one-
// frame gap where the route has changed but the curtain hasn't yet
// mounted, and the footer flashes through.
export default function CurtainOverlay() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const hasNavigated = useRef(false)
  const lastPath = useRef(location.pathname)

  // Synchronous navigation detection — runs during render.
  // Strict Mode double-render is fine: setting `true` is idempotent.
  if (lastPath.current !== location.pathname) {
    lastPath.current = location.pathname
    hasNavigated.current = true
  }

  if (!hasNavigated.current) return null

  const slideDur = reduced ? 0.35 : 0.55
  const holdDur = reduced ? 0.2 : 0.55

  return (
    <motion.div
      key={location.pathname}
      // Mount AT covering position so the page swap underneath is
      // hidden from frame one (no flash).
      initial={{ y: '0%' }}
      // Hold for `holdDur` (via the delay), then slide up off the top
      // over `slideDur`. Total time on-screen: holdDur + slideDur.
      animate={{ y: '-110%' }}
      transition={{
        duration: slideDur,
        delay: holdDur,
        ease: [0.7, 0, 0.3, 1],
      }}
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-[#157c99]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
        transition={{
          duration: holdDur + slideDur,
          times: [0, 0.2, 0.6, 1],
          ease: 'easeInOut',
        }}
        className="text-center text-[#FBF8EF]"
      >
        <span className="block font-satt text-[26vw] md:text-[11vw] uppercase tracking-tighter leading-[0.85]">
          Ciao
        </span>
        <span className="mt-2 inline-block text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-80">
          Patisserie
        </span>
      </motion.div>
    </motion.div>
  )
}
