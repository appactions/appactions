import { createTestable } from 'react-app-actions';

/**
 * Handle clickable components, such as links and buttons.
 *
 * @namespace HigherLevelApi.Clickable
 */
export const Clickable = createTestable({
    role: 'Clickable',

    customPicker: title => $el => {
        if (!title) {
            return true;
        }

        const clickableTitle = $el.text();

        if (title instanceof RegExp) {
            return title.test(clickableTitle);
        }

        return clickableTitle.includes(title);
    },
});
