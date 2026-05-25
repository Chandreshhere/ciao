import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// "OUR CREATIONS" — an asymmetric bento of four stats sitting beneath a big
// headline. The 8+ card is the hero (2×2), wrapped by a rotating circular seal
// and an animated counter; the other three cards take the remaining four
// cells. Everything uses the site's existing vocabulary: cream ground, blue
// borders, the heavy 900 Satt cut for the big type, and the tilted marquee
// motif from the Bestsellers row.

// Counts up from 0 to `to` over 1.4s once the section enters the viewport.
// Eased with a cubic-out so the last increments feel like a settle, not a stop.
function Counter({ to, isInView }: { to: number; isInView: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let start: number | null = null
    let raf = 0
    const dur = 1400
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.floor(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setN(to)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, to])
  return <>{n}</>
}

// The hero card's rotating ring — "EST. 2017 · BAKED FRESH · SECTOR 58 ·"
// circles a small filled blue dot. Built with SVG <textPath> so the letters
// truly ride the arc; the whole <svg> spins via animate-spin-slow.
function CircularSeal() {
  return (
    <div className="relative h-24 w-24 md:h-28 md:w-28">
      <svg viewBox="0 0 120 120" className="animate-spin-slow h-full w-full">
        <defs>
          <path
            id="seal-circle"
            d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
          />
        </defs>
        <text
          className="font-satt"
          style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 900 }}
          fill="#157c99"
        >
          <textPath href="#seal-circle" startOffset="0">
            EST. 2017 · BAKED FRESH · SECTOR 58 ·&nbsp;
          </textPath>
        </text>
      </svg>
      <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#157c99]" />
    </div>
  )
}

