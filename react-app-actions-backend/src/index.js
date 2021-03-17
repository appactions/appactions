import createBackend from './create-backend';

export function installBackend(target) {
    if (target.hasOwnProperty('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
        throw new Error("react-app-actions cannot install react devtools hook, because it's already installed");
    }

    let uidCounter = 0;

    function inject(renderer) {
        const id = ++uidCounter;
        renderers.set(id, renderer);

        // If we have just reloaded to profile, we need to inject the renderer interface before the app loads.
        // Otherwise the renderer won't yet exist and we can skip this step.
        const attach = target.__REACT_DEVTOOLS_ATTACH__;
        if (typeof attach === 'function') {
            const rendererInterface = attach(hook, id, renderer, target);
            hook.rendererInterfaces.set(id, rendererInterface);
        }

        hook.emit('renderer', { id, renderer });

        return id;
    }

    function sub(event, fn) {
        hook.on(event, fn);
        return () => hook.off(event, fn);
    }

    function on(event, fn) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(fn);
    }

    function off(event, fn) {
        if (!listeners[event]) {
            return;
        }
        const index = listeners[event].indexOf(fn);
        if (index !== -1) {
            listeners[event].splice(index, 1);
        }
        if (!listeners[event].length) {
            delete listeners[event];
        }
    }

    function emit(event, data) {
        if (listeners[event]) {
            listeners[event].map(fn => fn(data));
        }
    }

    function getFiberRoots(rendererID) {
        const roots = fiberRoots;
        if (!roots[rendererID]) {
            roots[rendererID] = new Set();
        }
        return roots[rendererID];
    }

    function onCommitFiberUnmount(rendererID, fiber) {
        const rendererInterface = rendererInterfaces.get(rendererID);
        if (rendererInterface != null) {
            rendererInterface.handleCommitFiberUnmount(fiber);
        }
    }

    function onCommitFiberRoot(rendererID, root, priorityLevel) {
        const mountedRoots = hook.getFiberRoots(rendererID);
        const current = root.current;
        const isKnownRoot = mountedRoots.has(root);
        const isUnmounting = current.memoizedState == null || current.memoizedState.element == null;

        // Keep track of mounted roots so we can hydrate when DevTools connect.
        if (!isKnownRoot && !isUnmounting) {
            mountedRoots.add(root);
        } else if (isKnownRoot && isUnmounting) {
            mountedRoots.delete(root);
        }
        const rendererInterface = rendererInterfaces.get(rendererID);
        if (rendererInterface != null) {
            rendererInterface.handleCommitFiberRoot(root, priorityLevel);
        }
    }

    const fiberRoots = {};
    const rendererInterfaces = new Map();
    const listeners = {};
    const renderers = new Map();

    const hook = {
        rendererInterfaces,
        listeners,

        // Fast Refresh for web relies on this.
        renderers,

        emit,
        getFiberRoots,
        inject,
        on,
        off,
        sub,

        // This is a legacy flag.
        // React v16 checks the hook for this to ensure DevTools is new enough.
        supportsFiber: true,

        // React calls these methods.
        checkDCE() {},
        onCommitFiberUnmount,
        onCommitFiberRoot,
    };

    Object.defineProperty(target, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
        enumerable: false,
        get() {
            return hook;
        },
    });

    const attachRenderer = (id, renderer) => {
        let rendererInterface = hook.rendererInterfaces.get(id);

        // inject any not-yet-injected renderers
        if (rendererInterface == null) {
            if (typeof renderer.findFiberByHostInstance === 'function') {
                // react-reconciler v16+
                const backend = createBackend(hook, id, renderer, target);

                Object.defineProperty(target, 'ReactAppActionsBackend', {
                    enumerable: false,
                    get() {
                        return backend;
                    },
                });

                hook.rendererInterfaces.set(id, rendererInterface);
            } else if (renderer.ComponentTree) {
                // react-dom v15
                throw new Error('react-app-actions does not support React version older than v16 (pre-fiber)');
            } else {
                // unsupported renderer version
                throw new Error('react-app-actions does not support this React renderer');
            }
        }
    };

    // Connect renderers that have already injected themselves.
    hook.renderers.forEach((renderer, id) => {
        attachRenderer(id, renderer);
    });

    // Connect any new renderers that injected themselves.
    hook.sub('renderer', ({ id, renderer }) => {
        attachRenderer(id, renderer);
    });

    return hook;
}
