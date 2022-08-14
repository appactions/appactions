import React, { useEffect, useReducer } from 'react';
import { createDriver, annotate } from '@appactions/driver';

const filteredText = new Set(['', '>']);

const targetNode = document.getElementById('gameport');

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

    const header = targetNode
        .querySelector('.WindowFrame.GridWindow')
        .textContent.trim()
        .replace(/\s{3,}/g, '  ');

    dispatch({ type: 'setNode', header, text: result });
};

const config = {
    childList: true,
    subtree: true,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'setNode': {
            let header = null;
            const parsedHeader = action.header.match(
                /Erő:\s(?<power>\d+)\s+Eredmény:\s(?<score>\d+)\s+(?<direction>[\u10C80-\u10CFF ]+)/,
            );

            if (parsedHeader) {
                header = {
                    power: Number(parsedHeader.groups.power),
                    score: Number(parsedHeader.groups.score),
                    directions: parsedHeader.groups.direction.split(' ').filter(Boolean),
                };
            }

            return {
                ...state,
                textHistory: [state.text, ...state.textHistory],
                headerHistory: [state.header, ...state.headerHistory],
                text: action.text,
                header: header ? header : {},
            };
        }
        default: {
            return state;
        }
    }
};

const initial = { text: null, header: {}, textHistory: [], headerHistory: [] };

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
            <td>{JSON.stringify(data)}</td>
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

function Input({ directions = [] }) {
    const onSubmit = event => {
        event.preventDefault();

        const input = event.target.querySelector('input');
        const text = event.nativeEvent.submitter.name ?? input.value;
        // reset even when direction button was used
        input.value = '';

        targetNode.querySelector('.InvisibleCursor input').value = text;
        targetNode.querySelector('.InvisibleCursor input').dispatchEvent(
            new KeyboardEvent('keypress', {
                bubbles: true,
                cancelable: true,
                keyCode: 13, // Enter
            }),
        );

        annotate(event, {
            pattern: 'Input',
            action: 'send',
            args: [text],
        });
    };
    return (
        <tr>
            <th>Command</th>
            <td>
                <form onSubmit={onSubmit}>
                    <input type="text" />
                    <button type="submit">Send</button>
                    {' • '}
                    {directions.map(direction => (
                        <button key={direction} type="submit" name={direction}>
                            {direction}
                        </button>
                    ))}
                </form>
            </td>
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
                <Input directions={data.header.directions} />
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

createDriver(Input, {
    pattern: 'Input',
});
