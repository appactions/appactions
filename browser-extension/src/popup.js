import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './assets/icons/logo.svg'
import './style.css';

const Popup = () => {
    return (
        <div className="w-48 p-8 text-center">
            <Logo className="inline-block w-12 h-12" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">App Actions</h3>
            <p className="mt-1 text-sm text-gray-500">
                To access the test recorder, open developer tools and go to the App Actions tab.
            </p>
            <div className="mt-6">
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent bg-brand-green shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Open docs
                </button>
            </div>
        </div>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
