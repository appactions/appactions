export const isJquery = obj => {
    return !!(obj && obj.jquery && Cypress._.isFunction(obj.constructor));
};

export const getElements = $el => {
    const $arr = Array.from($el);

    if ($arr.length === 1) {
        return $arr[0];
    } else {
        return $arr;
    }
};

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
        // we are going to filter this gap from the subject in `refreshSubject`
        newEl.dataset.uniqueSelector = uniqueSelector;
    }
    return newEl;
};

export const refreshSubject = $subject => {
    const subject = Array.from($subject)
        .map(el => {
            return isElementMounted(el) ? el : refreshNativeNode(el);
        })
        .filter(Boolean);

    if (!subject.length) {
        throw new Error('All elements in the subject passed to React App Actions were detached from DOM.');
    }

    return Cypress.$(subject);
};

export const getFunctionName = fn => {
    return fn.displayName || fn.name || undefined;
};

export const getFunctionArguments = fn => {
    return fn.displayArgs;
};

const formatArgument = arg => {
    if (arg === 'null') return 'null';
    if (typeof arg === 'string') return `"${arg}"`;
    if (arg instanceof RegExp) return String(arg);
    if (typeof arg === 'function') return '[function]';
    if (typeof arg === 'object') return '{ ... }';
    return String(arg);
};

export const formatArguments = args => args.map(formatArgument).join(', ');

export class AppActionsError extends Error {}

// "instanceof Element" seems like not working reliably, using this hack for now
export function isDOMNode(node) {
    return node && typeof node === 'object' && typeof node.querySelector === 'function';
}