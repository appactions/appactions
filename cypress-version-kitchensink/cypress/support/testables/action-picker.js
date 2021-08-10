import { createTestable } from 'react-app-actions';
import { Dropdown } from './dropdown';

/**
 * Handle action pickers, but for tables and detail panes. You might not want to use this testable directly,
 * but the `DetailPane.selectAction(label)` or `TableRow.selectAction(actionLabel)` shorthands instead.
 *
 * @namespace HigherLevelApi.ActionPicker
 */
export const ActionPicker = createTestable({
    role: 'ActionPicker',

    selectors: {
        /**
         * Decide if an item in the action picker is active or not.
         *
         * @memberOf HigherLevelApi.ActionPicker
         * @example
         * cy
         *      .with(ActionPicker)
         *      .do(ActionPicker.isItemActive('Edit'))
         *
         * @param action {string} - Name of the action.
         *
         * @returns {boolean} Returns the state of the action.
         */
        isItemActive: (...path) => $el => {
            const $dropdown = $el.parent().vDomFind('Dropdown');
            return Dropdown.isItemActive(...path)($dropdown);
        },

        isActionActive: (...path) => $el => {
            return ActionPicker.isItemActive(...path)($el);
        },
    },

    interactions: {
        /**
         * Activates the specified action.
         *
         * @memberOf HigherLevelApi.ActionPicker
         * @example
         * cy
         *      .with(ActionPicker)
         *      .do(ActionPicker.selectAction('Edit'))
         *
         * @param path {string|string[]} - Name of the action to select or (for chained dropdown) path to the action
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        select: (...path) => $el => {
            const $dropdown = $el.parent().vDomFind('Dropdown');
            Dropdown.select(...path)($dropdown);
        },
        selectAction: (...path) => $el => {
            ActionPicker.select(...path)($el);
        },
    },
});
