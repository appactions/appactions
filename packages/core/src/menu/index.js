// import { Transition } from '@headlessui/react';
// import './style.css';

export default function Menu() {
    return (
        <div className="relative inline-block text-left">
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
