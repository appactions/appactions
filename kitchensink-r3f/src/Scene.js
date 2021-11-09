import React, { Suspense, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';
import Cell from './Cell';

export default function Scene() {
    const mode = false; // light or dark mode of scene
    const hovered = false;

    const light = useRef();

    const [{ ambient, env }] = useSpring(
        {
            ambient: mode && !hovered ? 1.5 : 0.5,
            env: mode && !hovered ? 0.4 : 1,
            config: n => hovered && { mass: 2, tension: 1000, friction: 10 },
        },
        [mode, hovered],
    );

    return (
        <>
            <PerspectiveCamera makeDefault position={[-2, 0, 4]} fov={75}>
                <a.ambientLight intensity={ambient} />
                <a.pointLight ref={light} position-z={-15} intensity={env} color="#F8C069" />
            </PerspectiveCamera>
            <Suspense fallback={null}>
                <Cell position={[0, 0, 0]} shadow />
                <Cell position={[0, 1, 0]} shadow />
                <Cell position={[0, 2, 0]} shadow />
                <Cell position={[-1, 0, 0]}  />
                <Cell position={[-1, 1, 0]}  />
                <Cell position={[-1, 2, 0]}  />
                <Cell position={[1, 0, 0]}  />
                <Cell position={[1, 1, 0]}  />
                <Cell position={[1, 2, 0]}  />
            </Suspense>
        </>
    );
}
