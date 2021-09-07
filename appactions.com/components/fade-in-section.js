import { useState, useRef, useEffect, useCallback } from 'react';

export default function FadeInSection({ children }) {
    const [isVisible, setVisible] = useState(false);
    const ref = useRef();
    const onScroll = useCallback(() => {
        const positionFromTop = ref.current.getBoundingClientRect().top;
        if (positionFromTop - window.innerHeight * 0.8 < 0) {
            setVisible(true);
        }
    }, []);
    useEffect(() => {
        document.addEventListener('scroll', onScroll);
        onScroll();
        return () => document.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div
            className={`transition-opacity ease-out duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            ref={ref}
        >
            {children}
        </div>
    );
}
