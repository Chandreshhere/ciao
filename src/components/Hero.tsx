import { motion, useScroll, useTransform, useMotionTemplate, easeOut } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

// Wait for the PageLoader to start its exit before kicking off the hero's
// own entrance — the text reveals land just as the loader is sliding
// away, making it feel like the overlay is unveiling the headline.
const HERO_DELAY = 2.0

// One line of hero text that reveals on load: it sits in an overflow clip and
// slides up into place from below — landing exactly where it sits, so it
// "reveals in line" rather than flying in. Plays on mount (i.e. on reload).
// The py/-my pair widens the clip box without shifting layout, so tight
// leading never clips the glyphs mid-reveal.
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden py-[0.12em] -my-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: '130%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

// The donut itself lives in <DonutScene /> — a fixed layer driven by scroll. The
// hero owns the scroll "room": the tall wrapper + sticky inner keep the
// background and text pinned for one viewport (while the donut zooms), then
// release for a second viewport (while the donut flips and scrolls away with
// the page like normal content).
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  // Mobile-only image translate. Framer Motion's `x` is set inline; we can't
  // override it via Tailwind responsive classes, so we toggle the value with
  // a matchMedia listener. Desktop keeps its original -1.2% composition.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Progress across the whole 200vh hero: 0 at the top, 0.5 once the pinned
  // viewport ends, 1 once the hero has fully scrolled away.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // The background image zooms in across the whole scroll.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.5])
  // Hero text holds still while pinned, then drifts up at varying rates once
  // the hero unpins (0.5 -> 1) — a little parallax.
  const headlineY = useTransform(scrollYProgress, [0.5, 1], [0, -100])
  const topRightY = useTransform(scrollYProgress, [0.5, 1], [0, -140])
  const bottomY = useTransform(scrollYProgress, [0.5, 1], [0, -70])
  // Radius, image parallax and blur hold still through the pinned half and
  // only kick in once the hero unpins. The bottom corners round off quickly
  // and smoothly (eased, over a short slice of the unpin); parallax and blur
  // take the whole back half.
  const radius = useTransform(scrollYProgress, [0.5, 0.72], [0, 64], { ease: easeOut })
  const imageY = useTransform(scrollYProgress, [0.5, 1], ['0%', '8%'])
  const blurPx = useTransform(scrollYProgress, [0.5, 1], [0, 6])
  const imageFilter = useMotionTemplate`blur(${blurPx}px)`

  return (
    <section
      ref={sectionRef}
      // Mobile uses `dvh` so the section height tracks the dynamic
      // viewport (address bar showing/hiding) — prevents scroll
      // lurches and layout shifts as the browser UI changes.
      // bg-[#F5F0E8] on mobile fills behind the sticky hero so the
      // motion.div's rounded bottom corners reveal cream (matching the
      // IntroSection below) instead of the blue body. Reset to transparent
      // on md+ so desktop stays exactly as before.
      className="relative h-[200dvh] md:h-[200vh] w-full bg-[#F5F0E8] md:bg-transparent"
    >
      <motion.div
        style={{ borderBottomLeftRadius: radius, borderBottomRightRadius: radius }}
        // bg on mobile is a defensive backup — when the image is
        // mid-fade-in (opacity 0 → 1), the sticky's cream fill prevents
        // any flash of body/footer blue from peeking through.
        // h-dvh on mobile keeps the sticky pin matched to the dynamic
        // viewport (avoids the iOS Safari address-bar jump).
        className="sticky top-0 h-dvh md:h-screen w-full overflow-hidden bg-[#F5F0E8] md:bg-transparent"
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Image is wrapped so the entrance animation (opacity fade)
              composes cleanly on top of the scroll-driven transforms
              applied to the <motion.img> itself. Delay matches the
              page-loader exit. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: HERO_DELAY }}
            className="absolute inset-0"
          >
            <motion.img
              src="/hero.png"
              alt="French Patisserie"
              // object-center on mobile so the subject sits in frame; reverts
              // to the original `left center` crop at md+ to preserve the
              // desktop composition exactly.
              className="w-full h-full object-cover object-center md:object-left"
              style={{
                x: isMobile ? '-4%' : '-1.2%',
                scale: imageScale,
                y: imageY,
                filter: imageFilter,
              }}
            />
          </motion.div>
        </div>

        {/* Main hero statement — bottom-left, big and uppercase.
            Desktop offsets (left-16, bottom-12) preserved at md+; mobile
            uses tighter offsets so it doesn't get clipped on small screens. */}
        <div className="absolute left-5 bottom-6 z-10 md:left-16 md:bottom-12">
          <motion.div style={{ y: headlineY }}>
            {/* Heavy 900 "Satt" cut of Apfel Grotezk — wired up in index.css. */}
            <h1 className="text-[13vw] md:text-[9vw] font-black uppercase leading-[0.9] tracking-wide text-white text-left">
              <Reveal delay={HERO_DELAY + 0.15}>Crafted in</Reveal>
              <Reveal delay={HERO_DELAY + 0.28}>Paris.</Reveal>
            </h1>
          </motion.div>
        </div>

        {/* Product line — top-right.
            On mobile, sits just below the header at top-20 with a tighter
            right offset, capped to ~78vw so it can never overflow the
            viewport or collide with anything on the left. */}
        <div className="absolute right-5 top-20 z-10 max-w-[78vw] text-right md:right-16 md:top-32 md:max-w-xl">
          <motion.div style={{ y: topRightY }}>
            <p className="text-white text-sm leading-snug font-black md:text-3xl md:leading-relaxed">
              <Reveal delay={HERO_DELAY + 0.4}>Modern French pâtisserie</Reveal>
              <Reveal delay={HERO_DELAY + 0.5}>macarons, éclairs, entremets,</Reveal>
              <Reveal delay={HERO_DELAY + 0.6}>and bespoke celebration cakes.</Reveal>
            </p>
          </motion.div>
        </div>

        {/* Supporting text — bottom-right.
            On mobile, lifted to `bottom-32` so it floats clear above the
            bottom-left "Crafted in Paris" headline (which spans ~92vw at
            text-[13vw]). Returns to `bottom-12` at md+ where there's
            enough horizontal room for both blocks to coexist. */}
        <div className="absolute bottom-32 right-5 z-10 max-w-[60vw] text-right md:bottom-12 md:right-16 md:max-w-md">
          <motion.div style={{ y: bottomY }}>
            <p className="text-white text-[10px] tracking-[0.3em] mb-2 font-black md:text-base md:mb-4">
              <Reveal delay={HERO_DELAY + 0.5}>FRENCH PÂTISSERIE · GURGAON</Reveal>
            </p>
            <p className="text-white text-lg leading-tight font-black md:text-3xl">
              <Reveal delay={HERO_DELAY + 0.62}>Made for You.</Reveal>
            </p>
          </motion.div>
        </div>
      </motion.div>

    </section>
  )
}
