import { useState, useEffect, useCallback } from 'react';

export default function FloatElement({ children, unLockAt = 1000 }) {
    const [isLocked,setIsLocked] = useState(true);
    const onScroll = useCallback(() => {
        setIsLocked(unLockAt > window.scrollY);
    }, [unLockAt]);
    useEffect(() => {
        document.addEventListener('scroll', onScroll);
        return () => {
            document.removeEventListener('scroll', onScroll);
        };
    });
    console.log('render flaoting');
    return <div className={isLocked ? 'fixed' : 'relative'}>{children}</div>;
}
