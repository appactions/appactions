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

export const tunnel = event => {
    return {
        action: (patternName, actionName, ...args) => {
            // if (!window.Cypress || !window.Cypress.AppActions) {
            //     return;
            // }
            // if (!Cypress.AppActions.hook) {
            //     console.error('Cypress.AppActions.hook is not defined');
            //     return;
            // }
            // if (!event) {
            //     console.warn('Cannot tunnel event, because event is not passed');
            //     return;
            // }

            // const target = event.nativeEvent?.target || event.target;
            // if (!target) {
            //     console.warn('Cannot tunnel event, because target is not present in event object');
            //     return;
            // }

            // NOTE: don't use the event system, just directly reference agent
            // Cypress.AppActions.hook.emit('session-recording-event', { args, patternName, actionName, event });

            throw new Error('TODO: change tunnel api to annotate the event');
        },
    };
};

let reactInstance = null;

export function setReactInstance(instance) {
    reactInstance = instance;
}

export function useAction(name, callback) {
    // TODO maybe use this instead:
    // const fiber = Cypress.AppActions.hook.renderers.get(1).getCurrentFiber();
    // weakMap.set(fiber, { name, callback });
    // so reactInstance won't be needed

    if (!reactInstance) {
        throw new Error('React instance is not defined. ');
    }
    reactInstance.useState(() => ({ name, callback, actionHook: true }));
}
