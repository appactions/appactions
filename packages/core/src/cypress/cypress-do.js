import { isJquery, AppActionsError } from './cypress-utils';
import { refresh } from './refresh-subject';
import { listFiberForInteraction, getDisplayName, getFiberInfo } from '../api';

const getElements = $el => {
    const $arr = Array.from($el);

    if ($arr.length === 1) {
        return $arr[0];
    } else {
        return $arr;
    }
};

function createRetryContext() {
    const purityValues = [];
    let currentIndex = 0;

    return {
        retryable: fn => (...args) => {
            if (currentIndex < purityValues.length) {
                return purityValues[currentIndex++];
            }

            let result;
            try {
                result = fn(...args);
            } catch (error) {
                if (!error.hasOwnProperty('__retryable')) {
                    Object.defineProperty(error, '__retryable', {
                        enumerable: false,
                        get() {
                            return true;
                        },
                    });
                }

                throw error;
            }

            purityValues.push(result);
            currentIndex++;
            return result;
        },
        nonRetryable: fn => (...args) => {
            if (currentIndex < purityValues.length) {
                return purityValues[currentIndex++];
            }

            let result;
            try {
                result = fn(...args);
            } catch (error) {
                if (!error.hasOwnProperty('__retryable')) {
                    Object.defineProperty(error, '__retryable', {
                        enumerable: false,
                        get() {
                            return false;
                        },
                    });
                }

                throw error;
            }

            purityValues.push(result);
            currentIndex++;
            return result;
        },
        onRetry: () => {
            currentIndex = 0;
        },
    };
}

export const register = (name = 'do', { returnValueIsSubject = true } = {}) => {
    Cypress.Commands.add(name, { prevSubject: true }, ($subject, pattern, actionName, args, picker) => {
        if (!isJquery($subject)) {
            throw new AppActionsError(`Subject passed to cy.${name} is not a jQuery selector`);
        }

        // handle null
        if (!args) {
            args = [];
        }

        if (!Array.isArray(args)) {
            throw new AppActionsError(`Arguments parameter passed to cy.${name} must be an array`);
        }

        const now = performance.now();

        const options = {
            log: true,
            _log: Cypress.log({
                message: `${pattern}.${actionName}`,
            }),
            error: null,
        };

        const getConsolePropsWithoutResult = () => {
            const result = {
                Command: name,
                Call: `${pattern}.${actionName}`,
                Arguments: args,
                Subject: $subject,
                Duration: performance.now() - now,
            };

            if (options.error) {
                result['Error'] = options.error;
            }

            return result;
        };

        const getConsoleProps = ({ yielded, fn, componentName }) => () => {
            const result = {
                ...getConsolePropsWithoutResult(),
                Function: fn.toString(),
                Component: componentName,
                Yielded: yielded,
            };

            if (returnValueIsSubject) {
                result['Count'] = yielded.length;
            }

            return result;
        };

        const retryContext = createRetryContext();

        const getValue = () => {
            if (options._log) {
                options._log.set({
                    $el: $subject,
                    consoleProps: getConsolePropsWithoutResult(),
                });
            }

            retryContext.onRetry();

            $subject = refresh($subject);

            const getMatch = nodes => {
                const fiber = Cypress.AppActions.reactApi.findFiberForInteraction(nodes);
                const list = listFiberForInteraction(fiber, pattern, actionName);
                return list.map(fiber => getFiberInfo(fiber));
            };

            // first, try using all elements from subject (eg. Fragment component)
            let matches = getMatch(Array.from($subject));

            // if it didn't work, try using each element individually
            if (matches.length === 0) {
                matches = Array.from($subject).map(node => [node]).flatMap(getMatch);
            }

            if (matches.length === 0) {
                throw new Error(`No fiber found for interaction: ${pattern}.${actionName}`);
            }

            if (matches.length > 1) {
                throw new Error(`Multiple fibers found for interaction: ${pattern}.${actionName}`);
            }

            const match = {
                ...matches[0],
                actions: Object.entries(matches[0].driver.actions).reduce((result, [name, fn]) => {
                    result[name] = (...args) => {
                        return fn.call(null, match, ...args);
                    };
                    return result;
                }, {}),
                retryable: retryContext.retryable,
                nonRetryable: retryContext.nonRetryable,
            };

            const fn = match.driver.actions[actionName];
            const componentName = getDisplayName(match.fiber);

            let value = fn(match, ...args);

            // let value = fn($subject);

            if (picker) {
                if (typeof picker === 'function') {
                    value = picker(value);
                } else if (typeof picker === 'string') {
                    value = picker.split('.').reduce((value, key) => value[key], value);
                } else {
                    throw new AppActionsError(`Picker type passed for \`cy.${name}\` is not supported`);
                }
            }

            if (options._log) {
                const yielded = returnValueIsSubject ? getElements($subject) : value;
                options._log.set({
                    consoleProps: getConsoleProps({ yielded, fn, componentName }),
                });
            }

            return returnValueIsSubject ? $subject : value;
        };

        // retryValue will automatically retry piped functions that temporarily return errors
        const retryValue = () => {
            return Cypress.Promise.try(getValue).catch(error => {
                if (error instanceof AppActionsError) {
                    throw error;
                }

                options.error = error;

                const canRetry = Boolean(error.__retryable);
                if (!canRetry) {
                    throw error;
                }

                return cy.retry(retryValue, options);
            });
        };

        const resolveValue = () => {
            return Cypress.Promise.try(retryValue).then(value => {
                return cy.verifyUpcomingAssertions(value, options, {
                    onRetry: resolveValue,
                });
            });
        };

        return resolveValue().then(value => {
            if (options._log) {
                options._log.snapshot();
                options._log.end();
            }
            return value;
        });
    });
};
