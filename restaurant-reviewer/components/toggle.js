import { useState } from 'react';
import { Transition } from '@headlessui/react';
import useClickOutside from 'utils/use-click-outside';

export default function Toggle({ children, button }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useClickOutside(() => {
        setIsOpen(false);
    });

    return (
        <div ref={ref}>
            {button(() => setIsOpen(!isOpen))}
            <div className="absolute right-0 z-50">
                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    {children}
                </Transition>
            </div>
        </div>
    );
}
