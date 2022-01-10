import { ErrorBoundary as EB } from 'react-error-boundary';

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

export default function ErrorBoundary({ children }) {
    return <EB FallbackComponent={ErrorFallback}>{children}</EB>;
}
