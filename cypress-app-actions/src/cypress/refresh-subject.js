import getUniqueSelector from '@cypress/unique-selector';
import { isJquery } from './cypress-utils';

export function setUniqueSelector(items) {
    const result = Array.from(items).forEach(el => {
        const uniqueSelector = getUniqueSelector(el);
        el.dataset.uniqueSelector = uniqueSelector;
    });

    return isJquery(items) ? Cypress.$(result) : result;
}

export function refresh($subject) {
    const subject = Array.from($subject)
        .map(el => {
            return isElementMounted(el) ? el : refreshNativeNode(el);
        })
        .filter(Boolean);

    if (!subject.length) {
        throw new Error('All elements in the subject passed to React App Actions were detached from DOM.');
    }

    return Cypress.$(subject);
}

const getAppDocument = () => {
    const doc = window.parent.document.querySelector('iframe.aut-iframe').contentDocument;

    if (!doc) {
        throw new Error('Failed to find the "document" of the app runner iframe');
    }

    return doc;
};

const isElementMounted = el => {
    // this code runs in Cypress's `spec` iframe, needs to go up, select the app iframe, and do `body.contains`
    return getAppDocument().body.contains(el);
};

const refreshNativeNode = element => {
    const uniqueSelector = element.dataset.uniqueSelector;
    if (!uniqueSelector) {
        throw new Error('Refreshing element failed, because subject had no "dataset.uniqueSelector"');
    }
    const [newEl, ...rest] = getAppDocument().querySelectorAll(uniqueSelector);
    if (rest.length) {
        throw new Error(
            `Refreshing element failed, because "dataset.uniqueSelector" was not unique anymore: ${uniqueSelector}`,
        );
    }
    if (newEl) {
        // it's fine if no new element got selected, because it might been removed from the DOM
        // we are going to filter this gap from the subject in `refresh`
        newEl.dataset.uniqueSelector = uniqueSelector;
    }
    return newEl;
};
