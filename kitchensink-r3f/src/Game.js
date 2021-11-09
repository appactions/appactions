import React, { Suspense, useRef } from 'react';
import { PerspectiveCamera, Html } from '@react-three/drei';
import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';

import { useMachine } from '@xstate/react';
import { ticTacToeMachine } from './machine';
import Cell from './Cell';

function Title({ currentState, send }) {
    if (currentState.matches('playing')) {
        return <h2>Player {currentState.context.player.toUpperCase()}</h2>;
    }

    if (currentState.matches('winner')) {
        return (
            <h2>
                Player {currentState.context.winner.toUpperCase()} wins!{' '}
                <button onClick={() => send('RESET')}>Reset</button>
            </h2>
        );
    }

    if (currentState.matches('draw')) {
        return (
            <h2>
                Draw <button onClick={() => send('RESET')}>Reset</button>
            </h2>
        );
    }

    return null;
}

export default function Game() {
    const mode = false; // light or dark mode of scene
    const hovered = false;

    const light = useRef();
    const [current, send] = useMachine(ticTacToeMachine);

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
            <PerspectiveCamera makeDefault position={[-2, 2.5, 5]}>
                <a.ambientLight intensity={ambient} />
                <a.pointLight ref={light} position-z={-15} intensity={env} color="#F8C069" />
            </PerspectiveCamera>
            <Suspense fallback={null}>
                <mesh position={[0, 3, 0]}>
                    <Html className="title" occlude transform>
                        <Title currentState={current} send={send} />
                    </Html>
                </mesh>
                <Cell position={[0, 0, 0]} shadow />
                <Cell position={[0, 1, 0]} shadow />
                <Cell position={[0, 2, 0]} shadow />
                <Cell position={[-1, 0, 0]} />
                <Cell position={[-1, 1, 0]} />
                <Cell position={[-1, 2, 0]} />
                <Cell position={[1, 0, 0]} />
                <Cell position={[1, 1, 0]} />
                <Cell position={[1, 2, 0]} />
            </Suspense>
        </>
    );
}
