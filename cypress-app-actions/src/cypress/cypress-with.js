import { listFiberByRole, isJquery } from '../api';
import { AppActionsError, formatArguments, isDOMNode } from './cypress-utils';
import { setUniqueSelector, refresh } from './refresh-subject';
import { getFiberInfo } from '../api';

export const register = (name = 'with', { defaultIsLoading = () => false } = {}) => {
    Cypress.Commands.add(name, { prevSubject: 'optional' }, (subject, role, picker) => {
        // if (!testable.isTestable) {
        //     throw new AppActionsError(`value passed to cy.${name} is not a testable`);
        // }

        // if (!testable.role) {
        //     throw new AppActionsError(`cyname don't know the selected role`);
        // }

        // if (pickerData.length && !testable.customPicker) {
        //     throw new AppActionsError(`testable "${testable.role}" does not have selector support when cy.${name}`);
        // }

        const start = performance.now();

        const options = {
            log: true,
            timeoutOnLoading: 6e4, // TODO hardcoded value
        };

        let selector = role;

        if (typeof picker === 'function') {
            selector = `${role} (with a function)`;
        } else if (picker instanceof RegExp) {
            selector = `${role} (name: /${picker.source}/)`;
        } else if (typeof picker === 'string') {
            selector = `${role} (name: "${picker}")`;
        }

        function filter(name, index, arr) {
            if (picker === undefined) {
                return true;
            }

            if (typeof picker === 'function') {
                // selector = `${role} (with a function)`;
                return picker(name, index, arr);
            } else if (picker instanceof RegExp) {
                // selector = `${role} (with a RegExp)`;
                return picker.test(name);
            } else if (typeof picker === 'string') {
                return name === picker;
            } else {
                throw new AppActionsError(`Invalid picker: should be string, RegExp or function`);
            }
        }

        const getConsolePropsWithoutResult = () => ({
            Command: name,
            Subject: subject,
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

        // const isTestableLoading = testable.isLoading || defaultIsLoading;

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

            let head;

            if (!subject) {
                head = Cypress.AppActions.hook.getAllFiberRoots();
            } else if (isJquery(subject)) {
                head = Array.from(refresh(subject));
            } else if (!Array.isArray(subject)) {
                head = [subject];
            } else {
                head = subject;
            }

            let maybeCandidateError = null;

            const candidates = head.flatMap(node => {
                try {
                    const fiber = Cypress.AppActions.reactApi.findFiber(node);
                    const matches = listFiberByRole(fiber, role);
                    return matches.map(fiber => getFiberInfo(fiber));
                } catch (e) {
                    maybeCandidateError = e;
                    return [];
                }
            });

            if (maybeCandidateError && candidates.length === 0) {
                throw maybeCandidateError;
            }

            const evaluatedCandidates = candidates.map((candidate, index, array) => {
                const els = isDOMNode(candidate.nodes[0]) ? Cypress.$(candidate.nodes) : candidate.nodes;
                let loadingResult = null;
                try {
                    // convert to boolean is important, later we will handle candidates as "loaded" if it has an explicit false
                    // loadingResult = Boolean(isTestableLoading(el));
                    loadingResult = false;
                } catch (error) {
                    loadingResult = error;
                }

                const name = candidate.driver.getName(candidate);

                let filterResult = null;
                try {
                    // convert to boolean is important, later we will handle candidates as "picked" if it has an explicit true
                    filterResult = Boolean(filter(name, index, array));
                } catch (error) {
                    filterResult = error;
                }
                return {
                    // TODO not sure what would be the best to return here, host node, fiber, or jquery?
                    // following logic will expect what comes from findElementByRole
                    els: candidate.nodes,
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
                    .flatMap(({ els }) => els);
            }

            if (result.length === 0) {
                const maybeFilterIssue = evaluatedCandidates.find(({ filterResult }) => filterResult instanceof Error);
                // if we couldn't come up with any items to select, throw an error from filtering, that will help the user to understand what's wrong
                if (maybeFilterIssue) throw maybeFilterIssue.filterResult;
            }

            if (result.every(isDOMNode)) {
                setUniqueSelector(result);

                const $result = Cypress.$(result);
                $result.selector = selector;

                if (options._log) {
                    const candidatesLoading = new Map(
                        evaluatedCandidates.map(({ els, loadingResult }) => [els, loadingResult]),
                    );
                    const candidatesFilter = new Map(
                        evaluatedCandidates.map(({ els, filterResult }) => [els, filterResult]),
                    );
                    options._log.set({
                        $el: $result,
                        consoleProps: getConsoleProps({ selector, $result, candidatesLoading, candidatesFilter }),
                    });
                }

                return $result;
            } else {
                if (options._log) {
                    options._log.set({
                        result,
                    });
                }

                return result;
            }
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
