import { useEffect, useState, useCallback, useRef } from 'react';
import { useDevtoolsContext } from './context';

export function useStore(event, selector) {
    const { store } = useDevtoolsContext();
    const [value, setValue] = useState(() => selector(store));

    useEffect(() => {
        const callback = () => {
            setValue(selector(store));
        };
        store.addListener(event, callback);
        return () => store.removeListener(event, callback);
    }, [store]);

    return value;
}

export function useTemporaryState(value, { timeout = 2000 } = {}) {
    const [state, setState] = useState(value);

    const setValue = useCallback(newValue => {
        setState(newValue);
        setTimeout(() => setState(value), timeout);
    }, [timeout, value]);

    return [state, setValue]
}

export function useClickOutside(callback) {
    const ref = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        document.addEventListener('pointerdown', handleClickOutside);
        return () => document.removeEventListener('pointerdown', handleClickOutside);
    }, [ref]);

    return ref;
}
