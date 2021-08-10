import { createTestable } from 'react-app-actions';

/**
 * Handle modals.
 *
 * @namespace HigherLevelApi.Modal
 */
export const Modal = createTestable({
    role: 'Modal',

    interactions: {
        /**
         * Closes the modal.
         *
         * @memberOf HigherLevelApi.Modal
         * @example
         * cy
         *      .with(Modal)
         *      .do(Modal.close());
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        close: () => $el => {
            return $el.vDomCallDriver('close');
        },
    },
});
