import { Canvas, useFrame, invalidate } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense, useRef, useEffect, type MutableRefObject } from 'react'
import { Vector3 } from 'three'

// The donut's scroll journey — entirely scroll-driven:
//   0 -> 1vh     — hero pinned: the donut zooms in, centred, pink side facing us.
//   1vh -> 2vh   — hero unpins: the donut flips once — fully placed by 2vh.
//   2vh -> 3.7vh — held dead centre while the section after the hero is pinned
//                  and the hand slides in, holds a good long beckon, and slides
//                  back out fully.
//   3.7vh -> 4.4vh — only THEN does the donut slowly roll off to the right, out
//                  of the screen. At 4.4vh the section's text falls (FallingText)
//                  and the pinned section unpins right after, at ~4.6vh.
const SCALE_START = 8
const SCALE_END = 10

// Diagonal flip axis in screen space (lower-left to upper-right). The camera
// looks straight down, so screen-right is world +X and screen-up is world -Z.
const DIAG_AXIS = new Vector3(1, 0, -1).normalize()
// The camera looks straight down world +Y, so spinning around world up reads as
// a wheel-like roll in the screen plane.
const WORLD_UP = new Vector3(0, 1, 0)

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
// Smoothstep easing — gentle acceleration in and out.
const smooth = (t: number) => t * t * (3 - 2 * t)

type Progress = { flip: number; scale: number; spin: number }

function Donut({
  progressRef,
}: {
  progressRef: MutableRefObject<Progress>
}) {
  const { scene } = useGLTF('/donut.glb')
  const meshRef = useRef<any>(null)

  useFrame(() => {
    if (!meshRef.current) return
    // Zoom + diagonal flip, both driven straight from scroll.
    meshRef.current.scale.setScalar(progressRef.current.scale)
    meshRef.current.setRotationFromAxisAngle(DIAG_AXIS, progressRef.current.flip)
    // Extra wheel-roll spin layered on for the roll-off-right exit.
    if (progressRef.current.spin) {
      meshRef.current.rotateOnWorldAxis(WORLD_UP, progressRef.current.spin)
    }
  })

  return <primitive ref={meshRef} object={scene} />
}

useGLTF.preload('/donut.glb')

export default function DonutScene() {
  // Scroll progress lives in a ref so scrolling never re-renders React.
  const progressRef = useRef<Progress>({ flip: 0, scale: SCALE_START, spin: 0 })
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const y = window.scrollY

      // Zoom (0 -> 1vh) + one full diagonal flip (1vh -> 2vh): placed by 2vh.
      progressRef.current.scale =
        SCALE_START + (SCALE_END - SCALE_START) * smooth(clamp(y / vh, 0, 1))
      progressRef.current.flip = smooth(clamp((y - vh) / vh, 0, 1)) * Math.PI * 2

      // Held dead centre while the hand slides in, holds a long beckon and
      // slides fully back out; only THEN does the donut slowly roll off to the
      // right and out of the screen (3.7vh -> 4.4vh).
      const spinT = smooth(clamp((y - 3.7 * vh) / (0.7 * vh), 0, 1))
      progressRef.current.spin = -spinT * Math.PI * 4 // two wheel-roll turns, rolling right

      if (innerRef.current) {
        innerRef.current.style.transform = `translateX(${spinT * vw * 0.85}px)`
        // Drop it once it has fully rolled off so the canvas stops rendering.
        innerRef.current.style.display = spinT >= 1 ? 'none' : 'block'
      }

      // Ask the (demand-mode) canvas to render exactly one frame.
      invalidate()
    }

    handleScroll() // sync initial state (e.g. on refresh mid-page)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    // Fixed, viewport-centred layer; the inner wrapper is held centred, then
    // translated to the right by the scroll-driven roll-off. z-40 so the donut
    // overlays everything — the intro text (z-30) and the hand (z-20) included
    // — sitting just below the z-50 navbar.
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(950px,92vw)] h-[min(950px,92vw)] pointer-events-none z-40">
      <div ref={innerRef} className="w-full h-full will-change-transform">
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 0], fov: 50 }}
        >
          {/* Lights dimmed to ~70% to bake the "0.3 black overlay" look into
              the render — cheaper than a CSS filter pass over the canvas. */}
          <ambientLight intensity={0.56} />
          <directionalLight position={[10, 10, 5]} intensity={1.05} />
          <Suspense fallback={null}>
            <Donut progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
