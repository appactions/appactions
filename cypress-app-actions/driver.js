module.exports.createDriver = (Component, config) => {
    // Do no run in a server side env
    if (typeof window === 'undefined') {
        return;
    }

    if (!config || !config.pattern) {
        throw new Error('Pattern must be specified');
    }

    if (!window.__REACT_APP_ACTIONS__) {
        window.__REACT_APP_ACTIONS__ = { drivers: {}, patterns: new Set() };
    }

    if (config.pattern) {
        window.__REACT_APP_ACTIONS__.patterns.add(config.pattern);
    }

    if (typeof Component === 'string') {
        // this is a hack for now, because defineProperty does not work on strings
        window.__REACT_APP_ACTIONS__.drivers[Component] = config;
    } else {
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

module.exports.tunnel = driver => {
    return {
        emit: (actionName, ...args) => {
            if (Cypress.AppActions.hook) {
                Cypress.AppActions.hook.emit('session-recording-event', { args, actionName });
            }
        },
    };
};
