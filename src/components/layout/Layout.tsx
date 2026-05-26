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
          Mobile gets a much taller reservation (110vh) so the last section
          (newsletter, etc.) scrolls fully off-screen BEFORE the user
          enters the footer's reveal window — leaving the Ciao reveal to
          play in a clean, standalone footer view, like desktop. Desktop's
          original 50vh reservation is preserved via md:mb-[50vh]. */}
      <main className="relative z-10 mb-[110vh] md:mb-[50vh]">
        <Outlet />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
