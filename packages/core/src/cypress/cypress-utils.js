export const isJquery = obj => {
    return !!(obj && obj.jquery && Cypress._.isFunction(obj.constructor));
};

const formatArgument = arg => {
    if (arg === null) return 'null';
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