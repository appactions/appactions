function init() {
    return {
        drivers: {},
        patterns: new Set(),
        annotations: [],
    };
}

export const createDriver = (Component, config) => {
    // Do no run in a server side env
    if (typeof window === 'undefined') {
        return;
    }

    if (!config || !config.pattern) {
        throw new Error('Pattern must be specified');
    }

    if (!window.__REACT_APP_ACTIONS__) {
        window.__REACT_APP_ACTIONS__ = init();
    }

    if (config.pattern) {
        window.__REACT_APP_ACTIONS__.patterns.add(config.pattern);
    }

    if (typeof Component === 'string') {
        // this is a hack for now, because defineProperty does not work on strings
        window.__REACT_APP_ACTIONS__.drivers[Component] = config;
    } else if (!Component.__REACT_APP_ACTIONS__) {
        Object.defineProperty(Component, '__REACT_APP_ACTIONS__', {
            enumerable: false,
            get() {
                return config;
            },
        });
    }

    return {
        Component,
        config,
    };
};

export const annotate = (eventOrMatcher, payload) => {
    if (!payload) {
        throw new Error('Payload must be specified');
    }

    // TODO use postMessage instead of window.__REACT_APP_ACTIONS__?
    // eg. Cypress.AppActions.hook.emit('session-recording-event-annotation', {
    //     matcher: eventOrMatcher,
    //     payload,
    //     timestamp: Date.now(),
    // });

    if (!window.__REACT_APP_ACTIONS__) {
        window.__REACT_APP_ACTIONS__ = init();
    }

    window.__REACT_APP_ACTIONS__.annotations.push({
        matcher: eventOrMatcher,
        payload,
        timestamp: Date.now(),
    });
};

let reactInstance = null;

export function setReactInstance(instance) {
    reactInstance = instance;
}

export function useAction(name, callback) {
    // TODO maybe use this instead:
    // const fiber = Cypress.AppActions.hook.renderers.get(1).getCurrentFiber();
    // const reactHooks = inspectHooksOfFiber(fiber, renderer.currentDispatcherRef);
    // so reactInstance won't be needed

    if (!reactInstance) {
        throw new Error('React instance is not defined. ');
    }
    reactInstance.useState(() => ({ name, callback, actionHook: true }));
}
