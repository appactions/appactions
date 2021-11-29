import { useCallback, useEffect, useState } from 'react';
import { useDevtoolsContext } from './context';

export function useSubscription({ getCurrentValue, subscribe }) {
    const [state, setState] = useState(() => ({
        getCurrentValue,
        subscribe,
        value: getCurrentValue(),
    }));

    if (state.getCurrentValue !== getCurrentValue || state.subscribe !== subscribe) {
        setState({
            getCurrentValue,
            subscribe,
            value: getCurrentValue(),
        });
    }

    useEffect(() => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
            if (didUnsubscribe) {
                return;
            }

            setState(prevState => {
                if (prevState.getCurrentValue !== getCurrentValue || prevState.subscribe !== subscribe) {
                    return prevState;
                }

                const value = getCurrentValue();
                if (prevState.value === value) {
                    return prevState;
                }

                return { ...prevState, value };
            });
        };
        const unsubscribe = subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
            didUnsubscribe = true;
            unsubscribe();
        };
    }, [getCurrentValue, subscribe]);

    return state.value;
}

export function useHighlightNativeElement() {
    const { bridge, store } = useDevtoolsContext();

    const highlightNativeElement = useCallback(
        id => {
            const element = store.getElementByID(id);
            const rendererID = store.getRendererIDForElement(id);
            if (element !== null && rendererID !== null) {
                bridge.send('highlightNativeElement', {
                    displayName: element.displayName,
                    hideAfterTimeout: false,
                    id,
                    openNativeElementsPanel: false,
                    rendererID,
                    scrollIntoView: false,
                });
            }
        },
        [store, bridge],
    );

    const clearHighlightNativeElement = useCallback(() => {
        bridge.send('clearNativeElementHighlight');
    }, [bridge]);

    return {
        highlightNativeElement,
        clearHighlightNativeElement,
    };
}
