import React from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/web'
import Scene from './Game'

export default function App() {
  // This spring controls the background and the svg fill (text color)
  const [{ background, fill }, set] = useSpring({ background: '#f0f0f0', fill: '#202020' }, [])
  return (
    <a.main style={{ background }}>
      <Canvas className="canvas" dpr={[1, 2]}>
        <Scene setBg={set} />
      </Canvas>
    </a.main>
  )
}
