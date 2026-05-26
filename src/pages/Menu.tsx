import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '@/components/animations/PageTransition'
import Reveal from '@/components/animations/Reveal'
import { MENU, type MenuTag } from '@/data/menu'

// La Carte — full structured menu. Sticky in-page chip TOC up top,
// then each category as its own block. Tag chips reuse the credential
// chip vocabulary from CelebrationSection.
const TAG_CLASSES: Record<MenuTag, string> = {
  BESTSELLER: 'bg-[#157c99] text-[#FBF8EF]',
  'FAN FAVOURITE': 'bg-pink-300 text-[#2b211c]',
  SEASONAL: 'bg-[#ECE4D2] text-[#157c99]',
}

export default function Menu() {
  return (
    <PageTransition>
      <section className="relative bg-[#F5F0E8] pt-36 pb-32 md:pt-44 md:pb-44">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16">
          {/* Title block */}
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#157c99]" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
                The Menu
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-satt mb-6 text-[16vw] uppercase leading-[0.92] tracking-tighter md:text-[8vw]">
              La{' '}
              <span className="text-[#157c99]">Carte</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mb-10 max-w-[60ch] text-sm font-bold text-[#157c99]/75 md:text-base">
              The full list — signature chocolates, fruit cakes, classic
              patisserie, puddings, and gifting. Weights and tags shown per
              item. Custom flavours on request.
            </p>
          </Reveal>

          {/* Sticky chip TOC — quick jump per category */}
          <Reveal delay={0.3}>
            <div className="sticky top-20 z-30 -mx-6 mb-14 flex gap-2 overflow-x-auto px-6 py-3 md:-mx-16 md:mb-20 md:px-16">
              {MENU.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="shrink-0 rounded-full border border-[#157c99]/30 bg-[#FBF8EF]/95 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#157c99] backdrop-blur transition-colors hover:bg-[#157c99] hover:text-[#FBF8EF] md:text-[11px]"
                >
                  {cat.title}
                </a>
              ))}
            </div>
          </Reveal>

          {/* Categories */}
          <div className="space-y-20 md:space-y-28">
            {MENU.map((cat, ci) => (
              <Reveal key={cat.id} delay={0.05 + ci * 0.05}>
                <div id={cat.id} className="scroll-mt-24">
                  {/* Category header */}
                  <div className="mb-10 flex flex-col gap-3 border-b-2 border-[#157c99]/20 pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#157c99]/60">
                        #{String(ci + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-satt mt-2 text-[10vw] uppercase leading-[0.9] tracking-tight text-[#157c99] md:text-5xl">
                        {cat.title}
                      </h3>
                    </div>
                    <p className="max-w-[42ch] text-sm font-bold text-[#157c99]/70 md:text-right md:text-base">
                      {cat.blurb}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="divide-y divide-[#157c99]/15">
                    {cat.items.map((item, ii) => (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{
                          duration: 0.55,
                          delay: ii * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group grid grid-cols-1 gap-3 py-6 md:grid-cols-[1.4fr_1fr] md:gap-12 md:py-8"
                      >
                        {/* Name + description */}
                        <div>
                          <h4 className="font-satt relative inline-block text-xl uppercase leading-[1.1] tracking-tight text-[#157c99] md:text-2xl">
                            {item.name}
                            <span
                              aria-hidden
                              className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#d4a64a] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                            />
                          </h4>
                          <p className="mt-2 max-w-[58ch] text-sm font-bold text-[#157c99]/70 md:text-[15px]">
                            {item.description}
                          </p>
                        </div>

                        {/* Weights + tags */}
                        <div className="flex flex-wrap items-start gap-2 md:items-center md:justify-end">
                          {item.weights.map((w) => (
                            <span
                              key={w}
                              className="rounded-full border border-[#157c99]/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#157c99]"
                            >
                              {w}
                            </span>
                          ))}
                          {item.tags?.map((t) => (
                            <span
                              key={t}
                              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${TAG_CLASSES[t]}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Closing CTA strip */}
          <Reveal delay={0.2}>
            <div className="mt-20 flex flex-col items-start gap-4 border-t border-[#157c99]/20 pt-8 md:mt-28 md:flex-row md:items-center md:justify-between md:gap-8">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#157c99]">
                All items made to order · 24–48hr notice
              </span>
              <Link
                to="/order"
                className="font-satt rounded-full bg-[#1a1a1a] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#FBF8EF] transition-transform hover:-translate-y-0.5 md:text-sm"
              >
                Reserve →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
