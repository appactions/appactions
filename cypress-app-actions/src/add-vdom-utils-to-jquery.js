import { vDomFind, vDomFindByPredicate, vDomCallDriver, vDomClosest } from './vdom-utils';

export function addVDOMUtilsToJQuery($) {
    $.fn.extend({
        vDomCallDriver(method, ...args) {
            return vDomCallDriver(this, method, ...args);
        },
        vDomFind(selector) {
            const matches = vDomFind(this, selector);

            const $result = $(matches);
            // setting the selector so Cypress will print readable error messages
            $result.selector = `vDomFind('${selector}')`;
            return $result;
        },
        vDomFindByPredicate(predicate) {
            const matches = vDomFindByPredicate(this, predicate);

            const $result = $(matches);
            // setting the selector so Cypress will print readable error messages
            $result.selector = 'vDomFindByPredicate(predicate)';
            return $result;
        },
        vDomClosest(selector) {
            const matches = vDomClosest(this, selector);

            const $result = $(matches);
            // setting the selector so Cypress will print readable error messages
            $result.selector = `vDomClosest('${selector}')`;
            return $result;
        },
        forEach(fn) {
            Array.from(this).forEach((el, index, arr) => {
                const $el = $(el);
                fn($el, index, arr);
            });
        },
    });
}
