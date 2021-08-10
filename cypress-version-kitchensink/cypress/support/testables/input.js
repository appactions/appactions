import { createTestable, pure } from 'react-app-actions';

/**
 * Handle inputs.
 *
 * @memberof HigherLevelApi
 * @namespace HigherLevelApi.Input
 */
export const Input = createTestable({
    role: 'Input',

    customPicker: title => $el => {
        if (!title) {
            return true;
        }

        return (
            $el
                .vDomClosest('Row')
                .vDomFind('Label')
                .textWithoutBlacklist()
                .replace(/\*$/, '')
                .trim() === title
        );
    },

    /**
     * Fills an input. You usually don't want to use this testable, because Form is more convinient.
     *
     * This testable is supposed to be a workaround, if an input is not wrapped with a form for any reason.
     *
     * @memberof HigherLevelApi.Input
     * @example
     * cy
     *      .with(Input)
     *      .do(Input.fill('Platform Admin'))
     *
     * @param value {any} - Value to set the input.
     *
     * @returns {Cypress.Chainable<any>} Returns the same subject.
     */
    interactions: {
        fill: value => {
            return pure($input => {
                $input.vDomCallDriver('fill', value);
            });
        },
        // implemented for the Select input only
        unselect: value => {
            return pure($input => {
                $input.vDomCallDriver('unselect', value);
            });
        },
        focus: () => {
            return pure($input => {
                $input.vDomCallDriver('focus');
            });
        },
        blur: () => {
            return pure($input => {
                $input.vDomCallDriver('blur');
            });
        },
    },
});
