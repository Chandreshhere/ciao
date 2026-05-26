import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Jumps to the top of the page on every pathname change. 'instant' is
// deliberate — a smooth scroll would race the page-transition fade and
// feel jittery. Lenis listens on window, so this works for both Lenis
// and native scroll behaviour.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
