import { createTestable, pure, sideEffect } from 'react-app-actions';
import { Dropdown } from './dropdown';

/**
 * Handle forms.
 *
 * @memberof HigherLevelApi
 * @namespace HigherLevelApi.Form
 */
export const Form = createTestable({
    role: 'Form',

    isLoading($el) {
        // forms are wrapped into LoadingWrappers, so to get the loading state, we need to step up to the parent
        return $el.parent().find('.spinner').length;
    },

    customPicker: className => $el => {
        if (!className) {
            return true;
        }

        return $el.hasClass(className);
    },

    interactions: {
        /**
         * Fills a form.
         *
         * @memberof HigherLevelApi.Form
         * @example
         * cy
         *     .with(Form)
         *     .do(
         *         Form.fill({
         *             Title: 'Foo bar',
         *             Types: ['Domain Watchlist', 'URL Watchlist'],
         *         }),
         *     )
         *     .do(Form.submit());
         *
         * @param data {Object} - Object keys are form input labels, values are passed to the corresponding input.
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        fill: data => {
            return Object.entries(data).reduce(
                (prev, [labelText, value]) => {
                    const selectLabel = pure($form => {
                        const label = Array.from($form.vDomFind('BuilderRow Label')).find(el => {
                            const thisLabel = Cypress.$(el)
                                .textWithoutBlacklist()
                                .replace(/\*$/, '')
                                .trim();
                            return labelText === thisLabel;
                        });

                        if (!label) {
                            throw new Error(`Could not find label with text: "${labelText}"`);
                        }

                        return label;
                    });
                    const fill = pure(label => {
                        const $input = Cypress.$(label)
                            .vDomClosest('Row')
                            .vDomFind('Input');

                        if (!$input.length) {
                            throw new Error(`Could not find corresponding input for the label: "${labelText}"`);
                        }

                        if ($input.vDomCallDriver('isDisabled')) {
                            throw new Error(`Input with label "${labelText}" is disabled`);
                        }

                        $input.vDomCallDriver('fill', value);
                    });

                    return $form => {
                        prev($form);
                        fill(selectLabel($form));
                    };
                },
                () => {},
            );
        },

        /**
         * Submits a form.
         *
         * @memberof HigherLevelApi.Form
         * @example
         * cy
         *     .with(Form)
         *     .do(
         *         Form.fill({
         *             Title: 'Foo bar',
         *             Types: ['Domain Watchlist', 'URL Watchlist'],
         *         }),
         *     )
         *     .do(Form.submit());
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        submit: (buttonLabel = null) => $el => {
            // TODO annotate this with split purity
            const button = Array.from($el.vDomFind('Clickable')).find(el => {
                if (buttonLabel === null) {
                    return el.classList.contains('button--type-primary');
                }
                return Cypress.$(el).text() === buttonLabel;
            });

            if (button) {
                button.click();
                return;
            }

            if (buttonLabel === null) {
                throw new Error(`Default submit button on form does not exist, button label must be set`);
            }

            const $dropdown = $el.vDomFind('Dropdown');

            if (Dropdown.isItemActive(buttonLabel)($dropdown)) {
                Dropdown.select(buttonLabel)($dropdown);
            } else {
                throw new Error(
                    `Form submit with label "${buttonLabel}" is not possible, because that dropdown item is inactive`,
                );
            }
        },

        /**
         * Fills a form, and also submits it.
         *
         * @memberof HigherLevelApi.Form
         * @example
         * cy
         *     .with(Form)
         *     .do(
         *         Form.fillAndSubmit({
         *             Title: 'Foo bar',
         *             Types: ['Domain Watchlist', 'URL Watchlist'],
         *         }),
         *     );
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        fillAndSubmit: (data, buttonLabel = null) => $el => {
            Form.fill(data)($el);
            Form.submit(buttonLabel)($el);
        },
    },
});
