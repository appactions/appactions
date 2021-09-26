import React, { useEffect, useRef, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import Tree from './panel/tree';
import { DevtoolsContext } from './panel/context';
import './style.css';

const createConnection = () => {
    const connection = chrome.runtime.connect({ name: 'devtools' });

    return connection;
};

let index = 0;

const DevTools = () => {
    const [client, setClient] = useState({
        connected: false,
    });
    const connection = useRef(createConnection());

    /** Collection of operation events */
    const messageHandlers = useRef({});

    const sendMessage = useCallback(payload => connection.current.postMessage({ source: 'devtools', payload }), []);

    const addMessageHandler = useCallback(callback => {
        const i = index++;
        messageHandlers.current[i] = callback;

        return () => {
            delete messageHandlers.current[i];
        };
    }, []);

    // Send init message on mount
    useEffect(() => {
        // chrome.devtools.inspectedWindow.eval(
        //     'console.log("devtools!!!, ' + chrome?.devtools?.inspectedWindow?.tabId + '");',
        // );
        connection.current.postMessage({
            type: 'connection-init',
            source: 'devtools',
            tabId: chrome?.devtools?.inspectedWindow?.tabId,
        });
    }, []);

    // Forward agent messages to subscribers
    useEffect(() => {
        const handleMessage = msg => {
            if (msg?.source !== 'agent') {
                return;
            }

            return Object.values(messageHandlers.current).forEach(h => h(msg));
        };

        connection.current.onMessage.addListener(handleMessage);
        return () => connection.current.onMessage.removeListener(handleMessage);
    }, []);

    // Listen for client connect
    useEffect(() => {
        if (client.connected) {
            return;
        }

        return addMessageHandler(message => {
            if (message.type !== 'connection-acknowledge' && message.type !== 'connection-init') {
                return;
            }

            if (message.type === 'connection-init') {
                connection.current.postMessage({
                    type: 'connection-acknowledge',
                    source: 'devtools',
                });
            }

            return setClient({
                connected: true,
            });
        });
    }, [addMessageHandler, client.connected]);

    // Listen for client disconnect
    useEffect(() => {
        if (!client.connected) {
            return;
        }

        return addMessageHandler(message => {
            if (message.type !== 'connection-disconnect') {
                return;
            }

            setClient({ connected: false });
        });
    }, [addMessageHandler, client.connected]);

    return (
        <DevtoolsContext.Provider value={{ sendMessage, addMessageHandler, client }}>
            <Tree />
        </DevtoolsContext.Provider>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<DevTools />, root);
