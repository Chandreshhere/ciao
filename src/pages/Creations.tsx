import { Link } from 'react-router-dom'
import PageTransition from '@/components/animations/PageTransition'
import Reveal from '@/components/animations/Reveal'
import ProductCard from '@/components/ProductCard'
import { CREATIONS } from '@/data/creations'

// /creations — editorial gallery of the five collection categories.
// Reuses ProductCard with `lift` enabled so cards lift gently on hover,
// distinguishing this from the static Bestsellers row on Home.
export default function Creations() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-[#F5F0E8] pt-36 pb-32 md:pt-44 md:pb-44">
        {/* Faint tilted "Collection" marquee in the background — echoes
            the Bestsellers row motif so the page feels of-a-piece. */}
        <div className="pointer-events-none absolute inset-0 -z-0 flex -rotate-[8deg] select-none flex-col justify-center gap-20 opacity-[0.06]">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="flex w-max whitespace-nowrap"
              style={{
                animation: 'marquee-x 42s linear infinite',
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
                      Collection
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-16">
          {/* Eyebrow + headline block */}
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#157c99]" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
                The Collection
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-satt mb-6 text-[16vw] uppercase leading-[0.92] tracking-tighter md:text-[8vw]">
              An edit of{' '}
              <span className="text-[#157c99]">our finest</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mb-14 max-w-[60ch] text-sm font-bold text-[#157c99]/75 md:mb-20 md:text-base">
              Five collections, one kitchen. Custom celebration cakes, dessert
              shots, French macarons, puddings, and bespoke designs — each
              made to order, hand-finished, and ready when you are.
            </p>
          </Reveal>

          {/* Editorial grid — two columns on desktop so each card breathes. */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {CREATIONS.map((product, i) => (
              <Reveal key={product.name} delay={0.1 + i * 0.06}>
                <ProductCard product={product} lift />
              </Reveal>
            ))}
          </div>

          {/* Closing note — same composition as AboutSection's closing strip. */}
          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-col items-start gap-4 border-t border-[#157c99]/20 pt-8 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-8">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#157c99]">
                Custom flavours · Bespoke briefs · 24–48hr notice
              </span>
              <Link
                to="/order"
                className="font-satt text-xs uppercase tracking-[0.3em] text-[#157c99] underline-offset-4 hover:underline md:text-sm"
              >
                Reserve yours →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
