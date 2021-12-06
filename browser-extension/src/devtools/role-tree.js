import React, { useMemo, useCallback } from 'react';
import { useDevtoolsContext } from './context';
import { useSubscription } from './hooks';

export default function RoleTree() {
    const { bridge, store } = useDevtoolsContext();

    const getStoreState = useMemo(
        () => ({
            getCurrentValue: () => {
                let numElements = 0;
                store.roots.forEach(rootID => {
                    const { weight } = store.getElementByID(rootID);
                    numElements += weight;
                });

                return {
                    numElements,
                };
            },
            subscribe: callback => {
                store.addListener('mutated', callback);
                return () => store.removeListener('mutated', callback);
            },
        }),
        [store],
    );
    const { numElements } = useSubscription(getStoreState);

    if (numElements === 0) {
        return <h4>Waiting to detect React.</h4>;
    }

    return (
        <ol>
            {Array(numElements)
                .fill(0)
                .map((_, index) => (
                    <Element key={index} index={index} />
                ))}
        </ol>
    );
}

let nextRequestID = 0;

function Element({ index }) {
    const { bridge, store } = useDevtoolsContext();

    const element = store.getElementAtIndex(index);

    if (!element) {
        return null;
    }

    const onHover = useCallback(() => {
        const rendererID = store.getRendererIDForElement(element.id);

        bridge.send('inspectElement', {
            forceFullData: true,
            requestID: nextRequestID++,
            id: element.id,
            path: null,
            rendererID,
        })
    }, [bridge, index]);

    const { depth, displayName, hocDisplayNames, key, type } = element;
    return (
        <li style={{ marginLeft: depth * 6 }} onPointerEnter={onHover}>
            {displayName} id: {element.id}
        </li>
    );
}
