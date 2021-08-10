import { createTestable } from 'react-app-actions';

/**
 * Handle Alerts.
 *
 * @namespace HigherLevelApi.Alert
 */
export const Alert = createTestable({
    role: 'Alert',

    selectors: {
        /**
         * Fetch the alert message.
         *
         * @memberOf HigherLevelApi.Alert
         * @example
         * cy
         *      .with(Alert)
         *      .do(Alert.getMessage());
         *
         * @returns {string} Returns the text showed by the alert.
         */
        getMessage: () => $el => {
            return $el.vDomCallDriver('getMessage');
        },
        /**
         * Fetch the alert title.
         *
         * @memberOf HigherLevelApi.Alert
         * @example
         * cy
         *      .with(Alert)
         *      .do(Alert.getTitle());
         *
         * @returns {string} Returns the title text showed by the alert.
         */
        getTitle: () => $el => {
            return $el.vDomCallDriver('getTitle');
        },
    },
});
