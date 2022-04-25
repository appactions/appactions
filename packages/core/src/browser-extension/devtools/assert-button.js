import React, { useState } from 'react';
import { useDevtoolsContext } from './context';
import { useStore, useTemporaryState } from './hooks';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function ChevronDownIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function AssertButton() {
    const { bridge } = useDevtoolsContext();
    const [open, setOpen] = useState(false);
    const [justPressed, setPressed] = useTemporaryState(false);
    const [selectedSelector, setSelectedSelector] = useState(null);
    const selectedElement = useStore('selectionChange', store => {
        return store.getPatternByID(store.selectedElementID);
    });

    if (!selectedElement) {
        return <span className="inline-flex text-gray-500 items-center">Select a pattern for assert</span>;
    }

    // if we change selection, but the selected element is not available, fallback to the first one
    // this way we can keep the state as switching between elements
    const asserter = selectedElement.selectors.includes(selectedSelector) ? selectedSelector : selectedElement.selectors[0];

    return (
        <>
            <span className="inline-flex text-gray-500 items-center">Assert:</span>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-32 flex-col"
                    onClick={() => {
                        bridge.send('session-recording-assert', {
                            id: selectedElement.id,
                            asserter,
                        });
                        setPressed(true);
                    }}
                    disabled={justPressed}
                >
                    {justPressed ? <TickIcon /> : asserter}
                </button>

                <span className="-ml-px relative block">
                    <button
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => setOpen(open => !open)}
                    >
                        <span className="sr-only">Open options</span>
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {open ? (
                        <ul className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-center">
                            <div className="py-1">
                                {selectedElement.selectors.map(selector => (
                                    <li key={selector}>
                                        <a
                                            className={classNames(
                                                false ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50',
                                                'block px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer',
                                            )}
                                            onClick={() => {
                                                setSelectedSelector(selector);
                                                setOpen(false);
                                            }}
                                        >
                                            {selector}
                                        </a>
                                    </li>
                                ))}
                            </div>
                        </ul>
                    ) : null}
                </span>
            </span>
        </>
    );
}

function TickIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );
}
