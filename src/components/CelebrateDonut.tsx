import { Canvas, useFrame, invalidate } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense, useRef, useEffect, useMemo, type RefObject } from 'react'

// A second instance of the hero's 3D donut. Scroll-driven choreography
// + a continuously tumbling model. Scroll position drives the orbit and
// the landing; the donut's own self-rotation is time-based inside the
// Canvas's useFrame, so it keeps spinning forever (even when scroll has
// stopped, and after it has landed on the image).
//
// The Celebrate section pins (sticky top:0 inside a tall outer section)
// for the whole animation. Phase boundaries are derived from that pin
// range, so the donut completes its revolution + landing exactly while
// the section is held in view.
//
//   Phase 0 — Bestsellers entering → Celebrate's pin begins. The donut
//             slides diagonally from off the LEFT edge of Bestsellers
//             toward the FRONT of the arch. Its z-index sits BELOW the
//             cream gradient (z-15) and Bestsellers (z-10) while the
//             donut's centre is still in the gradient's vertical band,
//             then flips ABOVE the image (z-25) once it has passed
//             below the gradient — so it literally emerges from behind
//             the page.
//   Phase A — First 70% of the pin range. One full CLOCKWISE revolution
//             around the cake-house image. Depth is sold by BOTH
//             - scale (0.55 at back → 1.25 at front: the donut actually
//               looks like it's coming closer / going further), and
//             - z-index flip (behind the image at back-half, in front
//               at front-half).
//   Phase B — Last 30% of the pin range. A direct diagonal move from
//             FRONT of the orbit to the TOP-RIGHT of the cake-house
//             image (not centre-then-up). Scale eases back to 1.
//
// The donut's own rotation is handled inside `Donut`'s useFrame —
// continuous tumble across X, Y, Z at different speeds. Independent
// of scroll, so the donut visibly keeps spinning after it lands.
const SCALE = 20
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const smooth = (t: number) => t * t * (3 - 2 * t)

function Donut() {
  const { scene } = useGLTF('/donut.glb')
  // Clone — this canvas is separate from the hero's, and a Three.js object
  // can only live in one scene at a time.
  const cloned = useMemo(() => scene.clone(true), [scene])
  const meshRef = useRef<any>(null)

  // Time-based tumble across all three axes at different speeds — so the
  // donut visibly rotates "in every direction" (not just spinning), and
  // keeps rotating forever (independent of scroll). Different speeds per
  // axis keep the motion non-mechanical.
  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.scale.setScalar(SCALE)
    meshRef.current.rotation.x += delta * 0.4
    meshRef.current.rotation.y += delta * 0.7
    meshRef.current.rotation.z += delta * 0.3
  })

  return <primitive ref={meshRef} object={cloned} />
}

useGLTF.preload('/donut.glb')

