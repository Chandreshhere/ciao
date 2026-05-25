import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  // Hide the bar when scrolling down, bring it back when scrolling up — it
  // stays floating (fixed) over the page either way.
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    // Past a small threshold, hide on downward scroll, reveal on upward scroll.
    setHidden(latest > previous && latest > 150)
  })

  return (
    // Always transparent with white text — it never switches to a white
    // background on scroll.
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-110%' },
      }}
      initial="hidden"
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-16 py-6 bg-transparent text-white"
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold tracking-tight"
        >
          CIAO PATISSERIE
        </motion.div>

        <div className="hidden md:flex items-center gap-12 text-xl font-medium tracking-wide">
          <a href="#menu" className="hover:opacity-60 transition-opacity">
            MENU
          </a>
          <a href="#creations" className="hover:opacity-60 transition-opacity">
            CREATIONS
          </a>
          <a href="#about" className="hover:opacity-60 transition-opacity">
            THE CHEF
          </a>
          <a href="#order" className="hover:opacity-60 transition-opacity">
            ORDER
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
