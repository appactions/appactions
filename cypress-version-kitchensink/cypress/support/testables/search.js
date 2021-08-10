import { createTestable } from 'react-app-actions';

/**
 * Handle search fields.
 *
 * @memberOf HigherLevelApi
 * @namespace HigherLevelApi.Search
 */
export const Search = createTestable({
    role: 'Search',

    interactions: {
        /**
         * Searches in a search input.
         *
         * @memberOf HigherLevelApi.Search
         * @example
         * cy
         *      .with(Search)
         *      .do(Search.search('Foo bar baz'));
         *
         * @param text {string} - Searches for this string.
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        search: text => $el => {
            $el.vDomCallDriver('search', text);
        },

        reset: () => $el => {
            $el.vDomCallDriver('reset');
        },
    },
});
