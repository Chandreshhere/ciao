// Small pastry illustrations scattered through the empty areas of the pinned
// IntroSection background. These are lightweight inline-SVG stand-ins — I can't
// pull PNGs off the web, so they're placeholders: once real transparent PNGs
// land in `public/pastries/`, each SCATTER entry just swaps its `type` for an
// `<img src>` (or send the files and I'll wire them up). Pure decoration —
// pointer-events-none, sitting behind the section's box.

function Donut() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path
        fillRule="evenodd"
        fill="#F2A7D4"
        d="M10 50a40 40 0 1 0 80 0a40 40 0 1 0-80 0M35 50a15 15 0 1 0 30 0a15 15 0 1 0-30 0"
      />
      <rect x="28" y="22" width="3.5" height="9" rx="1.75" fill="#157c99" transform="rotate(24 29.75 26.5)" />
      <rect x="58" y="20" width="3.5" height="9" rx="1.75" fill="#FBF8EF" transform="rotate(-18 59.75 24.5)" />
      <rect x="74" y="44" width="3.5" height="9" rx="1.75" fill="#7FB3D0" transform="rotate(40 75.75 48.5)" />
      <rect x="20" y="46" width="3.5" height="9" rx="1.75" fill="#F2C94C" transform="rotate(-30 21.75 50.5)" />
    </svg>
  )
}

function Cupcake() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d="M30 56h40l-6 34H36z" fill="#C9925E" />
      <circle cx="38" cy="50" r="15" fill="#F2A7D4" />
      <circle cx="62" cy="50" r="15" fill="#F2A7D4" />
      <circle cx="50" cy="42" r="17" fill="#F2A7D4" />
      <circle cx="50" cy="22" r="6" fill="#D14B5A" />
    </svg>
  )
}

function Macaron() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <ellipse cx="50" cy="36" rx="36" ry="20" fill="#F2C94C" />
      <rect x="14" y="46" width="72" height="12" rx="6" fill="#FBF8EF" />
      <ellipse cx="50" cy="66" rx="36" ry="18" fill="#F2C94C" />
    </svg>
  )
}

function CakeSlice() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d="M22 84V44q28-12 56 0v40z" fill="#F4D9A0" />
      <path d="M22 44q28-12 56 0-28 8-56 0z" fill="#F2A7D4" />
      <rect x="22" y="60" width="56" height="6" fill="#E58BAA" />
      <circle cx="50" cy="38" r="5" fill="#D14B5A" />
    </svg>
  )
}

function Cookie() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <circle cx="50" cy="50" r="40" fill="#D9A066" />
      <circle cx="38" cy="38" r="6" fill="#5C3A21" />
      <circle cx="64" cy="46" r="5" fill="#5C3A21" />
      <circle cx="46" cy="64" r="5.5" fill="#5C3A21" />
      <circle cx="66" cy="66" r="4.5" fill="#5C3A21" />
      <circle cx="34" cy="58" r="3.5" fill="#5C3A21" />
    </svg>
  )
}

const PASTRIES = {
  donut: Donut,
  cupcake: Cupcake,
  macaron: Macaron,
  cakeSlice: CakeSlice,
  cookie: Cookie,
} as const

interface Placed {
  type: keyof typeof PASTRIES
  left: string
  top: string
  size: number
  rotate: number
}

// Scattered through the empty zones — the strips above / below the centred box
// and the side margins.
const SCATTER: Placed[] = [
  { type: 'donut', left: '7%', top: '12%', size: 84, rotate: -14 },
  { type: 'macaron', left: '34%', top: '5%', size: 66, rotate: 8 },
  { type: 'cupcake', left: '63%', top: '7%', size: 78, rotate: -10 },
  { type: 'cookie', left: '92%', top: '15%', size: 80, rotate: 12 },
  { type: 'cakeSlice', left: '4%', top: '52%', size: 76, rotate: 10 },
  { type: 'donut', left: '96%', top: '54%', size: 70, rotate: 18 },
  { type: 'cookie', left: '12%', top: '90%', size: 74, rotate: -8 },
  { type: 'macaron', left: '40%', top: '95%', size: 64, rotate: -16 },
  { type: 'cupcake', left: '70%', top: '92%', size: 80, rotate: 14 },
  { type: 'cakeSlice', left: '90%', top: '88%', size: 72, rotate: -12 },
]

export default function BgPastries() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {SCATTER.map((p, i) => {
        const Shape = PASTRIES[p.type]
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
            }}
          >
            <Shape />
          </div>
        )
      })}
    </div>
  )
}
