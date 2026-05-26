import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ScrollToTop from '@/components/layout/ScrollToTop'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Creations from '@/pages/Creations'
import Menu from '@/pages/Menu'
import TheChef from '@/pages/TheChef'
import Order from '@/pages/Order'
import NotFound from '@/pages/NotFound'
import DonutScene from '@/components/DonutScene'
import HandScene from '@/components/HandScene'
import PageLoader from '@/components/PageLoader'
import CurtainOverlay from '@/components/CurtainOverlay'

export default function App() {
  const location = useLocation()
  // 3D donut + hand are fixed-position z-40 layers. They must live OUTSIDE
  // Layout's `<main class="relative z-10">` wrapper or that stacking
  // context caps their z-index. Mounting them at App.tsx level, gated by
  // pathname, keeps them only on Home and out of the main stacking
  // context everywhere.
  const isHome = location.pathname === '/'

  return (
    <>
      <PageLoader />
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="creations" element={<Creations />} />
            <Route path="menu" element={<Menu />} />
            <Route path="the-chef" element={<TheChef />} />
            <Route path="order" element={<Order />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
      {/* Sweeps up across the viewport on every route change, hiding the
          underlying page swap (and the footer that would otherwise flash). */}
      <CurtainOverlay />
      {isHome && (
        <>
          <DonutScene />
          <HandScene />
        </>
      )}
    </>
  )
}
