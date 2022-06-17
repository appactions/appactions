import React, { useCallback } from 'react';
import { useDevtoolsContext } from './context';
import { useStore } from './hooks';
import Delay from './components/delay';

export default function PatternTree() {
    const { bridge, store } = useDevtoolsContext();

    const onLeave = useCallback(() => {
        bridge.send('clearNativeElementHighlight');
    }, [bridge]);

    const isBackendReady = useStore('backend-ready', store => store.isBackendReady);

    const { numElements } = useStore('mutated', store => {
        let numElements = 0;

        store.roots.forEach(rootID => {
            const { weight } = store.getElementByID(rootID);
            numElements += weight;
        });

        return { numElements };
    });

    if (!isBackendReady) {
        return <h4 className="m-2">Waiting to detect React.</h4>;
    }

    if (numElements === 0) {
        // TODO show link to docs
        return (
            <Delay key="no-elements">
                <h4 className="m-2">Could not find any patterns. Annotate your components with drivers.</h4>
            </Delay>
        );
    }

    return (
        <div className="my-2" onPointerLeave={onLeave}>
            {Array(numElements)
                .fill(0)
                .map((_, index) => {
                    const element = store.getElementAtIndex(index);
                    return <Element key={element.id} element={element} />;
                })}
        </div>
    );
}

function Element({ element }) {
    const { id, depth } = element;
    const { bridge, store } = useDevtoolsContext();

    const patternElement = useStore('newElementAdded', store => {
        return store.getPatternByID(id);
    });
    const selectedElementID = useStore('selectionChange', store => store.selectedElementID);

    const onHover = useCallback(() => {
        const rendererID = store.getRendererIDForElement(id);
        bridge.send('highlightNativeElement', {
            id,
            rendererID,
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
            className={`cursor-pointer ${isSelected ? 'bg-[#d4e7fa]' : 'hover:bg-[#e7f1fa]'}`}
            style={{ paddingLeft: (depth + 1) * 12 }}
            onPointerEnter={onHover}
            onPointerDown={onClick}
        >
            <span className="mr-2">{patternElement.pattern}</span>
            {patternElement.name ? <span className="text-gray-500">{patternElement.name}</span> : null}
        </div>
    );
}
