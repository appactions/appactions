export const createDriver = (Component, config) => {
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

export const tunnel = event => {
    return {
        action: (patternName, actionName, ...args) => {
            if (!Cypress.AppActions.hook) {
                console.error('Cypress.AppActions.hook is not defined');
                return;
            }
            if (!event) {
                console.warn('Cannot tunnel event, because event is not passed');
                return;
            }

            const target = event.nativeEvent?.target || event.target;
            if (!target) {
                console.warn('Cannot tunnel event, because target is not present in event object');
                return;
            }

            Cypress.AppActions.hook.emit('session-recording-event', { args, patternName, actionName, event });
        },
    };
};

let reactInstance = null;

export function setReactInstance(instance) {
    reactInstance = instance;
}

export function useAction(name, callback) {
    if (!reactInstance) {
        throw new Error('React instance is not defined. ');
    }
    reactInstance.useState(() => ({ name, callback, actionHook: true }));
}
