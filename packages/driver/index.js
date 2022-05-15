function init() {
    return {
        drivers: {},
        patterns: new Set(),
        simplify: new Map(),
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

    if (config.simplify) {
        window.__REACT_APP_ACTIONS__.simplify.set(config.pattern, config.simplify);
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

export function useAction(name, callback) {
    if (typeof Cypress === 'undefined') {
        return;
    }

    Cypress.AppActions.reactApi.useAction(name, callback);
}
