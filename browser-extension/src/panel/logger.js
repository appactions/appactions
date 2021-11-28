import React, { useState, useEffect } from 'react';
import { useDevtoolsContext } from './context';

export default function Logger() {
    const { bridge, store } = useDevtoolsContext();

    return (
        <>
            {/* <button
                onClick={() => {
                    bridge.debugMessage({ foo: 42424444 });
                }}
            >
                bridge.debugMessage
            </button>
            <br /> */}
            <button
                onClick={() => {
                    bridge.send('__debug', { foo: 42 });
                }}
            >
                bridge.send
            </button>
        </>
    );

    // const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     bridge.addListener('__message', () => {
    //         setMessages(() => bridge.__messages);
    //     });
    // }, []);

    // return (
    //     <ul>
    //         {messages.map((message, index) => (
    //             <li key={index}>{message}</li>
    //         ))}
    //     </ul>
    // );
}
