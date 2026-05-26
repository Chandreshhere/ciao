import { useState, useRef, type FormEvent } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll progress through the section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // Hold the "before" position only briefly (~15% into the scroll range),
  // then a FAST parallax kicks in: cake drifts DOWN, cookies drift UP.
  const leftY = useTransform(scrollYProgress, [0, 0.15, 0.8], ['-5%', '-5%', '90%'])
  const rightY = useTransform(scrollYProgress, [0, 0.15, 0.8], ['5%', '5%', '-90%'])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // Hook up to a real list provider here when wiring is ready.
    setEmail('')
  }

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden rounded-b-[3rem] bg-[#F5F0E8] px-6 py-10 md:rounded-b-[5rem] md:px-16 md:py-14"
    >
      <div className="relative mx-auto max-w-[960px]">
        {/* Compact rounded blue card. Two large photo-style cutouts —
            cake on the left, cookies on the right — overhang the card
            edges and parallax up/down as the section scrolls through
            the viewport. */}
        <div className="relative rounded-[2rem] bg-[#157c99] px-5 py-8 md:rounded-[2.25rem] md:px-10 md:py-16">
          {/* Cake — TOP-LEFT corner, sitting a little DOWN from the very
              edge. Drifts DOWN on scroll (fast). */}
          <motion.img
            src="/cake_full.svg"
            alt=""
            aria-hidden
            style={{ y: leftY }}
            className="pointer-events-none absolute -left-5 -top-3 z-10 h-20 w-20 select-none md:-left-10 md:-top-4 md:h-32 md:w-32 lg:-left-12 lg:-top-6 lg:h-36 lg:w-36"
          />

          {/* Cookies — BOTTOM-RIGHT corner, sitting a little UP from the
              very edge. Drifts UP on scroll (fast). */}
          <motion.img
            src="/cookie_full.svg"
            alt=""
            aria-hidden
            style={{ y: rightY }}
            className="pointer-events-none absolute -bottom-3 -right-7 z-10 h-20 w-20 select-none md:-bottom-4 md:-right-10 md:h-32 md:w-32 lg:-bottom-6 lg:-right-12 lg:h-36 lg:w-36"
          />

          <div className="relative z-20 mx-auto flex max-w-xl flex-col items-center text-center">
            <h2 className="font-satt text-3xl font-black uppercase leading-[0.95] tracking-tight text-[#FBF8EF] md:text-5xl">
              Join Our
              <br />
              Newsletter
            </h2>

            <p className="mt-5 max-w-sm text-sm font-bold text-[#FBF8EF] md:mt-7 md:text-base">
              Join our newsletter to stay informed of our specials and events.
            </p>

            <form
              onSubmit={submit}
              // Mobile: narrow form (`max-w-[15rem]`) so the stacked input
              // and Join pill render compact instead of full-card-width.
              // sm: restores the original `max-w-md` for tablets and up.
              className="mt-6 flex w-full max-w-[15rem] flex-col items-stretch gap-2.5 sm:max-w-md sm:flex-row sm:items-center sm:gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL"
                aria-label="Email address"
                // Mobile: tighter padding + smaller text. md: classes
                // restore the original input dimensions on desktop.
                className="flex-1 rounded-full bg-pink-300 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2b211c] placeholder:text-[#2b211c]/70 focus:outline-none focus:ring-2 focus:ring-[#FBF8EF] md:px-5 md:py-3 md:text-sm md:tracking-[0.25em]"
              />
              <button
                type="submit"
                // Mobile: smaller Join pill. Desktop sizing preserved
                // by the md: classes.
                className="rounded-full bg-[#1a1a1a] px-5 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-transform hover:scale-105 md:px-6 md:py-3 md:text-sm md:tracking-[0.25em]"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
