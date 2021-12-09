import React, { useMemo, useCallback } from 'react';
import { useDevtoolsContext } from './context';
import { useSubscription, useStore } from './hooks';

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

    const onLeave = useCallback(() => {
        bridge.send('clearNativeElementHighlight');
    }, [bridge]);

    const { numElements } = useSubscription(getStoreState);

    if (numElements === 0) {
        return <h4>Waiting to detect React.</h4>;
    }

    return (
        <div onPointerLeave={onLeave}>
            {Array(numElements)
                .fill(0)
                .map((_, index) => (
                    <Element key={index} index={index} />
                ))}
        </div>
    );
}

function Element({ index }) {
    const { bridge, store } = useDevtoolsContext();

    const element = store.getElementAtIndex(index);

    if (!element) {
        return null;
    }

    const { id, depth, displayName, hocDisplayNames, key, type } = element;

    const selectedElementID = useStore('selectionChange', store => store.selectedElementID);

    const isSelected = selectedElementID === id;
    console.log(index, selectedElementID, id);

    const onHover = useCallback(() => {
        const rendererID = store.getRendererIDForElement(id);

        bridge.send('highlightNativeElement', {
            displayName,
            hideAfterTimeout: false,
            id,
            openNativeElementsPanel: false,
            rendererID,
            scrollIntoView: false,
        });
    }, [bridge, id]);

    const onClick = useCallback(() => {
        store.selectElement(id);
    }, [store, id]);

    return (
        <div
            className={`cursor-pointer ${isSelected ? 'bg-blue-300' : 'hover:bg-blue-100'}`}
            style={{ paddingLeft: depth * 12 + 2 }}
            onPointerEnter={onHover}
            onPointerDown={onClick}
        >
            {displayName}
        </div>
    );
}
