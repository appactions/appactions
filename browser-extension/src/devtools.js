import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const App = () => {
    return (
        <div className="w-48 p-8 text-center">
            <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            <div className="mt-6">
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent bg-brand-green shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    New Project
                </button>
            </div>
        </div>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);

chrome.devtools.panels.create('App Actions', 'assets/img/icon-128x128.png', 'devtools.html', function (panel) {
    console.log('waddup', panel);
    // code invoked on panel creation
});
