import React, { useState } from 'react';
import { useDevtoolsContext } from './context';

const items = [
    { name: 'Save and schedule', href: '#' },
    { name: 'Save and publish', href: '#' },
    { name: 'Export PDF', href: '#' },
];

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
    return (
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
            <span className="inline-flex text-gray-500">Assert:</span>
            <button
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={() => {
                    bridge.send('session-recording-assert', {
                        id: store.selectedElementID,
                        assert: 'exist',
                    });
                }}
            >
                exist
            </button>

            <span className="-ml-px relative block">
                <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    onClick={() => setOpen(open => !open)}
                >
                    <span className="sr-only">Open options</span>
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {open ? (
                    <ul className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {items.map(item => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            false ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50',
                                            'block px-4 py-2 text-sm hover:bg-gray-50',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </div>
                    </ul>
                ) : null}
            </span>
        </span>
    );
}
