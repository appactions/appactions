import React, { useEffect } from 'react';
import { DevtoolsContext } from './context';
import Panel from './panel';
import ErrorBoundary from './error-boundary';

export default function App({ store, bridge, portalContainer }) {
    useEffect(() => {
        return () => {
            try {
                bridge.shutdown();
            } catch (e) {
                console.error(e);
            }
        };
    });

    return (
        <DevtoolsContext.Provider value={{ bridge, store }}>
            <ErrorBoundary>
                <Panel portalContainer={portalContainer} />
            </ErrorBoundary>
        </DevtoolsContext.Provider>
    );
}
