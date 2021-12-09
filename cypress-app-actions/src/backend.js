import { attach } from './renderer';
import Bridge from './shared/bridge';
import Agent from './agent';

function initBackend(hook, agent, global) {
    if (hook == null) {
        // DevTools didn't get injected into this page (maybe b'c of the contentType).
        return () => {};
    }
    const subs = [
        hook.sub('renderer-attached', ({ id, renderer, rendererInterface }) => {
            agent.setRendererInterface(id, rendererInterface);
            agent.onBackendReady();

            // Now that the Store and the renderer interface are connected,
            // it's time to flush the pending operation codes to the frontend.
            rendererInterface.flushInitialOperations();
        }),

        hook.sub('unsupported-renderer-version', id => {
            agent.onUnsupportedRenderer(id);
        }),

        hook.sub('fastRefreshScheduled', agent.onFastRefreshScheduled),
        hook.sub('operations', agent.onHookOperations),
        hook.sub('traceUpdates', agent.onTraceUpdates),

        // TODO Add additional subscriptions required for profiling mode
    ];

    const attachRenderer = (id, renderer) => {
        let rendererInterface = hook.rendererInterfaces.get(id);

        // Inject any not-yet-injected renderers (if we didn't reload-and-profile)
        if (rendererInterface == null) {
            if (typeof renderer.findFiberByHostInstance === 'function') {
                // react-reconciler v16+
                rendererInterface = attach(hook, id, renderer, global);

                Cypress.AppActions.reactApi = rendererInterface;
                hook.rendererInterfaces.set(id, rendererInterface);
            } else if (renderer.ComponentTree) {
                // react-dom v15
                throw new Error('react-app-actions does not support react version older than v16');
            } else {
                // unsupported renderer version
                throw new Error('react-app-actions does not support this react renderer');
            }

            if (rendererInterface != null) {
                hook.rendererInterfaces.set(id, rendererInterface);
            }
        }

        // Notify the DevTools frontend about new renderers.
        // This includes any that were attached early (via __REACT_DEVTOOLS_ATTACH__).
        if (rendererInterface != null) {
            hook.emit('renderer-attached', {
                id,
                renderer,
                rendererInterface,
            });
        } else {
            hook.emit('unsupported-renderer-version', id);
        }
    };

    // Connect renderers that have already injected themselves.
    hook.renderers.forEach((renderer, id) => {
        attachRenderer(id, renderer);
    });

    // Connect any new renderers that injected themselves.
    subs.push(
        hook.sub('renderer', ({ id, renderer }) => {
            attachRenderer(id, renderer);
        }),
    );

    hook.emit('react-devtools', agent);
    hook.reactDevtoolsAgent = agent;
    const onAgentShutdown = () => {
        subs.forEach(fn => fn());
        hook.rendererInterfaces.forEach(rendererInterface => {
            rendererInterface.cleanup();
        });
        hook.reactDevtoolsAgent = null;
    };
    agent.addListener('shutdown', onAgentShutdown);
    subs.push(() => {
        agent.removeListener('shutdown', onAgentShutdown);
    });

    return () => {
        subs.forEach(fn => fn());
    };
}

export function activateBackend(contentWindow) {
    const bridge = new Bridge({
        listen(fn) {
            const handleMessage = ({ data, isTrusted }) => {
                if (!isTrusted || data?.source !== 'devtools') {
                    return;
                }

                if (data?.type === 'connection-init' || data?.type === 'connection-disconnect') {
                    return;
                }

                fn(data);
            };
            contentWindow.parent.addEventListener('message', handleMessage);
            return () => contentWindow.parent.removeEventListener('message', handleMessage);
        },
        send(type, payload) {
            contentWindow.parent.postMessage({ source: 'agent', type, payload });
        },
    });

    contentWindow.parent.postMessage({
        type: 'connection-init',
        source: 'agent',
    });

    const agent = new Agent(bridge);

    // contentWindow.parent.__debugBridge = bridge;

    const hook = contentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook) {
        initBackend(hook, agent, contentWindow);
    }
}
