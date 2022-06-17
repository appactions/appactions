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
    const { bridge, store } = useDevtoolsContext();
    const [open, setOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState('');
    const [justSubmitted, setSubmitted] = useTemporaryState(false);
    const [preferredAssert, setPreferredAssert] = useState(null);
    const selectedElement = useStore('selectionChange', store => {
        return store.getPatternByID(store.selectedElementID);
    });
    const submit = event => {
        event.preventDefault();
        bridge.send('session-recording-assert', {
            id: selectedElement.id,
            action: assertConfig.name,
            // test: assertConfig.test,
            args: [],
            value: currentValue ? currentValue : null,
        });
        setSubmitted(true);
        setCurrentValue('');
    };

    if (!selectedElement) {
        return <span className="inline-flex items-center text-gray-500">Select a pattern for assert</span>;
    }

    const assertConfig =
        selectedElement.asserts.find(assert => assert.name === preferredAssert) || selectedElement.asserts[0];

    return (
        <form className="inline-flex gap-x-2" onSubmit={submit}>
            <span className="inline-flex items-center text-gray-500">Assert:</span>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                    className="relative inline-flex flex-col items-center px-4 py-2 text-sm font-medium text-gray-700 truncate bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 min-w-[120px] max-w-[320px]"
                    disabled={justSubmitted}
                    onPointerEnter={() => {
                        const rendererID = store.getRendererIDForElement(selectedElement.id);
                        bridge.send('highlightNativeElement', {
                            id: selectedElement.id,
                            rendererID,
                        });
                    }}
                    onPointerLeave={() => bridge.send('clearNativeElementHighlight')}
                >
                    {justSubmitted ? <TickIcon /> : assertConfig.name}
                </button>

                <span className="relative block -ml-px">
                    <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
                        onClick={() => setOpen(open => !open)}
                    >
                        <span className="sr-only">Open options</span>
                        <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                    {open ? (
                        <ul className="absolute right-0 w-56 mt-2 -mr-1 text-center bg-white shadow-lg origin-top-right rounded-md ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                                {selectedElement.asserts.map(assert => (
                                    <li key={assert.name}>
                                        <a
                                            className={classNames(
                                                false ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50',
                                                'block px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer',
                                            )}
                                            onClick={() => {
                                                setPreferredAssert(assert.name);
                                                setOpen(false);
                                            }}
                                        >
                                            {assert.name}
                                        </a>
                                    </li>
                                ))}
                            </div>
                        </ul>
                    ) : null}
                </span>
            </span>
            {assertConfig.input ? (
                <div className="relative px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    <label>
                        <span className="absolute inline-block px-1 -mt-px text-xs font-medium text-gray-900 bg-white -top-2 left-2">
                            {assertConfig.test}
                        </span>
                        <input
                            type={assertConfig.input}
                            name="value"
                            className="block w-full p-0 text-gray-900 placeholder-gray-500 border-0 sm:text-sm focus:ring-0"
                            placeholder={''}
                            onChange={event => setCurrentValue(event.target.value)}
                            value={currentValue}
                        />
                    </label>
                </div>
            ) : null}
        </form>
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
