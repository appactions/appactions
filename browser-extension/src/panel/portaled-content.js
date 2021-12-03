import { createPortal } from 'react-dom';
import ErrorBoundary from './error-boundary';

export default function portaledContent(Component) {
    return function PortaledContent({ portalContainer, ...rest }) {
        const children = (
            <div style={{ width: '100vw', height: '100vh' }}>
                <ErrorBoundary>
                    <Component {...rest} />
                </ErrorBoundary>
            </div>
        );
        return portalContainer ? createPortal(children, portalContainer) : children;
    };
}
