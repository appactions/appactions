import {
    isJquery,
    getFunctionName,
    getFunctionArguments,
    getElements,
    AppActionsError,
    refreshSubject,
} from './cypress-utils';
import { purityHelperCommands } from '../testable-tools';

export const register = name => {
    Cypress.Commands.add(name, { prevSubject: true }, ($subject, fn, picker) => {
        if (!fn.isTestableFunction) {
            throw new Error(`Value passed to cy.${name} is not a testable function`);
        }

        if (!isJquery($subject)) {
            throw new Error(`Subject passed to cy.${name} is not a jQuery selector`);
        }

        const now = performance.now();

        const options = {
            log: true,
        };

        if (options.log) {
            options._log = Cypress.log({
                message: getFunctionName(fn),
            });
        }

        const getConsolePropsWithoutResult = () => {
            const result = {
                Command: name,
                Call: getFunctionName(fn),
                Arguments: getFunctionArguments(fn),
                Subject: $subject,
                Function: fn.displayFunctionBody || fn.toString(),
                Duration: performance.now() - now,
            };

            if (options.error) {
                result['Error'] = options.error;
            }

            return result;
        };

        const getConsoleProps = value => () => ({
            ...getConsolePropsWithoutResult(),
            Yielded: getElements(value),
            Count: value.length,
        });

        purityHelperCommands.onNewCommand(fn);

        const getValue = () => {
            if (options._log) {
                options._log.set({
                    $el: $subject,
                    consoleProps: getConsolePropsWithoutResult(),
                });
            }

            purityHelperCommands.onRetry(fn);

            if ($subject) {
                $subject = refreshSubject($subject);
            }

            let value = fn($subject);

            if (typeof picker === 'function') {
                value = picker(value);
            } else if (typeof picker === 'string') {
                value = picker.split('.').reduce((value, key) => value[key], value);
            } else if (picker) {
                throw new Error(`Picker type passed for \`cy.${name}\` is not supported`);
            }

            if (cy.isCy(value)) {
                throw new AppActionsError(`Functions passed to \`cy.${name}(fn)\` must not contain Cypress commands`);
            }

            if (options._log) {
                options._log.set({
                    consoleProps: getConsoleProps(value),
                });
            }

            return value;
        };

        // retryValue will automatically retry piped functions that temporarily return errors
        const retryValue = () => {
            return Cypress.Promise.try(getValue).catch(err => {
                if (err instanceof AppActionsError) {
                    throw err;
                }

                options.error = err;

                const canRetry = !fn.isImpure || err.didNotPerformSideEffects;
                if (!canRetry) {
                    throw err;
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
