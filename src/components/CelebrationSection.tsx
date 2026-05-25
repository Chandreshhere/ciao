import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// "THE CHEF" — an editorial-spread treatment for Srishti's bio. Deliberately
// border-less: hierarchy comes from typography, fill blocks, whitespace, and
// hand-drawn ornaments, not from outlined chrome. Sits below AboutSection
// (which is all blue-bordered cards), so it intentionally reads as a different
// surface — magazine page rather than dashboard.

type CredentialTone = 'solid' | 'soft' | 'cream'
const CREDENTIALS: Array<{
  year: string
  label: string
  tone: CredentialTone
}> = [
  { year: 'Trained', label: 'Le Cordon Bleu, London', tone: 'solid' },
  { year: 'Honed', label: "L'Opéra, New Delhi", tone: 'soft' },
  { year: 'Founded 2017', label: 'Ciao Patisserie', tone: 'cream' },
  { year: 'Today', label: 'Sector 58, Gurgaon', tone: 'solid' },
]

const TONE_CLASSES: Record<CredentialTone, string> = {
  // Solid blue chip, cream text — the loudest variant.
  solid: 'bg-[#157c99] text-[#FBF8EF]',
  // Soft pink chip echoing the Bestsellers pop pills, for a flash of warmth.
  soft: 'bg-pink-300 text-[#2b211c]',
  // Cream chip with blue text — quietest variant.
  cream: 'bg-[#ECE4D2] text-[#157c99]',
}

export default function CelebrationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden bg-[#F5F0E8] px-6 pb-32 pt-12 md:px-16 md:pb-44 md:pt-16"
    >
      <div className="relative mx-auto max-w-[1600px]">
        {/* Eyebrow row — small filled dot + tracked label on the left, a
            chapter marker on the right. No divider lines anywhere — the dot
            does the work of an accent. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex items-center justify-between md:mb-20"
        >
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#157c99]" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
              The Chef
            </h2>
          </div>
          <span className="font-satt text-xs uppercase tracking-[0.3em] text-[#157c99]/40 md:text-sm">
            Chapter · 02
          </span>
        </motion.div>

        {/* Hero: name on the left (taking most of the page width), portrait
            block on the right. Subtitle hangs under the name. */}
        <div className="relative mb-20 grid grid-cols-1 gap-y-12 md:mb-32 md:grid-cols-12 md:gap-x-12">
          <div className="relative md:col-span-8">
            <h3 className="font-satt text-[20vw] uppercase leading-[0.86] tracking-[-0.035em] md:text-[12.5vw]">
              <motion.span
                className="block"
                initial={{ y: 120, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Srishti
              </motion.span>
              <motion.span
                className="block text-[#157c99]"
                initial={{ y: 120, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                Ghai
              </motion.span>
            </h3>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 max-w-[42ch] text-sm font-bold uppercase tracking-[0.18em] text-[#157c99]/70 md:text-base"
            >
              Owner & Chef Pâtissier · Ciao Patisserie
            </motion.p>
          </div>

          {/* Portrait block — solid cream fill, no border. A small filled
              "Chef" tag overlaps the lower-left corner. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.95, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mx-auto w-full max-w-[360px] md:col-span-4 md:ml-auto md:mr-0"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.25rem] bg-[#ECE4D2]">
              <img
                src="/gallery/srishti.png"
                alt="Srishti Ghai — Chef Pâtissière"
                className="relative z-10 h-full w-full object-cover"
              />

              {/* Soft cream-pink ambient blob, breathing slowly behind the
                  portrait subject to add depth without a frame. */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-pink-300/30 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-[#157c99]/15 blur-2xl" />
            </div>

            {/* Floating "Chef" tag — a solid filled chip that hangs off the
                bottom-left of the portrait at an angle. z-20 so it sits
                above the portrait image (which is at z-10). */}
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -8 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: -6 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -bottom-5 -left-3 z-20 rounded-full bg-[#157c99] px-5 py-2 md:-left-6 md:px-6 md:py-2.5"
            >
              <span className="font-satt text-xs uppercase tracking-[0.25em] text-[#FBF8EF] md:text-sm">
                Pâtissière
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Pull quote (left) + body copy (right). A giant SVG opening quote
            sits behind the headline; first paragraph carries a drop cap. */}
        <div className="relative mb-20 grid grid-cols-1 gap-y-12 md:mb-28 md:grid-cols-12 md:gap-x-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="relative md:col-span-6"
          >
            {/* Oversized soft-blue opening quote — illustration only. */}
            <span
              aria-hidden
              className="font-satt pointer-events-none absolute -left-2 -top-16 select-none text-[180px] leading-none text-[#157c99]/15 md:-left-4 md:-top-24 md:text-[260px]"
            >
              “
            </span>
            <h4 className="font-satt relative text-[8.5vw] uppercase leading-[1.02] tracking-[-0.02em] md:text-[3.6vw]">
              Balanced desserts,{' '}
              <span className="text-[#157c99]">minimal sugar</span>, maximum flavour.
            </h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="space-y-5 text-[#157c99] md:col-span-6 md:col-start-7 md:space-y-6"
          >
            <p className="text-base font-bold leading-relaxed md:text-lg">
              <span className="font-satt float-left mr-2 mt-1 text-6xl leading-[0.78] text-[#157c99] md:text-7xl">
                W
              </span>
              hen career and passion come together, wonderful things happen.
              Srishti's journey began in Finance at Christ University, Bangalore,
              before she followed her true calling into the pastry arts.
            </p>
            <p className="text-base font-bold leading-relaxed md:text-lg">
              Trained at Le Cordon Bleu, London and honed at L'Opéra, New Delhi,
              she founded Ciao Patisserie in 2017, built on precision, creativity,
              and the finest ingredients.
            </p>
            <p className="text-base font-bold leading-relaxed md:text-lg">
              Now in Gurgaon, she continues to create desserts as thoughtful as
              they are beautiful.
            </p>
          </motion.div>
        </div>

        {/* Credentials — scattered solid-fill chips. Three tones (solid blue,
            soft pink, cream) so the row reads as a cluster rather than a list,
            each tilted a few degrees for an organic, hand-pinned feel. */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#157c99]" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
              Credentials
            </span>
          </motion.div>

          <div className="flex flex-wrap gap-4 md:gap-5">
            {CREDENTIALS.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.85 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.04, transition: { duration: 0.25 } }}
                className={`rounded-[1.75rem] px-6 py-4 shadow-[0_6px_18px_-10px_rgba(74,124,158,0.45)] md:px-8 md:py-5 ${TONE_CLASSES[c.tone]}`}
              >
                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                  {c.year}
                </div>
                <div className="font-satt mt-1 text-lg uppercase leading-[1] tracking-tight md:text-xl">
                  {c.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
