import { useEffect, useState } from 'react';
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
