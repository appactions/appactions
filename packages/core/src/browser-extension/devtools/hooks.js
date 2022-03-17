import { useEffect, useState, useCallback } from 'react';
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

export function useTemporaryState({ timeout, value }) {
    const [state, setState] = useState(value);

    const setValue = useCallback(newValue => {
        setState(newValue);
        setTimeout(() => setState(value), timeout);
    }, [timeout, value]);

    return [state, setValue]
}
