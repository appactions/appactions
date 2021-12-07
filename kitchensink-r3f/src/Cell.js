import React, { useRef, useState } from 'react';
import { Environment, MeshDistortMaterial, ContactShadows } from '@react-three/drei';
import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';
import { register } from 'cypress-app-actions/driver';

// React-spring animates native elements, in this case <mesh/> etc,
// but it can also handle 3rd–party objs, just wrap them in "a".
const AnimatedMaterial = a(MeshDistortMaterial);

export default function Cell({ currentState, send, index, position, shadow }) {
    const mode = false; // light or dark mode of scene
    const down = false;
    const hoverColor = '#E8B059';

    const [hovered, setHovered] = useState(false);

    const player = currentState.context.board[index];

    const [{ wobble, coat, color, env }] = useSpring(
        {
            wobble: player ? 1 : hovered ? 1.1 : 1,
            coat: mode && !hovered ? 0.04 : 1,
            env: mode && !hovered ? 0.4 : 1,
            color: player ? (player === 'x' ? 'red' : 'blue') : 'white',
            config: n => n === 'wobble' && hovered && { mass: 2, tension: 1000, friction: 10 },
        },
        [player, mode, hovered, down],
    );

    return (
        <>
            <a.mesh
                scale={wobble}
                position={position}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onPointerUp={() => {
                    setHovered(false);
                    send({ type: 'PLAY', value: index });
                }}
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
            <Environment files="empty_warehouse_01_1k.hdr" />
            {shadow ? (
                <ContactShadows
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, -1, 0]}
                    opacity={mode ? 0.8 : 0.4}
                    width={15}
                    height={15}
                    blur={3.5}
                    far={2.6}
                />
            ) : null}
        </>
    );
}

register(Cell, {
    role: 'CellRole',
});
