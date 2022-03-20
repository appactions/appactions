import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function Menu() {
    // return (
    //     <div className="relative block w-8 h-8 bg-red-400" id="assert-menu" />
    // )
    return (
        <div className="relative inline-block text-left" id="assert-menu">
            {/* <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            > */}
            <ul className="absolute w-56 mt-2 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                <div className="py-1">
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Edit
                        </a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Duplicate
                        </a>
                    </li>
                </div>
                <div className="py-1">
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Archive
                        </a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Move
                        </a>
                    </li>
                </div>
                <div className="py-1">
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Share
                        </a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Add to favorites
                        </a>
                    </li>
                </div>
                <div className="py-1">
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-900 bg-gray-100">
                            Delete
                        </a>
                    </li>
                </div>
            </ul>
            {/* </Transition> */}
        </div>
    );
}

window.addEventListener('message', ({ data: message, isTrusted }) => {
    if (!isTrusted || message?.source !== 'agent') {
        return;
    }

    if (message.type === 'contextmenu-open') {
        const menu = document.getElementById('assert-menu');
        Object.assign(menu.style, {
            left: message.payload.clientX + 'px',
            top: message.payload.clientY + 'px',
        });
        Object.assign(container.style, {
            display: 'block',
        });
    }
});

const container = document.createElement('div');
Object.assign(container.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10000000,
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'none',
});
document.body.appendChild(container);
ReactDOM.render(<Menu />, container);

container.addEventListener('click', () => {
    Object.assign(container.style, {
        display: 'none',
    });
    window.parent.postMessage({ source: 'agent', type: 'contextmenu-close' }, '*');
});
