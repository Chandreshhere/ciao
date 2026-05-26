import { useState } from 'react'
import { motion } from 'framer-motion'

export interface Pill {
  label: string
  left: string
  top: string
  rotate: number
}

export interface Product {
  name: string
  meta: string
  image: string
  pills: Pill[]
}

// Blue-bordered cream card with the product image; hovering pops three
// ingredient pills out at scattered spots, each scale + fade-in with a
// per-pill stagger via inline CSS transitions.
//
// `lift` opts into a subtle Framer Motion hover lift used on the
// /creations page; the home page Bestsellers row keeps the original
// no-lift behaviour by leaving it false.
export default function ProductCard({
  product,
  lift = false,
}: {
  product: Product
  lift?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const Card = lift ? motion.div : 'div'

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={lift ? { y: -6, scale: 1.02 } : undefined}
      transition={lift ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] } : undefined}
      className="flex flex-col rounded-[1.75rem] border-2 border-[#157c99] bg-[#FBF8EF] p-3 md:p-4"
    >
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

      <h3 className="font-satt text-base font-black uppercase leading-[1.1] tracking-tight text-[#157c99] md:text-lg">
        {product.name}
      </h3>
      <p className="mt-1.5 text-xs font-bold text-[#157c99]/70">{product.meta}</p>
    </Card>
  )
}
