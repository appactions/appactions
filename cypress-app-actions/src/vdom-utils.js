import {
    callInteraction,
    findElementByPredicate,
    findElementByRole,
    findElementByReactComponentName,
    findAncestorElementByRole,
    findAncestorElementByReactComponentName,
    isRole,
} from './api';

export const vDomCallDriver = ($el, methodName, ...args) => {
    return callInteraction($el, methodName, ...args);
};

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
                        return currentSelector.split(',').flatMap(name => {
                            if (isRole(name)) {
                                return findElementByRole(el, name);
                            }
                            return findElementByReactComponentName(el, name);
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
            if (isRole(selector)) {
                return findAncestorElementByRole(el, selector);
            }

            return findAncestorElementByReactComponentName(el, selector);
        })
        .filter(Boolean);
};
