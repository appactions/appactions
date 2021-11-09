import React, { useRef, useState } from 'react';
import { Environment, MeshDistortMaterial, ContactShadows } from '@react-three/drei';
import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';

// React-spring animates native elements, in this case <mesh/> etc,
// but it can also handle 3rd–party objs, just wrap them in "a".
const AnimatedMaterial = a(MeshDistortMaterial);

export default function Cell({ onClick, hoverColor = '#E8B059', position, shadow }) {
    const mode = false; // light or dark mode of scene
    const down = false;

    const [hovered, setHovered] = useState(false);

    const [{ wobble, coat, color, env }] = useSpring(
        {
            wobble: down ? 1.2 : hovered ? 1.05 : 1,
            coat: mode && !hovered ? 0.04 : 1,
            env: mode && !hovered ? 0.4 : 1,
            color: hovered ? hoverColor : mode ? '#202020' : 'white',
            config: n => n === 'wobble' && hovered && { mass: 2, tension: 1000, friction: 10 },
        },
        [mode, hovered, down],
    );

    const sphere = useRef();

    return (
        <>
            <a.mesh
                ref={sphere}
                scale={wobble}
                position={position}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onPointerUp={onClick}
            >
                <sphereBufferGeometry args={[0.4, 32, 32]} />
                <AnimatedMaterial
                    color={color}
                    envMapIntensity={env}
                    clearcoat={coat}
                    clearcoatRoughness={0}
                    metalness={0.1}
                />
            </a.mesh>
            <Environment preset="warehouse" />
            {shadow ? (
                <ContactShadows
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, -1.6, 0]}
                    opacity={mode ? 0.8 : 0.4}
                    width={15}
                    height={15}
                    blur={2.5}
                    far={1.6}
                />
            ) : null}
        </>
    );
}
