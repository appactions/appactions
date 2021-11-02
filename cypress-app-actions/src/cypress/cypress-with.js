import { findElementByRole } from '../api';
import { AppActionsError, refreshSubject, formatArguments } from './cypress-utils';
import getUniqueSelector from '@cypress/unique-selector';

export const register = (name, { defaultIsLoading = () => false } = {}) => {
    Cypress.Commands.add(name, { prevSubject: 'optional' }, ($subject, testable, ...pickerData) => {
        if (!testable.isTestable) {
            throw new AppActionsError(`value passed to cy.${name} is not a testable`);
        }

        if (!testable.role) {
            throw new AppActionsError(`cyname don't know the selected role`);
        }

        if (pickerData.length && !testable.customPicker) {
            throw new AppActionsError(`testable "${testable.role}" does not have selector support when cy.${name}`);
        }

        const start = performance.now();

        const options = {
            log: true,
            timeoutOnLoading: testable.timeoutOnLoading || 6e4, // TODO hardcoded value
        };

        let filterFn = () => true;
        let selector = testable.role;

        if (typeof pickerData[0] === 'function') {
            filterFn = pickerData[0];
            selector = `${testable.role} (with a function)`;
        } else if (testable.customPicker) {
            filterFn = testable.customPicker(...pickerData);
            const extraInfo = formatArguments(pickerData);
            if (extraInfo) {
                selector = `${testable.role} (${extraInfo})`;
            }
        }

        const getConsolePropsWithoutResult = () => ({
            Command: name,
            Subject: $subject,
            Selection: selector,
            Duration: performance.now() - start,
        });

        const getConsoleProps = ({ $result, candidatesLoading, candidatesFilter }) => () => ({
            ...getConsolePropsWithoutResult(),
            Yielded: $result,
            MatchCount: $result.length,
            'Candidates (loading)': candidatesLoading,
            'Candidates (filter)': candidatesFilter,
        });

        const isTestableLoading = testable.isLoading || defaultIsLoading;

        if (options.log) {
            options._log = Cypress.log({
                message: selector,
            });
        }

        let didIncreaseTimeoutForLoading = false;

        const getValue = () => {
            if (options._log) {
                options._log.set({
                    consoleProps: getConsolePropsWithoutResult(),
                });
            }

            if ($subject) {
                $subject = refreshSubject($subject);
            }
            
            const $head = $subject ? $subject : Cypress.$(Cypress.AppActions.getAllRoots());

            const candidates = Array.from($head).flatMap(el => findElementByRole(el, testable.role));

            const evaluatedCandidates = candidates.map((el, index, array) => {
                const $el = Cypress.$(el);
                let loadingResult = null;
                try {
                    // convert to boolean is important, later we will handle candidates as "loaded" if it has an explicit false
                    loadingResult = Boolean(isTestableLoading($el));
                } catch (error) {
                    loadingResult = error;
                }

                let filterResult = null;
                try {
                    // convert to boolean is important, later we will handle candidates as "picked" if it has an explicit true
                    filterResult = Boolean(filterFn($el, index, array));
                } catch (error) {
                    filterResult = error;
                }
                return {
                    el,
                    loadingResult,
                    filterResult,
                };
            });

            // any candidates have other loading status than false?
            const anyCandidatesLoading = evaluatedCandidates.some(({ loadingResult }) => {
                return loadingResult !== false;
            });

            // increase timeout when a candidate is loading
            // we want to fail fast when nothing indicates loading state, but then let it retry for an extended period
            if (anyCandidatesLoading && !didIncreaseTimeoutForLoading) {
                options.timeout = options.timeoutOnLoading;
                options._runnableTimeout = options.timeoutOnLoading;
                didIncreaseTimeoutForLoading = true;
            }

            let result = [];

            if (!anyCandidatesLoading) {
                result = evaluatedCandidates
                    .filter(({ filterResult }) => {
                        return filterResult === true;
                    })
                    .map(({ el }) => el);
            }

            if (result.length === 0) {
                const maybeFilterIssue = evaluatedCandidates.find(({ filterResult }) => filterResult instanceof Error);
                // if we couldn't come up with any items to select, throw an error from filtering, that will help the user to understand what's wrong
                if (maybeFilterIssue) throw maybeFilterIssue.filterResult;
            }

            result.forEach(el => {
                const uniqueSelector = getUniqueSelector(el);
                el.dataset.uniqueSelector = uniqueSelector;
            });

            const $result = Cypress.$(result);
            $result.selector = selector;

            if (options._log) {
                const candidatesLoading = new Map(
                    evaluatedCandidates.map(({ el, loadingResult }) => [el, loadingResult]),
                );
                const candidatesFilter = new Map(evaluatedCandidates.map(({ el, filterResult }) => [el, filterResult]));
                options._log.set({
                    $el: $result,
                    consoleProps: getConsoleProps({ selector, $result, candidatesLoading, candidatesFilter }),
                });
            }

            return $result;
        };

        const retryValue = () => {
            return Cypress.Promise.try(getValue).catch(err => {
                // do not retry configuration errors
                if (err instanceof AppActionsError) {
                    throw err;
                }

                options.error = err;

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

        return resolveValue().then(results => {
            if (options._log) {
                options._log.snapshot();
                options._log.end();
            }
            return results;
        });
    });
};
