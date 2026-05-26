import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import FooterDonut from './FooterDonut'

// Footer is fixed to the bottom of the viewport at a LOW z-index, so the
// main content above (wrapped in App.tsx with a higher z-index + opaque
// background) physically slides off it on scroll — revealing this footer
// as if it had been waiting underneath the page all along.

export default function Footer() {
  // CIAO is always visible. As the page is scrolled toward its end,
  // CIAO rises up from the bottom of the footer to its actual layout
  // position. Pure translate — no opacity change. Same on mobile and
  // desktop — Layout grants extra mb on mobile so this reveal has
  // real scroll room after the last main section exits the viewport.
  const { scrollYProgress } = useScroll()
  const ciaoY = useTransform(scrollYProgress, [0.85, 1], ['100%', '0%'])

  return (
    <footer
      id="order"
      // h-dvh on mobile so the fixed footer tracks the dynamic viewport
      // (address bar showing/hiding); desktop keeps h-screen.
      className="fixed bottom-0 left-0 right-0 z-0 flex h-dvh md:h-screen flex-col bg-[#157c99] text-[#FBF8EF]"
    >
      {/* Mobile-only spinning donut on the left side of the footer.
          Absolutely positioned, hidden on md+ via the component's own
          `md:hidden`. Hovers above the Ciao reveal area. */}
      <FooterDonut />
      {/* Three-column footer row — site nav on the left, the giant
          CIAO wordmark dominating the centre, and address/contact on
          the right. The whole row sits at the bottom of the footer
          (the flex-1 above pushes the giant text down here).
          Wordmark anchors with `items-end` so the descender of the
          big type lines up with the bottom of the side columns. */}
      <div className="flex flex-1 items-end px-6 pb-4 md:px-12 md:pb-6">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-end gap-8 md:grid-cols-[1fr_2fr_1fr] md:gap-10">
          {/* Left column — site navigation.
              Mobile: single column, right-aligned (matches the rest of
              the right-stacked mobile footer). md+ reverts to left-aligned
              single-column position in the original desktop 3-col layout. */}
          <ul className="font-satt grid grid-cols-1 gap-x-6 gap-y-2 text-base font-black uppercase leading-tight tracking-tight text-right md:text-left md:text-lg">
            <li>
              <Link to="/creations" className="hover:opacity-70">Collection</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:opacity-70">La Carte</Link>
            </li>
            <li>
              <Link to="/the-chef" className="hover:opacity-70">Our Story</Link>
            </li>
            <li>
              <Link to="/order" className="hover:opacity-70">Reserve</Link>
            </li>
          </ul>

          {/* Middle column — giant CIAO wordmark. CIAO rises up from
              the bottom of the footer to its actual position as the
              page scrolls. Clipped at the bottom edge of the footer so
              while it's still translated down it appears to be hiding
              UNDER the footer's bottom edge, not floating off-screen. */}
          <div className="overflow-hidden order-last md:order-none">
            <motion.h2
              style={{ y: ciaoY }}
              // Mobile wordmark scaled up so the reveal lands with the same
              // dramatic weight as desktop's `text-[20vw]`. Any slight
              // side-bleed is intentionally clipped by the parent's
              // overflow-hidden — mirrors how the wordmark feels on desktop.
              className="font-satt text-center text-[40vw] font-black uppercase leading-[0.82] tracking-tighter text-[#FBF8EF] md:text-[20vw]"
            >
              Ciao
            </motion.h2>
          </div>

          {/* Right column — address, contact, delivery, Instagram.
              Right-aligned on every viewport now (the mobile stack also
              right-aligns everything for a unified look). */}
          <div className="flex flex-col gap-4 text-right md:items-end md:text-right">
            <address className="not-italic text-sm font-bold leading-relaxed">
              Sector 58, Gurgaon
              <br />
              Haryana, India
            </address>
            <div className="text-sm font-bold leading-relaxed">
              <p className="break-words">hello@ciaopatisserie.com</p>
              <p>+91 98765 43210</p>
            </div>
            <div className="flex justify-end gap-3 md:justify-end">
              {/* Delivery placeholders — drop real logos when supplied */}
              <a
                href="#"
                aria-label="Order on Swiggy"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FC8019] text-[10px] font-black uppercase tracking-wider text-white"
              >
                Sw
              </a>
              <a
                href="#"
                aria-label="Order on Zomato"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E23744] text-[10px] font-black uppercase tracking-wider text-white"
              >
                Zo
              </a>
            </div>
            <a
              href="https://instagram.com/ciao_patisserie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold underline-offset-4 hover:underline"
            >
              @ciao_patisserie · Follow on Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom legal strip */}
      <div className="border-t border-white/10 px-6 py-4 md:px-16">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 text-[11px] font-bold text-[#FBF8EF]/80 md:flex-row md:text-xs">
          <p>© 2025 Ciao Patisserie</p>
          <p>
            <a href="#" className="hover:opacity-100">Terms of use</a>
            <span className="mx-2 opacity-60">·</span>
            <a href="#" className="hover:opacity-100">Privacy policy</a>
          </p>
          <p className="opacity-60">Made to order · 24–48hr notice required</p>
        </div>
      </div>
    </footer>
  )
}
