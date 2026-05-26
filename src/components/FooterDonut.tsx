import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'

// A small donut that just sits and tumbles forever on the left side of
// the footer. Mobile-only — `md:hidden` hides the canvas at md+. Re-uses
// the same /donut.glb the hero scenes load, cloning the scene so this
// canvas doesn't fight the hero/celebrate scenes for the same mesh.
const SCALE = 20

function Donut() {
  const { scene } = useGLTF('/donut.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const meshRef = useRef<any>(null)

  // Time-based tumble across all three axes at different speeds —
  // independent of scroll, so the donut keeps spinning forever.
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

export default function FooterDonut() {
  return (
    <div className="md:hidden pointer-events-none absolute -left-8 bottom-96 z-20 h-60 w-60">
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 3.5, 3], fov: 45 }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <Donut />
        </Suspense>
      </Canvas>
    </div>
  )
}
