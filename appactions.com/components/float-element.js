import { useState, useEffect, useCallback } from 'react';

export default function FloatElement({ children, unLockAt = 1000 }) {
    const [isLocked, setIsLocked] = useState(true);
    const onScroll = useCallback(() => {
        // console.log(window.scrollY)
        setIsLocked(unLockAt > window.scrollY);
    }, [unLockAt]);
    useEffect(() => {
        document.addEventListener('scroll', onScroll);
        return () => {
            document.removeEventListener('scroll', onScroll);
        };
    });
    return <div style={isLocked ? { position: 'fixed' } : { position: 'relative', top: unLockAt }}>{children}</div>;
}
