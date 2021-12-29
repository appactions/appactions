import React, { useMemo, useCallback } from 'react';
import { useDevtoolsContext } from './context';
import { useSubscription, useStore } from './hooks';
import Delay from './components/delay'

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

    const isBackendReady = useStore('backend-ready', store => store.isBackendReady);
    const { numElements } = useSubscription(getStoreState);

    if (!isBackendReady) {
        return <h4>Waiting to detect React.</h4>;
    }

    if (numElements === 0) {
        // TODO show link to docs
        return <Delay key="no-elements"><h4>Could not find any roles. Annotate your components with drivers.</h4></Delay>;
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

    const { id, depth, displayName, hocDisplayNames, key, type } = store.getElementAtIndex(index);

    const roleElement = useStore('newElementAdded', store => {
        return store.getRoleByID(id);
    });
    const selectedElementID = useStore('selectionChange', store => store.selectedElementID);

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

    if (!roleElement) {
        return null;
    }

    const isSelected = selectedElementID === id;

    return (
        <div
            className={`cursor-pointer ${isSelected ? 'bg-blue-300' : 'hover:bg-blue-100'}`}
            style={{ paddingLeft: depth * 12 + 2 }}
            onPointerEnter={onHover}
            onPointerDown={onClick}
        >
            {roleElement.pattern}
        </div>
    );
}
