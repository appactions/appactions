import { useState, useEffect, useCallback } from 'react';

export default function FloatElement({ children, unLockAt = 1000 }) {
    const [top, setTop] = useState(true);
    const onScroll = useCallback(() => {
        // console.log(window.scrollY)
        setTop(Math.min(window.scrollY, unLockAt));
    }, [unLockAt]);
    useEffect(() => {
        document.addEventListener('scroll', onScroll);
        return () => {
            document.removeEventListener('scroll', onScroll);
        };
    });
    return <div style={{ position: 'relative', top }}>{children}</div>;
}
