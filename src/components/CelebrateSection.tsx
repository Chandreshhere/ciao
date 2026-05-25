import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useRef, useEffect, type RefObject } from 'react'
import CelebrateDonut from './CelebrateDonut'

export default function CelebrateSection({
  bestsellersRef,
}: {
  bestsellersRef: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const archRef = useRef<HTMLDivElement>(null)
  const orderRef = useRef<HTMLAnchorElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // "Celebrate every day with cake" slides leftwards along the arch-shaped path
  // as you scroll — from the right portion of the arch toward the left. The
  // phrase is kept shorter than the path, so the whole of it always stays on
  // the arch (never cut) and it never loops.
  const setOffset = (v: number) =>
    textPathRef.current?.setAttribute('startOffset', `${32 - v * 28}%`)
  useMotionValueEvent(scrollYProgress, 'change', setOffset)
  useEffect(() => setOffset(scrollYProgress.get()), [scrollYProgress])

  return (
    // The section is taller than the viewport so its inner content can
    // STICK (top:0) for the full duration of the donut animation. The
    // sticky pin holds from when the section's top hits the viewport top
    // to when its bottom reaches the viewport bottom — giving the donut
    // ~100vh of scroll to orbit and land before the section releases.
    <section ref={ref} className="relative h-[200vh] bg-[#F5F0E8]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {/* Cream fade at the top of the sticky frame — softens the seam
            between the Bestsellers section above and the pinned content. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-48 bg-gradient-to-b from-[#F5F0E8] via-[#F5F0E8]/80 to-transparent md:h-64" />

        <div ref={archRef} className="relative aspect-[4/5] w-[min(510px,82vw)]">
          {/* "CELEBRATE WITH CAKE" follows the arch's own outline — up
              the sides, over the semicircle top. */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-[20] aspect-[1000/820] w-[145%] -translate-x-1/2 -translate-y-[20%]">
            <svg viewBox="0 0 1000 820" className="h-full w-full">
              <defs>
                <path
                  id="celebrate-arch"
                  fill="none"
                  d="M 120,700 L 120,510 A 380,380 0 0 1 880,510 L 880,700"
                />
              </defs>
              <text
                className="fill-[#157c99] uppercase"
                style={{ fontSize: 58, fontWeight: 900, letterSpacing: 3 }}
              >
                <textPath
                  ref={textPathRef}
                  href="#celebrate-arch"
                  startOffset="32%"
                >
                  Celebrate every day with cake
                </textPath>
              </text>
            </svg>
          </div>

          {/* Cake-house image — soft drop-shadow gives it a "floating off
              the page" 3D feel so the donut visibly passes BEHIND it. */}
          <img
            src="/cake%20house.png"
            alt="Cake house"
            className="absolute inset-0 z-10 h-full w-full object-contain"
            style={{
              filter:
                'drop-shadow(0 30px 40px rgba(0,0,0,0.18)) drop-shadow(0 10px 18px rgba(0,0,0,0.12))',
            }}
          />
        </div>

        {/* 3D donut lives INSIDE the sticky pin so it shares the sticky's
            stacking context with the cake-house image (z-10) and cream
            backdrop (z-5). At z-4 it sits behind the backdrop (and so
            behind the image silhouette); at z-25/30 it sits in front. */}
        <CelebrateDonut
          archRef={archRef}
          buttonRef={orderRef}
          startRef={bestsellersRef}
          sectionRef={ref}
        />
      </div>
    </section>
  )
}
