import { useRef, useState, useEffect, type ReactNode } from 'react'
import Matter from 'matter-js'

// A box of text whose every word drops with Matter.js physics — adapted from
// the React Bits "FallingText" effect. It takes one or more styled `segments`
// (e.g. a heading + a paragraph): each segment keeps its own font / size /
// colour, but ALL their words share ONE physics world, so once they fall the
// two texts mingle together inside the same box. Nothing about the styling
// changes until it falls; the drop is triggered by the controlled `start` prop.
interface Segment {
  text: string
  className?: string
}
interface FallingTextProps {
  segments: Segment[]
  start?: boolean
  className?: string
  contentClassName?: string
  /** Extra content rendered inside the box, behind the text (e.g. image cards). */
  children?: ReactNode
  gravity?: number
  mouseConstraintStiffness?: number
  backgroundColor?: string
  wireframes?: boolean
}

const FallingText: React.FC<FallingTextProps> = ({
  segments,
  start = false,
  className = '',
  contentClassName = 'p-6 md:p-10',
  children,
  gravity = 1,
  mouseConstraintStiffness = 0.6,
  backgroundColor = 'transparent',
  wireframes = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  const [effectStarted, setEffectStarted] = useState(false)

  // Build the words: each segment is its own block, keeping its own styling;
  // every word is an inline-block span the physics can later pick up.
  useEffect(() => {
    if (!textRef.current) return
    textRef.current.innerHTML = segments
      .map((seg) => {
        const words = seg.text
          .split(' ')
          .map(
            (word) =>
              `<span class="inline-block mx-[0.12em] select-none">${word}</span>`,
          )
          .join(' ')
        return `<div class="block ${seg.className ?? ''}">${words}</div>`
      })
      .join('')
  }, [segments])

  // Controlled trigger — once `start` flips true the drop begins (and stays).
  useEffect(() => {
    if (start) setEffectStarted(true)
  }, [start])

  useEffect(() => {
    if (!effectStarted) return
    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter
    if (!containerRef.current || !canvasContainerRef.current || !textRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const width = containerRect.width
    const height = containerRect.height
    if (width <= 0 || height <= 0) return

    const engine = Engine.create()
    engine.world.gravity.y = gravity

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: { width, height, background: backgroundColor, wireframes },
    })

    const boundary = { isStatic: true, render: { fillStyle: 'transparent' } }
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundary)
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundary)
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundary)
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundary)

    // Every word from every segment shares this one physics world, so the
    // texts mingle once they drop.
    const wordSpans = textRef.current.querySelectorAll('span')
    const wordBodies = [...wordSpans].map((el) => {
      const elem = el as HTMLElement
      const rect = elem.getBoundingClientRect()
      const x = rect.left - containerRect.left + rect.width / 2
      const y = rect.top - containerRect.top + rect.height / 2
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: 'transparent' },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      })
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05)
      return { elem, body }
    })

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute'
      elem.style.left = `${body.position.x}px`
      elem.style.top = `${body.position.y}px`
      elem.style.transform = 'translate(-50%, -50%)'
    })

    const mouse = Mouse.create(containerRef.current)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } },
    })
    render.mouse = mouse

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map((wb) => wb.body),
    ])

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    let raf = 0
    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`
        elem.style.top = `${body.position.y}px`
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`
      })
      raf = requestAnimationFrame(updateLoop)
    }
    updateLoop()

    return () => {
      cancelAnimationFrame(raf)
      Render.stop(render)
      Runner.stop(runner)
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas)
      }
      World.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Extra content (image cards) — sits behind the text so the words fall
          in front of it. */}
      {children}
      {/* Pre-fall layout of the segments (e.g. a 2-column grid); once the words
          drop they're absolutely positioned by the physics regardless. */}
      <div ref={textRef} className={contentClassName} />
      <div className="absolute left-0 top-0 z-0" ref={canvasContainerRef} />
    </div>
  )
}

export default FallingText
