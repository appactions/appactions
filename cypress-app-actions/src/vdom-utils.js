import {
    findElementByPredicate,
    findElementByRole,
    findElementByReactComponentName,
    findAncestorElementByRole,
    findAncestorElementByReactComponentName,
    isRole,
} from './api';

export const vDomFind = ($el, selector) => {
    return (
        selector
            // trim it
            .split(' ')
            .map(str => str.trim())
            .filter(Boolean)
            // make sure there is no space after a comma
            .join(' ')
            .replace(/,\s/g, ',')
            // go over all nested selectors (space operator)
            .split(' ')
            .reduce((selection, currentSelector) => {
                return selection
                    .flatMap(el => {
                        const fiber = Cypress.AppActions.reactApi.findFiber(el);
                        return currentSelector.split(',').flatMap(name => {
                            if (isRole(name)) {
                                return findElementByRole(fiber, name);
                            }
                            return findElementByReactComponentName(fiber, name);
                        });
                    })
                    .filter(Boolean);
            }, Array.from($el))
    );
};

export const vDomFindByPredicate = ($el, predicate) => {
    return Array.from($el).map(el => findElementByPredicate(el, predicate));
};

export const vDomClosest = ($el, selector) => {
    if (selector.includes(',')) {
        throw new Error('`vDomClosest` does not support the comma operator');
    }
    if (selector.includes(' ')) {
        throw new Error('`vDomClosest` does not support the space operator');
    }
    return Array.from($el)
        .flatMap(el => {
            const fiber = Cypress.AppActions.reactApi.findFiber(el);
            if (isRole(selector)) {
                return findAncestorElementByRole(fiber, selector);
            }

            return findAncestorElementByReactComponentName(fiber, selector);
        })
        .filter(Boolean);
};
