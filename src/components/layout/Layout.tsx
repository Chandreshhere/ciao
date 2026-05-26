import { Outlet } from 'react-router-dom'
import SmoothScroll from '@/components/SmoothScroll'
import Header from './Header'
import Footer from '@/components/Footer'

// Shared chrome for every route. SmoothScroll mounts once and persists
// across route changes (Layout is the parent route element). The fixed
// Footer reveals from beneath the scrolling content on each page — the
// `mb-[50vh]` on the wrapper carves out enough scroll room for the
// wordmark to rise into place at the bottom.
export default function Layout() {
  return (
    <SmoothScroll>
      <Header />
      {/* mb on main reserves scroll room for the fixed footer to reveal.
          Mobile gets a much taller reservation (110dvh) so the last
          section scrolls fully off-screen BEFORE the user enters the
          footer's reveal window. `dvh` (vs vh) tracks the dynamic
          viewport so the reservation doesn't jump when the mobile
          address bar shows/hides. Desktop's original 50vh preserved. */}
      <main className="relative z-10 mb-[110dvh] md:mb-[50vh]">
        <Outlet />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