export default function CelebrateDonut({
  archRef,
  buttonRef,
  startRef,
  sectionRef,
}: {
  archRef: RefObject<HTMLElement | null>
  buttonRef: RefObject<HTMLElement | null>
  startRef: RefObject<HTMLElement | null>
  sectionRef: RefObject<HTMLElement | null>
}) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastSy = -1
    let rafId: number | null = null

    // All DOM reads + writes are funneled through a single rAF callback so
    // updates land at the screen's refresh rate (60 Hz, 120 Hz on
    // high-refresh displays) without re-running on every scroll event.
    // Scroll events just request a frame; the actual work is GPU-friendly
    // (transform / opacity only — no left/top, no display toggles).
    const update = () => {
      rafId = null
      const arch = archRef.current
      const section = sectionRef.current
      const wrap = wrapRef.current
      if (!arch || !section || !wrap) return

      const vh = window.innerHeight
      const sy = window.scrollY
      const a = arch.getBoundingClientRect()
      const sec = section.getBoundingClientRect()

      // Sticky pin range — the inner sticky frame stays pinned from
      // `sectionAbsTop` until the section's bottom reaches the bottom
      // of the viewport. All of Phase A and Phase B run inside the pin.
      const sectionAbsTop = sec.top + sy
      const stickyEndY = sectionAbsTop + sec.height - vh

      // Phase-trigger scroll positions (absolute document Y).
      //   phase0  : Celebrate is ~60% into the viewport (gradient is
      //             visible) → Celebrate's pin begins. Donut starts off
      //             screen on the LEFT, sitting inside the cream
      //             gradient's vertical band (so it's literally hidden
      //             behind the gradient at first), then glides
      //             diagonally to the FRONT of the arch as it emerges
      //             out from beneath the gradient.
      //   phaseA  : First 70% of the pin range. One full revolution.
      //   phaseB  : Last 30% of the pin range. Lands on the top-right
      //             of the cake-house image; section unpins after.
      const phase0StartY = sectionAbsTop - vh * 0.6
      const phase0EndY = sectionAbsTop
      const stickyLen = Math.max(stickyEndY - sectionAbsTop, 1)
      const phaseAEndY = sectionAbsTop + stickyLen * 0.7
      const phaseBEndY = stickyEndY

      // Horizontal XZ orbit sized to the cake-house image: the donut just
      // clears the image's left/right edges at the orbit sides, so the
      // back-half visibly passes BEHIND the image (hidden by the cream
      // backdrop at z=5) and the donut re-emerges from the opposite side.
      const cx = a.left + a.width / 2
      const cy = a.top + a.height / 2
      const R = a.width * 0.55

      let x = 0
      let y = 0
      let scale = 1
      let zIndex = 4
      let opacity = 0
      let visible = true

      // Cream gradient at the top of the section (z-15) — donut hides
      // behind it while its on-screen position is in the gradient's
      // vertical band, so it literally emerges from behind the page.
      const gradientH = window.innerWidth >= 768 ? 256 : 192 // h-64 / h-48
      const frameTopInView = Math.max(0, sec.top)
      const gradientBottomY = frameTopInView + gradientH

      if (sy < phase0StartY || a.bottom < -120) {
        // Before the entrance window, or after the cake-house image
        // has scrolled well past the top — donut is parked off-screen.
        visible = false
      } else if (sy < phase0EndY) {
        // Phase 0 — donut starts OFF screen left AND inside the cream
        // gradient's vertical band, so z=4 (below gradient z=15) means
        // the gradient literally hides it at the start. As scroll
        // progresses, the donut glides diagonally toward the FRONT of
        // the arch, crossing below the gradient's bottom edge somewhere
        // mid-phase — at which point z flips to 25 and the donut
        // appears, EMERGING from underneath the gradient.
        const e = smooth(
          clamp((sy - phase0StartY) / Math.max(phase0EndY - phase0StartY, 1), 0, 1),
        )
        const sX = -100
        const sY = Math.max(0, sec.top) + 80 // inside gradient band
        x = sX + (cx - sX) * e
        y = sY + (cy - sY) * e
        // Ramp ends at 1.08 to match Phase A's start scale at theta = π/2
        // (depthRatio = 1 → 0.92 + 0.16 = 1.08). Continuous handoff.
        scale = 1 + e * 0.08
        opacity = 1
        zIndex = y < gradientBottomY ? 4 : 25
      } else if (sy < phaseAEndY) {
        // Phase A — one full CLOCKWISE revolution in the horizontal XZ
        // plane: FRONT → RIGHT → BACK → LEFT → FRONT. The donut visibly
        // moves IN DEPTH as well as side-to-side:
        //   • scale  : bigger when in front of the image, smaller when
        //              behind it (perspective). Sells "actually revolving
        //              in 3D" instead of "sliding left/right on top".
        //   • z-index: flips to 4 (behind the cream backdrop and image)
        //              for the back-half, 25 (in front of the image) for
        //              the front-half.
        const e = smooth(
          clamp((sy - phase0EndY) / Math.max(phaseAEndY - phase0EndY, 1), 0, 1),
        )
        const theta = Math.PI / 2 - e * Math.PI * 2
        const localX = R * Math.cos(theta)
        const localZ = R * Math.sin(theta)
        x = cx + localX
        y = cy
        const depthRatio = (localZ + R) / (2 * R) // 0 = back, 1 = front
        // Subtle perspective only — no dramatic shrink. The "behind"
        // illusion is sold by the z-index flip, not by scale.
        scale = 0.92 + depthRatio * 0.16 // ~0.92 at back → ~1.08 at front
        zIndex = localZ < 0 ? 4 : 25
        opacity = 1
      } else {
        // Phase B — short, direct diagonal move from FRONT of the orbit
        // (where Phase A ended, scale 1.08) to the TOP-RIGHT of the
        // cake-house image. No "centre then up": one smooth diagonal.
        // Scale eases back to 1.0 so the donut sits cleanly on the image.
        const e = smooth(
          clamp((sy - phaseAEndY) / Math.max(phaseBEndY - phaseAEndY, 1), 0, 1),
        )
        const targetX = a.left + a.width * 0.8 // 80% across the image
        const targetY = a.top + a.height * 0.15 // top 15%
        x = cx + (targetX - cx) * e
        y = cy + (targetY - cy) * e
        scale = 1.08 + e * (1 - 1.08) // 1.08 → 1.0
        zIndex = 30
        opacity = 1
      }

      if (visible) {
        // GPU-accelerated transform: translate3d kicks the wrap onto its
        // own compositor layer, so position updates don't trigger layout
        // or paint of the surrounding page. translate(-50%, -50%) centres
        // the box on (x, y); the donut wrap is anchored at top-left:0,0.
        wrap.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
        wrap.style.opacity = String(opacity)
        wrap.style.zIndex = String(zIndex)
      } else {
        // Stay in layout (no display:none → no layout thrash), but hide
        // visually and park off-screen so the canvas stays unpainted.
        wrap.style.transform = 'translate3d(-9999px, -9999px, 0)'
        wrap.style.opacity = '0'
      }

      // Donut's self-rotation is handled entirely by the Canvas's
      // useFrame (continuous tumble across X / Y / Z), independent of
      // scroll. That gives the "infinite-direction" rotation the user
      // wants AND the "keep spinning" behaviour after it lands.
      if (visible && sy !== lastSy) {
        invalidate()
        lastSy = sy
      }
    }

    // Scroll listener just schedules a single rAF (coalesces bursts of
    // scroll events into one update per frame). This is the key to
    // matching 120Hz monitors without skipping.
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    update() // initial sync
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [archRef, buttonRef, startRef])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 h-[16rem] w-[16rem] will-change-transform md:h-[22rem] md:w-[22rem]"
      style={{
        opacity: 0,
        zIndex: 4,
        // Parked off-screen until the first frame of work positions it.
        // Keeping it in layout (no display:none) avoids reflow churn on
        // every show/hide.
        transform: 'translate3d(-9999px, -9999px, 0)',
      }}
    >
      <Canvas
        // frameloop="always" so the donut keeps tumbling continuously —
        // even after the orbit lands on the image — without relying on
        // scroll events to drive new frames.
        frameloop="always"
        dpr={[1, 1.5]}
        // Camera tilted up-and-back (not pure top-down) so we see the
        // donut at a 3/4 angle: top, front face and hole all visible.
        // Without this tilt the donut is rotationally symmetric from a
        // straight-down view and the spin reads as "not rotating".
        camera={{ position: [0, 3.5, 3], fov: 45 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <Donut />
        </Suspense>
      </Canvas>
    </div>
  )
}
