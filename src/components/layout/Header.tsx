import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

// Header — direct evolution of Navbar.tsx. Same hide-on-scroll behaviour,
// same transparent/white treatment, but anchor links become <NavLink>
// routes and the active route is marked with a gold underline that sweeps
// in on hover too.
//
// Mobile (<md): nav links collapse behind a hamburger button. Tapping it
// opens a full-screen blue drawer with the same routes, stacked large.
const NAV = [
  { to: '/creations', label: 'COLLECTION' },
  { to: '/menu', label: 'LA CARTE' },
  { to: '/the-chef', label: 'OUR STORY' },
  { to: '/order', label: 'RESERVE' },
] as const

export default function Header() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    // Don't hide the header while the mobile drawer is open — the X button
    // lives in the header row, so the row must stay visible.
    setHidden(latest > previous && latest > 150 && !menuOpen)
  })

  // Close the drawer whenever the route changes (NavLink click does this).
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock background scroll while the mobile drawer is open. Lenis listens
  // on window; toggling body.overflow is enough to freeze both Lenis and
  // native scroll under the overlay.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: '-110%' },
        }}
        initial="hidden"
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-16 md:py-6 bg-transparent text-white"
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-2">
          <Link to="/" className="group flex items-baseline gap-3 min-w-0">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="font-satt text-lg sm:text-xl md:text-3xl font-black tracking-tight uppercase whitespace-nowrap"
            >
              Ciao Patisserie
            </motion.span>
            <span className="hidden md:inline text-[10px] tracking-[0.3em] opacity-70 uppercase">
              · Sector 58, Gurgaon
            </span>
          </Link>

          {/* Desktop nav — untouched */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-[0.25em]">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className="relative group inline-flex flex-col items-center"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-90 group-hover:opacity-60'
                      }`}
                    >
                      {n.label}
                    </span>
                    <motion.span
                      aria-hidden
                      initial={false}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -bottom-2 left-0 right-0 h-[2px] origin-left bg-[#d4a64a]"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <button
              aria-label="Search"
              className="hidden md:flex w-10 h-10 items-center justify-center hover:opacity-60 transition-opacity"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Hamburger — mobile only. Animated to X when open. */}
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden relative h-11 w-11 flex items-center justify-center"
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-4 w-6">
                <motion.span
                  animate={
                    menuOpen
                      ? { rotate: 45, y: 7 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-0 h-[2px] w-full bg-white origin-center"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-white"
                />
                <motion.span
                  animate={
                    menuOpen
                      ? { rotate: -45, y: -7 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 bottom-0 h-[2px] w-full bg-white origin-center"
                />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer — full-screen brand-blue overlay with stacked links */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            // z-[45] sits ABOVE the DonutScene/HandScene (z-40/z-[35]) so
            // they don't bleed through the open drawer on Home, but stays
            // below the header (z-50) so the close button is still clickable.
            className="md:hidden fixed inset-0 z-[45] bg-[#157c99] flex flex-col"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <NavLink
                    to={n.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-satt text-[10vw] uppercase tracking-tighter text-[#FBF8EF] block text-center"
                  >
                    {({ isActive }) => (
                      <span
                        className={
                          isActive
                            ? 'border-b-2 border-[#d4a64a] pb-1'
                            : 'opacity-90'
                        }
                      >
                        {n.label}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="px-6 pb-10 text-center text-[10px] tracking-[0.3em] uppercase text-[#FBF8EF]/70"
            >
              Sector 58, Gurgaon · @ciao_patisserie
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
