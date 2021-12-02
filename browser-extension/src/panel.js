import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
// import Tree from './panel/tree';
import RoleTree from './panel/role-tree';
import StoreProvider from './panel/store-provider';
import './style.css';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <code>{error.stack}</code>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
};

const DevTools = () => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StoreProvider>
                {/* <Tree /> */}
                <RoleTree />
            </StoreProvider>
        </ErrorBoundary>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<DevTools />, root);
