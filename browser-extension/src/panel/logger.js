import React, { useState, useEffect } from 'react';
import { useDevtoolsContext } from './context';

export default function Logger() {
    const { bridge, store } = useDevtoolsContext();
    const [messages, setMessages] = useState(['-']);

    useEffect(() => {
        bridge.addListener('__debug', msg => {
            setMessages(messages => [...messages, JSON.stringify(msg)]);
        });
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    bridge.send('__debug', { foo: messages.length });
                }}
            >
                bridge.send
            </button>
            <br />
            <ol>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ol>
        </>
    );
}
