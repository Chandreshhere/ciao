import { forwardRef, useState } from 'react'

// "Bestsellers" — a tilted, continuously-scrolling marquee of the word
// (alternating filled and outlined) sits behind a row of five small,
// blue-bordered product cards. Hovering a card pops three little pink
// ingredient pills out at scattered spots over the image. Product imagery is a
// placeholder for now — drop real images into `public/` and wire an `image`
// field once supplied.
interface Pill {
  label: string
  left: string
  top: string
  rotate: number
}
interface Product {
  name: string
  meta: string
  image: string
  pills: Pill[]
}

const PRODUCTS: Product[] = [
  {
    name: 'Classic Tiramisu',
    meta: 'Box of 4 · Made fresh daily',
    image: '/gallery/product-01.png',
    pills: [
      { label: 'Mascarpone', left: '6%', top: '10%', rotate: -8 },
      { label: 'Espresso', left: '54%', top: '6%', rotate: 7 },
      { label: 'Cocoa dust', left: '18%', top: '60%', rotate: -4 },
    ],
  },
  {
    name: 'Vanilla Bloom Cake',
    meta: 'Serves 6-8 · 24h notice',
    image: '/gallery/product-02.png',
    pills: [
      { label: 'Madagascar vanilla', left: '4%', top: '14%', rotate: 6 },
      { label: 'Meringue florals', left: '46%', top: '8%', rotate: -7 },
      { label: 'Whipped cream', left: '22%', top: '62%', rotate: 4 },
    ],
  },
  {
    name: 'Whisky Birthday Cake',
    meta: 'Custom · 48h notice',
    image: '/gallery/product-03.png',
    pills: [
      { label: 'Single malt', left: '4%', top: '12%', rotate: -6 },
      { label: 'Dark chocolate', left: '48%', top: '8%', rotate: 8 },
      { label: 'Salted caramel', left: '14%', top: '64%', rotate: -5 },
    ],
  },
  {
    name: 'Petit Fours Selection',
    meta: 'Box of 16 · 200 grams',
    image: '/gallery/product-04.png',
    pills: [
      { label: 'Praliné', left: '6%', top: '12%', rotate: 7 },
      { label: 'Pistachio', left: '52%', top: '8%', rotate: -6 },
      { label: 'Hazelnut', left: '22%', top: '62%', rotate: 5 },
    ],
  },
  {
    name: 'Custom Themed Cake',
    meta: 'Bespoke · 5-7 days notice',
    image: '/gallery/product-05.png',
    pills: [
      { label: 'Hand-sculpted', left: '4%', top: '14%', rotate: -7 },
      { label: 'Sugar paste', left: '50%', top: '8%', rotate: 6 },
      { label: 'Made to brief', left: '18%', top: '62%', rotate: -4 },
    ],
  },
]

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col rounded-[1.75rem] border-2 border-[#157c99] bg-[#FBF8EF] p-3 md:p-4"
    >
      {/* Image area + the three pop-up ingredient pills */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-[1.25rem] bg-[#ECE4D2]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.pills.map((pill, i) => (
          <span
            key={pill.label}
            style={{
              left: pill.left,
              top: pill.top,
              transform: `${hovered ? 'scale(1)' : 'scale(0)'} rotate(${pill.rotate}deg)`,
              opacity: hovered ? 1 : 0,
              transition: `transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms, opacity 0.25s ${i * 80}ms`,
            }}
            className="absolute origin-center whitespace-nowrap rounded-full bg-pink-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#2b211c]"
          >
            {pill.label}
          </span>
        ))}
      </div>

      {/* Name + meta — blue, heavy 900 Satt */}
      <h3 className="font-satt text-base font-black uppercase leading-[1.1] tracking-tight text-[#157c99] md:text-lg">
        {product.name}
      </h3>
      <p className="mt-1.5 text-xs font-bold text-[#157c99]/70">{product.meta}</p>
    </div>
  )
}

// Forwarded so the parent can pass a ref through — the CelebrateDonut needs
// this section's bounding box to know when to start its choreography (the
// donut emerges from off-screen left as Bestsellers enters the viewport).
const BestsellersSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="relative z-10 overflow-hidden bg-[#F5F0E8] py-32 md:py-44">
      {/* Tilted, continuously-scrolling marquee — alternating filled / outlined
          "Bestsellers". Each row is `w-max` (content width), so translating by
          -50% lands the duplicate exactly on the original — a seamless loop
          with no visible restart. */}
      <div className="pointer-events-none absolute inset-0 flex scale-125 -rotate-[8deg] select-none flex-col justify-center gap-16 md:gap-28">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex w-max whitespace-nowrap"
            style={{
              animation: 'marquee-x 30s linear infinite',
              animationDirection: row % 2 === 1 ? 'reverse' : 'normal',
            }}
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="font-satt px-5 text-[8vw] font-black uppercase leading-[0.85] tracking-tighter"
                    style={
                      (i + row) % 2 === 0
                        ? { color: '#157c99' }
                        : { color: 'transparent', WebkitTextStroke: '2px #157c99' }
                    }
                  >
                    Bestsellers
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Cream fade at the top and bottom edges so the marquee looks like it
          emerges from — and melts back into — the page. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-40 bg-gradient-to-b from-[#F5F0E8] to-transparent md:h-56" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-[#F5F0E8] to-transparent md:h-56" />

      {/* Cards — five small cards in one line */}
      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-2 gap-4 px-6 md:grid-cols-5 md:gap-5 md:px-12">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  )
})

BestsellersSection.displayName = 'BestsellersSection'

export default BestsellersSection
