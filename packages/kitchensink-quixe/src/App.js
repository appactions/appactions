import React, { useEffect, useReducer } from 'react';

const filteredText = new Set(['', '>']);

const callback = dispatch => mutationList => {
    // dispatch({ type: 'startScene' });
    for (const mutation of mutationList) {
        if (mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                const text = node.textContent.trim();
                if (filteredText.has(text)) {
                    continue;
                }

                if (node.classList.contains('BufferLine')) {
                    dispatch({ type: 'addText', text });
                }
            }
        }
    }
    // dispatch({ type: 'endScene' });
};

const config = {
    childList: true,
    subtree: true,
};

const targetNode = document.getElementById('gameport');

const reducer = (state, action) => {
    switch (action.type) {
        case 'startScene': {
            return state;
        }
        case 'addText': {
            return {
                ...state,
                text: action.text,
            };
        }
        case 'endScene': {
            return state;
        }
        default: {
            return state;
        }
    }
};

const useBridge = () => {
    const [state, dispatch] = useReducer(reducer, { text: null });

    useEffect(() => {
        const observer = new MutationObserver(callback(dispatch));
        observer.observe(targetNode, config);
        return () => observer.disconnect();
    }, []);

    return state;
};

export default function App() {
    const state = useBridge();
    console.log('state', state);
    return <h1>YOLO</h1>;
}
