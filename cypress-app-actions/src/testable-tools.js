import { formatArguments } from './cypress/cypress-utils';

let currentFunction = null;

const enhanceTestableMethods = (role, methods, isSelectors) => {
    return Object.fromEntries(
        Object.entries(methods).map(([key, fn]) => {
            const outerEnhancedFunction = (...args) => {
                const innerFunction = fn.apply(null, args);

                if (typeof innerFunction !== 'function') {
                    throw new Error(`Testable method "${role}.${key}" did not return a function`);
                }

                const enhancedFunction = function($el) {
                    const displayArgs = JSON.stringify(args.length === 1 ? args[0] : args, null, 2);
                    enhancedFunction.displayArgs = displayArgs;

                    if ($el.length === 0) {
                        throw new Error(`No element were passed to perform ${role}.${key}`);
                    } else if ($el.length > 1) {
                        throw new Error(
                            `Multiple elements were passed to ${role}.${key}, but only a single one is supported`,
                        );
                    }

                    try {
                        currentFunction = enhancedFunction;
                        const result = innerFunction.call(null, $el);
                        return isSelectors ? result : $el;
                    } finally {
                        currentFunction = null;
                    }
                };

                // TODO: refactor this with weakmap

                // logging
                enhancedFunction.displayName = `${role}.${key}(${formatArguments(args)})`;
                enhancedFunction.displayFunctionBody = innerFunction.toString();

                // functionality
                enhancedFunction.isImpure = !isSelectors;
                enhancedFunction.isTestableFunction = true;

                // state
                enhancedFunction.purityProgressIndex = 0;
                enhancedFunction.purityCurrentIndex = 0;
                enhancedFunction.purityValues = [];

                return enhancedFunction;
            };
            return [key, outerEnhancedFunction];
        }),
    );
};

const allowedKeys = ['role', 'isLoading', 'interactions', 'selectors', 'customPicker'];

export function createTestable(config) {
    if (!Object.keys(config).every(key => allowedKeys.includes(key))) {
        throw new Error('config object for `createTestable` contains invalid keys');
    }
    return {
        ...config,
        ...enhanceTestableMethods(config.role, config.selectors || {}, true),
        ...enhanceTestableMethods(config.role, config.interactions || {}, false),
        isTestable: true,
    };
}

export const purityHelperCommands = {
    onNewCommand: state => {
        state.purityProgressIndex = 0;
        state.purityCurrentIndex = 0;
        state.purityValues = [];
    },
    onRetry: state => {
        state.purityCurrentIndex = 0;
    },
};

const save = value => {
    currentFunction.purityProgressIndex += 1;
    currentFunction.purityCurrentIndex += 1;
    currentFunction.purityValues.push(value);
    return value;
};

export const pure = fn => value => {
    if (currentFunction.purityCurrentIndex < currentFunction.purityProgressIndex) {
        currentFunction.purityCurrentIndex += 1;
        return currentFunction.purityValues[currentFunction.purityCurrentIndex - 1];
    }

    let result;

    try {
        result = fn(value);
    } catch (error) {
        // TODO rewrite this with WeakMap
        error.didNotPerformSideEffects = true;
        throw error;
    }

    return save(result);
};

export const sideEffect = fn => value => {
    if (currentFunction.purityCurrentIndex < currentFunction.purityProgressIndex) {
        currentFunction.purityCurrentIndex += 1;
        return currentFunction.purityValues[currentFunction.purityCurrentIndex - 1];
    }
    return save(fn(value));
};
