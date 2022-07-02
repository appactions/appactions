import React, { useEffect, useReducer } from 'react';
import { createDriver } from '@appactions/driver';

const filteredText = new Set(['', '>']);

const callback = dispatch => mutationList => {
    let result = null;

    for (const mutation of mutationList) {
        if (mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                const text = node.textContent.trim();
                if (filteredText.has(text)) {
                    continue;
                }

                if (node.classList.contains('BufferLine')) {
                    result = result ? `${result}\n${text}` : text;
                }
            }
        }
    }

    const header = document
        .querySelector('.WindowFrame.GridWindow')
        .textContent.trim()
        .replace(/\s{3,}/g, '  ');

    dispatch({ type: 'setNode', header, text: result });
};

const config = {
    childList: true,
    subtree: true,
};

const targetNode = document.getElementById('gameport');

const reducer = (state, action) => {
    switch (action.type) {
        case 'setNode': {
            return {
                ...state,
                textHistory: [state.text, ...state.textHistory],
                headerHistory: [state.header, ...state.headerHistory],
                text: action.text,
                header: action.header,
            };
        }
        default: {
            return state;
        }
    }
};

const initial = { text: null, header: null, textHistory: [], headerHistory: [] };

const useBridge = () => {
    const [state, dispatch] = useReducer(reducer, initial);

    useEffect(() => {
        const observer = new MutationObserver(callback(dispatch));
        observer.observe(targetNode, config);
        return () => observer.disconnect();
    }, []);

    return state;
};

export default function App() {
    const state = useBridge();
    return (
        <>
            <h1>Quixe</h1>
            <h2>{state.header ? state.header : '-'}</h2>
            <h2>{state.text ? state.text : '-'}</h2>
            <h2>History size: {state.textHistory.length}</h2>
        </>
    );
}

createDriver(App, {
    pattern: 'App',
});