// A small SVG asterisk/ornament — sits beside the headline and rotates slowly.
function Asterisk({
  className = '',
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="none">
      {[0, 45, 90, 135].map((rot) => (
        <rect
          key={rot}
          x="36"
          y="6"
          width="8"
          height="68"
          rx="4"
          fill="#157c99"
          transform={`rotate(${rot} 40 40)`}
        />
      ))}
    </svg>
  )
}

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#F5F0E8] px-6 pb-12 pt-32 md:px-16 md:pb-16 md:pt-44"
    >
      {/* Faint tilted "CIAO" marquee in the background — same motif as the
          Bestsellers row, but dialled way down so it only whispers behind the
          bento. */}
      <div className="pointer-events-none absolute inset-0 -z-0 flex -rotate-[8deg] select-none flex-col justify-center gap-20 opacity-[0.06]">
        {[0, 1].map((row) => (
          <div
            key={row}
            className="flex w-max whitespace-nowrap"
            style={{
              animation: 'marquee-x 38s linear infinite',
              animationDirection: row % 2 === 1 ? 'reverse' : 'normal',
            }}
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="font-satt px-6 text-[10vw] font-black uppercase leading-[0.85] tracking-tighter text-[#157c99]"
                  >
                    Ciao
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Header row — eyebrow + headline on the left, rotating asterisk on
            the right. The headline mixes the heavy Satt cut with one word in
            blue + a hand-drawn underline accent for emphasis. */}
        <div className="mb-12 flex flex-col items-start gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[#157c99]" />
              <h2 className="text-xs font-black tracking-[0.4em] text-[#157c99]">
                OUR CREATIONS
              </h2>
            </div>
            <h3 className="font-satt text-[12vw] uppercase leading-[0.92] tracking-tighter md:text-[6vw]">
              Made with{' '}
              <span className="text-[#157c99]">love</span>
              <br />
              & precision<span className="text-[#157c99]">.</span>
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={isInView ? { opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden md:block"
          >
            <Asterisk className="animate-spin-slow h-20 w-20" />
          </motion.div>
        </div>

        {/* Bento — 4 cols × 2 rows on desktop.
            ┌──────────┬─────┬─────┐
            │          │  0  │  ★  │
            │   8+     ├─────┴─────┤
            │          │     ✓     │
            └──────────┴───────────┘
        */}
        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-5">
          {/* 8+ — hero card. Massive numeral with a rotating seal in the
              corner; on hover, the blue underline-marquee at the bottom slides
              up to fill the card. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="group relative col-span-1 row-span-1 overflow-hidden rounded-[2rem] border-2 border-[#157c99] bg-[#FBF8EF] p-8 md:col-span-2 md:row-span-2 md:p-12"
          >
            {/* Blue-fill sweep on hover */}
            <div className="absolute inset-0 -z-0 translate-y-full bg-[#157c99] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />

            {/* Corner seal */}
            <div className="absolute right-6 top-6 md:right-8 md:top-8">
              <CircularSeal />
            </div>

            {/* Tiny eyebrow */}
            <div className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-[#FBF8EF]">
              <span className="h-px w-6 bg-current opacity-60" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#157c99] group-hover:text-[#FBF8EF]">
                #01 · The craft
              </span>
            </div>

            {/* Massive number */}
            <div className="relative z-10 mt-10 md:mt-24">
              <div className="font-satt flex items-start leading-[0.82] tracking-[-0.04em] text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF]">
                <span className="text-[28vw] md:text-[14vw]">
                  <Counter to={8} isInView={isInView} />
                </span>
                <span className="mt-3 text-[8vw] md:mt-6 md:text-[4vw]">+</span>
              </div>
              <div className="mt-6 max-w-[18ch] md:mt-10">
                <h4 className="font-satt text-2xl uppercase leading-[1] tracking-tight transition-colors duration-500 group-hover:text-[#FBF8EF] md:text-4xl">
                  Years of pastry craft
                </h4>
                <p className="mt-4 text-sm font-bold text-[#157c99]/70 transition-colors duration-500 group-hover:text-[#FBF8EF]/80 md:text-base">
                  Since 2017 — every batch from the same trained hand, refined one bake at a time.
                </p>
              </div>
            </div>

            {/* Bottom marquee strip — visible only when not hovering, fades on
                hover as the blue sweep takes over */}
            <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t-2 border-[#157c99] py-2 transition-opacity duration-500 group-hover:opacity-0">
              <div
                className="flex w-max whitespace-nowrap"
                style={{ animation: 'marquee-x 22s linear infinite' }}
              >
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex shrink-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span
                        key={i}
                        className="font-satt px-4 text-xs font-black uppercase tracking-[0.3em] text-[#157c99]"
                      >
                        Le Cordon Bleu · L'Opéra · Ciao ·
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 0 — NO PRESERVATIVES. Animated stroked ring around a filled core. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="group relative col-span-1 row-span-1 overflow-hidden rounded-[2rem] border-2 border-[#157c99] bg-[#FBF8EF] p-6 md:p-8"
          >
            <div className="absolute inset-0 -z-0 translate-y-full bg-[#157c99] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />

            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.35em] text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF]">
              #02
            </span>

            <div className="relative z-10 mt-4 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-28 w-28 md:h-32 md:w-32">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#157c99"
                  strokeOpacity="0.18"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#157c99"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  initial={{ strokeDashoffset: 301.6 }}
                  animate={isInView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
                  transform="rotate(-90 60 60)"
                  className="transition-[stroke] duration-500 group-hover:stroke-[#FBF8EF]"
                />
                <text
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-satt fill-[#157c99] transition-[fill] duration-500 group-hover:fill-[#FBF8EF]"
                  style={{ fontSize: 56, fontWeight: 900 }}
                >
                  0
                </text>
              </svg>
            </div>

            <div className="relative z-10 mt-2">
              <h4 className="font-satt text-lg uppercase leading-[1.05] tracking-tight text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF] md:text-xl">
                No preservatives
              </h4>
              <p className="mt-1 text-xs font-bold text-[#157c99]/65 transition-colors duration-500 group-hover:text-[#FBF8EF]/80">
                100% natural · fridge-fresh ingredients only
              </p>
            </div>
          </motion.div>

          {/* ★ — CUSTOM FLAVOURS. A scatter of small stars + a rotating glyph. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="group relative col-span-1 row-span-1 overflow-hidden rounded-[2rem] border-2 border-[#157c99] bg-[#FBF8EF] p-6 md:p-8"
          >
            <div className="absolute inset-0 -z-0 translate-y-full bg-[#157c99] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />

            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.35em] text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF]">
              #03
            </span>

            {/* Star cluster — one big spinner + three little ones offset */}
            <div className="relative z-10 mt-4 flex h-28 items-center justify-center md:h-32">
              <Asterisk className="animate-spin-slow h-20 w-20 transition-[fill] duration-500 md:h-24 md:w-24 [&_rect]:transition-[fill] [&_rect]:duration-500 group-hover:[&_rect]:fill-[#FBF8EF]" />
              {([
                { top: '6%', left: '12%', size: 14, delay: '0s' },
                { top: '14%', right: '8%', size: 10, delay: '-3s' },
                { bottom: '4%', left: '22%', size: 12, delay: '-6s' },
              ] as Array<{
                top?: string
                left?: string
                right?: string
                bottom?: string
                size: number
                delay: string
              }>).map((s, i) => (
                <Asterisk
                  key={i}
                  className="animate-spin-slow absolute [&_rect]:transition-[fill] [&_rect]:duration-500 group-hover:[&_rect]:fill-[#FBF8EF]"
                  style={{
                    top: s.top,
                    left: s.left,
                    right: s.right,
                    bottom: s.bottom,
                    width: s.size,
                    height: s.size,
                    animationDelay: s.delay,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 mt-2">
              <h4 className="font-satt text-lg uppercase leading-[1.05] tracking-tight text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF] md:text-xl">
                Custom flavours
              </h4>
              <p className="mt-1 text-xs font-bold text-[#157c99]/65 transition-colors duration-500 group-hover:text-[#FBF8EF]/80">
                Bespoke designs · briefed, sketched, baked to you
              </p>
            </div>
          </motion.div>

          {/* ✓ — MADE TO ORDER. Wide horizontal card with a big tick + a
              checklist of what 'fresh daily' actually means. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="group relative col-span-1 row-span-1 overflow-hidden rounded-[2rem] border-2 border-[#157c99] bg-[#FBF8EF] p-6 md:col-span-2 md:p-8"
          >
            <div className="absolute inset-0 -z-0 translate-y-full bg-[#157c99] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />

            <div className="relative z-10 flex h-full flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
              {/* Big tick */}
              <div className="flex items-center gap-5 md:gap-7">
                <div className="relative shrink-0">
                  <svg viewBox="0 0 80 80" className="h-20 w-20 md:h-24 md:w-24">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#157c99"
                      strokeWidth="3"
                      className="transition-[stroke] duration-500 group-hover:stroke-[#FBF8EF]"
                    />
                    <motion.path
                      d="M 22 42 L 35 55 L 60 28"
                      fill="none"
                      stroke="#157c99"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
                      className="transition-[stroke] duration-500 group-hover:stroke-[#FBF8EF]"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF]">
                    #04
                  </span>
                  <h4 className="font-satt mt-1 text-2xl uppercase leading-[1] tracking-tight text-[#157c99] transition-colors duration-500 group-hover:text-[#FBF8EF] md:text-3xl">
                    Made to order
                  </h4>
                  <p className="mt-2 text-xs font-bold text-[#157c99]/65 transition-colors duration-500 group-hover:text-[#FBF8EF]/80 md:text-sm">
                    Fresh daily — nothing sits.
                  </p>
                </div>
              </div>

              {/* Inline checklist */}
              <ul className="flex flex-wrap gap-2 md:max-w-[260px] md:justify-end">
                {['Baked at dawn', 'Tempered to order', 'Hand-finished', 'Box, then go'].map(
                  (item) => (
                    <li
                      key={item}
                      className="rounded-full border border-[#157c99]/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#157c99] transition-colors duration-500 group-hover:border-[#FBF8EF]/40 group-hover:text-[#FBF8EF] md:text-[11px]"
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Closing strip — small marker line + a single italic-feeling line of
            copy + the same star tying the section's bottom back to the top. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col items-start gap-4 border-t border-[#157c99]/20 pt-8 md:mt-20 md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <div className="flex items-center gap-3">
            <Asterisk className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#157c99]">
              Four principles · one kitchen
            </span>
          </div>
          <p className="max-w-[60ch] text-sm font-bold text-[#157c99]/70 md:text-base">
            Every cake we ship is a small contract: trained hands, clean ingredients, fresh
            today, and made for you specifically.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
