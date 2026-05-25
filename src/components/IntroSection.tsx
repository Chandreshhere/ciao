import { useState, useEffect } from 'react'
import FallingText from './FallingText'
import BgPastries from './BgPastries'

// Both texts as styled segments — a module constant so FallingText keeps a
// stable reference and only builds the words once. Each keeps its own size /
// weight / colour (no font change); they only share a physics world.
const SEGMENTS = [
  {
    text: 'Good food should both comfort and nourish the soul.',
    className:
      'text-[6vw] font-satt uppercase leading-[1] tracking-tight text-[#157c99] md:text-[3.4vw]',
  },
  {
    text: "We are centrally located in Sector 58, Gurgaon. Stop by for a coffee, catch up on work, or grab some of our delicious goodies to go. With cookies and cakes available for online order, there's something for everyone, and every occasion.",
    className:
      'text-base font-bold leading-snug text-[#157c99] md:text-[1.35vw] md:self-end',
  },
]

// Card-shaped image wrappers that scroll-reveal inside the box — the same
// rounded, blue-bordered shape as the Bestsellers product cards. Placed in the
// box's empty zones (the anti-diagonal to the top-left heading / bottom-right
// paragraph). Images are placeholders — I can't pull photos off the web; drop
// real transparent images into `public/` and swap the placeholder for an <img>.
const IMAGE_CARDS = [
  { left: '79%', top: '21%', size: 156, rotate: 6, delay: 0, image: '/gallery/product-14.png' },
  { left: '21%', top: '72%', size: 168, rotate: -7, delay: 130, image: '/gallery/product-15.png' },
  { left: '52%', top: '47%', size: 144, rotate: 4, delay: 260, image: '/gallery/product-16.png' },
]

// The pinned "section after the hero" — see DonutScene / HandScene for the
// scroll-driven choreography that plays over it:
//   • 2vh -> 3.7vh   — hand slides in, holds a long beckon, slides back out;
//                      just after the pin (~2.2vh) the image cards pop in.
//   • 3.7vh -> 4.4vh — the donut slowly rolls off to the right.
//   • scrollY 4.4vh  — donut gone -> every word of BOTH texts drops with
//                      physics and mingles inside the blue-lined, curved box.
//   • scrollY ~4.6vh — the section unpins and releases to the next section.
export default function IntroSection() {
  const [donutOut, setDonutOut] = useState(false)
  const [cardsIn, setCardsIn] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      // Once the donut has fully rolled off (scrollY >= 4.4vh), drop the text.
      if (window.scrollY >= 4.4 * vh) setDonutOut(true)
      // Shortly after the section pins, the image cards scroll-reveal.
      if (window.scrollY >= 2.2 * vh) setCardsIn(true)
    }
    onScroll() // in case the page loads already scrolled past
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-[360vh] bg-[#F5F0E8]">
      <div className="sticky top-0 z-30 flex h-screen items-center justify-center overflow-hidden px-6 py-16 md:px-16">
        {/* Pastry illustrations scattered through the empty background areas,
            behind the box. */}
        <BgPastries />

        {/* Blue-lined, curved box — both texts drop and mingle inside it once
            the donut has rolled off, so it's clear there's a box they fall in. */}
        <FallingText
          start={donutOut}
          segments={SEGMENTS}
          gravity={0.9}
          contentClassName="grid h-full items-start gap-10 p-6 md:grid-cols-2 md:grid-rows-1 md:gap-16 md:p-10"
          className="h-[74vh] w-full max-w-[1400px] rounded-[2.75rem] border-2 border-[#157c99] bg-[#FBF8EF]"
        >
          {/* Image cards — same rounded, blue-bordered shape as the Bestsellers
              cards; scroll-reveal inside the box, behind the falling text. */}
          {IMAGE_CARDS.map((c, i) => (
            <div
              key={i}
              style={{
                left: c.left,
                top: c.top,
                width: c.size,
                transform: `translate(-50%, -50%) ${cardsIn ? 'scale(1)' : 'scale(0.5)'} rotate(${c.rotate}deg)`,
                opacity: cardsIn ? 1 : 0,
                transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${c.delay}ms, opacity 0.4s ${c.delay}ms`,
              }}
              className="pointer-events-none absolute rounded-[1.75rem] border-2 border-[#157c99] bg-[#FBF8EF] p-2.5"
            >
              <div className="aspect-square overflow-hidden rounded-[1.1rem] bg-[#ECE4D2]">
                <img
                  src={c.image}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </FallingText>
      </div>
    </section>
  )
}
