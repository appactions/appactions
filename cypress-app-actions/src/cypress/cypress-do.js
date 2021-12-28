import { isJquery, AppActionsError } from './cypress-utils';
// import { purityHelperCommands } from '../testable-tools';
import { refresh } from './refresh-subject';
import { listFiberForInteraction, getDisplayName, getFiberInfo } from '../api';

/* 
interation flowchart:

0. init
1. refresh subject
2. finds the fiber with the pattern
     - throws if can't find
     - throws if finds multiple
3. checks if fiber has a given method
     - throws if don't
4. calls the method
     - wraps the thrown error
5. if selector, runs picker on return value, if interaction, returns subject
6. catch errors: if didn't perform side effect and not timeouting, GOTO step 1

*/

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
    Cypress.Commands.add(name, { prevSubject: true }, ($subject, pattern, actionName, args = []) => {
        // if (!fn.isTestableFunction) {
        //     throw new Error(`Value passed to cy.${name} is not a testable function`);
        // }

        if (!isJquery($subject)) {
            throw new Error(`Subject passed to cy.${name} is not a jQuery selector`);
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

        // purityHelperCommands.onNewCommand(fn);

        const retryContext = createRetryContext();

        const getValue = () => {
            if (options._log) {
                options._log.set({
                    $el: $subject,
                    consoleProps: getConsolePropsWithoutResult(),
                });
            }

            // purityHelperCommands.onRetry(fn);
            retryContext.onRetry();

            $subject = refresh($subject);

            const matches = Array.from($subject).flatMap(node => {
                const fiber = Cypress.AppActions.reactApi.findFiberForInteraction(node);
                const list = listFiberForInteraction(fiber, pattern, actionName);
                return list.map(fiber => getFiberInfo(fiber));
            });

            if (matches.length === 0) {
                throw new AppActionsError(`No fiber found for interaction: ${pattern}.${actionName}`);
            }

            if (matches.length > 1) {
                throw new AppActionsError(`Multiple fibers found for interaction: ${pattern}.${actionName}`);
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

            // if (typeof picker === 'function') {
            //     value = picker(value);
            // } else if (typeof picker === 'string') {
            //     value = picker.split('.').reduce((value, key) => value[key], value);
            // } else if (picker) {
            //     throw new Error(`Picker type passed for \`cy.${name}\` is not supported`);
            // }

            // if (cy.isCy(value)) {
            //     throw new AppActionsError(`Functions passed to \`cy.${name}(fn)\` must not contain Cypress commands`);
            // }

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
