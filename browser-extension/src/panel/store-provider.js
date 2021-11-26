import React, { useEffect, useState } from 'react';
import Store from 'cypress-app-actions/src/vendor/react-devtools-renderer-build/storage';
import Bridge from './bridge';
import { DevtoolsContext } from './context';

const initProvider = () => {
    const connection = chrome.runtime.connect({ name: 'devtools' });

    const bridge = new Bridge({
        listen(fn) {
            const handleMessage = msg => {
                if (msg?.source !== 'agent') {
                    return;
                }

                fn({
                    event: msg.type, // bridge expects "event", but the extension is written for "type", not fixing that lol
                    payload: msg.payload,
                });
            };

            connection.onMessage.addListener(handleMessage);
            return () => connection.onMessage.removeListener(handleMessage);
        },
        send(type, payload, transferable) {
            connection.postMessage({ source: 'devtools', type, payload }, '*', transferable);
        },
    });

    const store = new Store(bridge);

    const handleConnection = () => {
        bridge.addListener('connection-init', () => {
            bridge.send('connection-acknowledge');
        });

        bridge.send('connection-init', {
            tabId: chrome?.devtools?.inspectedWindow?.tabId,
        });

        return () => {
            bridge.shutdown();
        };
    };

    return { bridge, store, handleConnection };
};

export default function StoreProvider({ children }) {
    const [{ bridge, store, handleConnection }] = useState(initProvider);

    useEffect(handleConnection, []);

    return <DevtoolsContext.Provider value={{ bridge, store }}>{children}</DevtoolsContext.Provider>;
}
