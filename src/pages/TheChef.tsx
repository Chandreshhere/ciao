import PageTransition from '@/components/animations/PageTransition'
import Reveal from '@/components/animations/Reveal'
import AnimatedCounter from '@/components/animations/AnimatedCounter'
import CelebrationSection from '@/components/CelebrationSection'
import AboutSection from '@/components/AboutSection'

// /the-chef — Our Story. Reuses the existing chef bio (CelebrationSection)
// and stats bento (AboutSection) intact, with a tracked stat row up top
// providing the master prompt's hero stats line (2017 Founded · 8+ Years
// · 100% Made to Order · 0 Preservatives · ∞ Custom Flavours).

const STATS = [
  { value: 2017, suffix: '', label: 'Founded' },
  { value: 8, suffix: '+', label: 'Years' },
  { value: 100, suffix: '%', label: 'Made to Order' },
  { value: 0, suffix: '', label: 'Preservatives' },
  { value: null, suffix: '∞', label: 'Custom Flavours' },
] as const

export default function TheChef() {
  return (
    <PageTransition>
      {/* Top spacer — pushes the title clear of the fixed header */}
      <section className="bg-[#F5F0E8] pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-16">
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#157c99]" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
                Our Story
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-satt mb-6 text-[16vw] uppercase leading-[0.92] tracking-tighter md:text-[8vw]">
              The hands{' '}
              <span className="text-[#157c99]">behind</span> Ciao.
            </h1>
          </Reveal>

          {/* Stat row — five tracked numerals with animated counters.
              2 cols on mobile (5th centered via col-span-2), 5 cols at md+. */}
          <Reveal delay={0.2}>
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-b border-[#157c99]/20 py-8 md:mt-16 md:grid-cols-5 md:gap-4 md:py-10">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col ${
                    i === STATS.length - 1
                      ? 'col-span-2 items-center text-center md:col-span-1 md:items-start md:text-left'
                      : ''
                  }`}
                >
                  <span className="font-satt text-[12vw] uppercase leading-[0.95] tracking-tight text-[#157c99] md:text-[3.5vw]">
                    {s.value === null ? (
                      s.suffix
                    ) : (
                      <>
                        <AnimatedCounter to={s.value} />
                        {s.suffix}
                      </>
                    )}
                  </span>
                  <span className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#157c99]/65 md:text-[11px]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Chef biography — the existing editorial layout, unchanged. */}
      <CelebrationSection />

      {/* Stats bento — the existing four-principle bento, unchanged. */}
      <AboutSection />
    </PageTransition>
  )
}
