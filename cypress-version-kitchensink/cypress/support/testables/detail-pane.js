import { createTestable, pure } from 'react-app-actions';
import { ActionPicker } from './action-picker';

/**
 * Handle detail panes.
 *
 * @namespace HigherLevelApi.DetailPane
 */
export const DetailPane = createTestable({
    role: 'DetailPane',

    customPicker: title => $el => {
        if (!title) {
            return true;
        }

        return $el.vDomCallDriver('getTitle').includes(title);
    },

    // TODO: this method should be called isReady
    isLoading($el) {
        // our DetailPane sometimes shows a brief "could not load" state before shows the item,
        // so handle it as a loading state
        if (
            $el
                .vDomFind('DetailPaneTitleBar')
                .text()
                .trim() === 'Could not load item'
        ) {
            throw new Error('Item could not be displayed on detail pane.');
        }
    },

    selectors: {
        /**
         * Gets the title of the detail pane. Returns with the full string, even when truncated.
         *
         * @memberOf HigherLevelApi.DetailPane
         * @example
         * cy
         *      .with(DetailPane)
         *      .do(DetailPane.getTitle());
         *
         * @returns {string} Returns the detail pane title.
         */
        getTitle: () => $el => {
            return $el.vDomCallDriver('getTitle');
        },

        /**
         * Gets if an action is active or disabled.
         *
         * @memberOf HigherLevelApi.DetailPane
         * @example
         * cy
         *      .with(DetailPane)
         *      .do(DetailPane.isActionActive('Edit'));
         *
         * @param action {string} - Label of the action.
         *
         * @returns {boolean} Returns true if action is active, false otherwise.
         */
        isActionActive: (...path) => $el => {
            const $header = $el.vDomFind('DetailPaneHeaderBar');
            return ActionPicker.isItemActive(...path)($header);
        },
    },

    interactions: {
        /**
         * Uses an action from the action picker.
         *
         * @memberOf HigherLevelApi.DetailPane
         * @example
         * cy
         *      .with(DetailPane)
         *      .do(DetailPane.selectAction('Edit'));
         *
         * @param action {string} - Label of the action.
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        selectAction: (...path) => $el => {
            const $header = $el.vDomFind('DetailPaneHeaderBar');
            ActionPicker.select(...path)($header);
        },

        /**
         * Closes the pane.
         *
         * @memberOf HigherLevelApi.DetailPane
         * @example
         * cy
         *      .with(DetailPane)
         *      .do(DetailPane.close());
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        close: () => $el => {
            $el.find('.detail-pane__header-icon').click();
        },

        /**
         * Navigates between tabs.
         *
         * @memberOf HigherLevelApi.DetailPane
         * @example
         * cy
         *      .with(DetailPane)
         *      .do(DetailPane.visitTab('Neighbours'));
         *
         * @param tabTitle {string} - Label of the tab.
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        visitTab: tabTitle => $el => {
            pure(() => {
                const match = Array.from($el.vDomFind('TabItem')).find(el => Cypress.$(el).text() === tabTitle);

                if (!match) {
                    throw new Error(`Could not find tab item with label "${tabTitle}"`);
                }

                Cypress.$(match).vDomCallDriver('click');
            })();
        },
    },
});
