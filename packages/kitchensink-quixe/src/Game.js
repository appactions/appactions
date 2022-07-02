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

const useGameScraper = () => {
    const [state, dispatch] = useReducer(reducer, initial);

    useEffect(() => {
        const observer = new MutationObserver(callback(dispatch));
        observer.observe(targetNode, config);
        return () => observer.disconnect();
    }, []);

    return state;
};

function Header({ data }) {
    return (
        <tr>
            <th>Header</th>
            <td>{data}</td>
        </tr>
    );
}

function Text({ data }) {
    return (
        <tr>
            <th>Text</th>
            <td>{data}</td>
        </tr>
    );
}

function History({ data }) {
    return (
        <tr>
            <th>History size (text)</th>
            <td>{data}</td>
        </tr>
    );
}

export default function Game() {
    const data = useGameScraper();
    return (
        <table>
            <tbody>
                <Header data={data.header} />
                <Text data={data.text} />
                <History data={data.textHistory.length} />
            </tbody>
        </table>
    );
}

createDriver(Game, {
    pattern: 'Game',
});

createDriver(Header, {
    pattern: 'Header',
});

createDriver(Text, {
    pattern: 'Text',
});

createDriver(History, {
    pattern: 'History',
});
