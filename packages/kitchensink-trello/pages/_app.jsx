import Head from 'next/head';
import '../styles/globals.css';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
    return (
        <div className="min-h-screen">
            <Head>
                <title>Trello Kitchensink</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FakeContextMenu>
                <Component {...pageProps} />
            </FakeContextMenu>
        </div>
    );
}

export default MyApp;

function FakeContextMenu({ children }) {
    const [show, setShow] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);

    const handleClick = e => {
        e.preventDefault();
        e.stopPropagation();

        setShow(true);
        setX(e.clientX);
        setY(e.clientY);

        console.log('show', show);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <div id="contextmenu" onContextMenu={handleClick}>
            {children}
            {show ? (
                <div className="fixed top-0 z-50 h-screen w-screen bg-gray-800/25" onClick={handleClose}>
                    {/* <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            > */}
                    <ul
                        className="relative w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        style={{ top: y, left: x }}
                    >
                        <div className="py-1">
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Edit
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Duplicate
                                </a>
                            </li>
                        </div>
                        <div className="py-1">
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Archive
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Move
                                </a>
                            </li>
                        </div>
                        <div className="py-1">
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Share
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Add to favorites
                                </a>
                            </li>
                        </div>
                        <div className="py-1">
                            <li>
                                <a href="#" className="block bg-gray-100 px-4 py-2 text-sm text-gray-900">
                                    Delete
                                </a>
                            </li>
                        </div>
                    </ul>
                    {/* </Transition> */}
                </div>
            ) : null}
        </div>
    );
}
