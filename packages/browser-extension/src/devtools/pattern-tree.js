import React, { useCallback } from 'react';
import { useDevtoolsContext } from './context';
import { useStore } from './hooks';
import Delay from './components/delay'

export default function PatternTree() {
    const { bridge } = useDevtoolsContext();

    const onLeave = useCallback(() => {
        bridge.send('clearNativeElementHighlight');
    }, [bridge]);

    const isBackendReady = useStore('backend-ready', store => store.isBackendReady);

    const numElements = useStore('mutated', store => {
        let numElements = 0;

        store.roots.forEach(rootID => {
            const { weight } = store.getElementByID(rootID);
            numElements += weight;
        });

        return numElements;
    });

    if (!isBackendReady) {
        return <h4>Waiting to detect React.</h4>;
    }

    if (numElements === 0) {
        // TODO show link to docs
        return <Delay key="no-elements"><h4>Could not find any patterns. Annotate your components with drivers.</h4></Delay>;
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

    const patternElement = useStore('newElementAdded', store => {
        return store.getPatternByID(id);
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

    if (!patternElement) {
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
            {patternElement.pattern}
        </div>
    );
}
