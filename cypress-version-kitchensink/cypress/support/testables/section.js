import { createTestable } from 'react-app-actions';

/**
 * Handle sections. Helpful in selection.
 *
 * @namespace HigherLevelApi.Section
 */
export const Section = createTestable({
    role: 'Section',

    customPicker: title => $el => {
        if (!title) {
            return true;
        }

        const sectionTitle = $el.vDomCallDriver('getTitle');

        if (title instanceof RegExp) {
            return title.test(sectionTitle);
        }

        return sectionTitle === title;
    },
});
