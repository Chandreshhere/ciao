import type { Product } from '@/components/ProductCard'

// The five collection categories featured on /creations. Reuses the
// existing /public/gallery images and the same ProductCard pattern as
// the home Bestsellers row, with pop-up ingredient pills.
export const CREATIONS: Product[] = [
  {
    name: 'Custom Celebration Cakes',
    meta: 'Bespoke · 5–7 days',
    image: '/gallery/product-05.png',
    pills: [
      { label: 'Single tier', left: '6%', top: '12%', rotate: -7 },
      { label: 'Multi tier', left: '52%', top: '8%', rotate: 7 },
      { label: 'Themed', left: '20%', top: '62%', rotate: -4 },
    ],
  },
  {
    name: 'Dessert Shots',
    meta: 'Box of 6 · 24h notice',
    image: '/gallery/product-08.png',
    pills: [
      { label: 'Tiramisu', left: '6%', top: '14%', rotate: 5 },
      { label: 'Lemon', left: '54%', top: '8%', rotate: -6 },
      { label: 'Chocolate', left: '20%', top: '60%', rotate: 4 },
    ],
  },
  {
    name: 'French Macarons',
    meta: 'Box of 12 · made fresh',
    image: '/gallery/product-11.png',
    pills: [
      { label: 'Rose', left: '6%', top: '12%', rotate: -8 },
      { label: 'Pistachio', left: '52%', top: '8%', rotate: 6 },
      { label: 'Salted caramel', left: '18%', top: '64%', rotate: -4 },
    ],
  },
  {
    name: 'Pudding Collection',
    meta: 'Single & sharing sizes',
    image: '/gallery/product-13.png',
    pills: [
      { label: 'Sticky toffee', left: '6%', top: '12%', rotate: 6 },
      { label: 'Crème brûlée', left: '50%', top: '8%', rotate: -7 },
      { label: 'Bread & butter', left: '20%', top: '62%', rotate: 5 },
    ],
  },
  {
    name: 'Bespoke Designs',
    meta: 'Made to brief',
    image: '/gallery/product-16.png',
    pills: [
      { label: 'Hand-painted', left: '4%', top: '14%', rotate: -7 },
      { label: 'Sugar florals', left: '50%', top: '8%', rotate: 6 },
      { label: 'Made to brief', left: '18%', top: '62%', rotate: -4 },
    ],
  },
]
