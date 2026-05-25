import { motion, type Transition } from 'framer-motion'

// "The best things in life are sweet" — a heading over a continuously-scrolling
// marquee of arch-shaped image cards of varying sizes. Cake/cookie doodle SVGs
// are interspersed between some cards (not every pair) so they read as part of
// the row rhythm rather than only edge decorations.
//
// On first scroll-in, each card REVEALS in place by uncovering its content
// from the bottom-middle outward (a radial clip-path wipe) — no positional
// movement, no bounce. After the reveal the marquee continues its normal
// horizontal loop.

type Item =
  | { kind: 'card'; size: 'sm' | 'md' | 'lg'; image: string }
  | { kind: 'doodle'; variant: 'cake' | 'cookie' }

const PATTERN: Item[] = [
  { kind: 'card', size: 'lg', image: '/gallery/product-06.png' },
  { kind: 'doodle', variant: 'cake' },
  { kind: 'card', size: 'md', image: '/gallery/product-07.png' },
  { kind: 'card', size: 'sm', image: '/gallery/product-08.png' },
  { kind: 'card', size: 'lg', image: '/gallery/product-09.png' },
  { kind: 'card', size: 'md', image: '/gallery/product-10.png' },
  { kind: 'doodle', variant: 'cookie' },
  { kind: 'card', size: 'lg', image: '/gallery/product-11.png' },
  { kind: 'card', size: 'sm', image: '/gallery/product-12.png' },
  { kind: 'card', size: 'md', image: '/gallery/product-13.png' },
]

const CARD_SIZE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-[clamp(130px,15vw,210px)] aspect-[3/4]',
  md: 'w-[clamp(180px,21vw,280px)] aspect-[3/4]',
  lg: 'w-[clamp(220px,26vw,340px)] aspect-[3/4]',
}

function CakeDoodle() {
  return (
    <svg viewBox="0 0 130 120" className="h-full w-full" aria-hidden>
      <path d="M20 110V46h90v64z" fill="#1F1B17" />
      <path d="M14 46q51-16 102 0-51 10-102 0z" fill="#1F1B17" />
      <rect x="20" y="64" width="90" height="7" fill="#F5F0E8" />
      <rect x="20" y="86" width="90" height="7" fill="#F5F0E8" />
      <path d="M44 30l-7 9h14z" fill="#1F1B17" />
      <path d="M44 36c-8 0-13 5-13 12 0 9 13 18 13 18s13-9 13-18c0-7-5-12-13-12z" fill="#D14B5A" />
    </svg>
  )
}

function CookieDoodle() {
  return (
    <svg viewBox="0 0 150 110" className="h-full w-full" aria-hidden>
      <ellipse cx="84" cy="88" rx="56" ry="16" fill="#F2A7D4" />
      <circle cx="98" cy="54" r="34" fill="#1F1B17" />
      <circle cx="52" cy="60" r="36" fill="#F5F0E8" stroke="#1F1B17" strokeWidth="5" />
      <circle cx="42" cy="50" r="5" fill="#1F1B17" />
      <circle cx="62" cy="58" r="4" fill="#1F1B17" />
      <circle cx="48" cy="72" r="4.5" fill="#1F1B17" />
      <circle cx="66" cy="42" r="3.5" fill="#1F1B17" />
    </svg>
  )
}

// Per-card entrance: the card itself stays fixed in place. A solid
// overlay sitting on top of it (matching the card's shape) slides UP
// and off, uncovering the image like a curtain rising. The card is
// revealed from its BOTTOM edge upward — and because the overlay
// matches the card shape, it reads as a real "wrapper" lifting off.
const REVEAL_TRANSITION: Transition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1],
}

export default function SweetMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#F5F0E8] py-24 md:py-32">
      <h2 className="font-satt mx-auto mb-14 max-w-[1100px] px-6 text-center text-[11vw] font-black uppercase leading-[0.95] tracking-tight text-[#1F1B17] md:mb-20 md:text-[5.4vw]">
        The best things in life are sweet
      </h2>

      <div className="relative">
        {/* Continuously-moving marquee. The pattern is duplicated so the
            translate-by-50% loop seams cleanly. */}
        <div
          className="flex w-max items-end"
          style={{ animation: 'marquee-x 42s linear infinite' }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-end">
              {PATTERN.map((item, i) =>
                item.kind === 'card' ? (
                  <div
                    key={`${dup}-${i}`}
                    className={`relative mr-6 shrink-0 overflow-hidden rounded-t-full bg-[#E8E0CF] md:mr-10 ${CARD_SIZE[item.size]}`}
                  >
                    {/* Card image — sits fixed in place underneath. */}
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-cover"
                    />
                    {/* Wrapper overlay — same colour as the page so the
                        whole card (shape + image) appears HIDDEN until
                        the overlay slides UP off the top edge, revealing
                        the entire card from bottom to top. */}
                    <motion.div
                      initial={{ y: '0%' }}
                      whileInView={{ y: '-100%' }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={REVEAL_TRANSITION}
                      className="absolute inset-0 z-10 bg-[#F5F0E8]"
                    />
                  </div>
                ) : (
                  <div
                    key={`${dup}-${i}`}
                    className="pointer-events-none relative mr-6 flex h-20 w-24 shrink-0 items-end self-end overflow-hidden md:mr-10 md:h-28 md:w-32"
                    aria-hidden
                  >
                    {item.variant === 'cake' ? <CakeDoodle /> : <CookieDoodle />}
                    {/* Same wrapper-lift effect for the doodles so they
                        join the reveal rhythm. */}
                    <motion.div
                      initial={{ y: '0%' }}
                      whileInView={{ y: '-100%' }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={REVEAL_TRANSITION}
                      className="absolute inset-0 z-10 bg-[#F5F0E8]"
                    />
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
