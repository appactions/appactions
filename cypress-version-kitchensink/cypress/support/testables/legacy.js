// legacy testables, we want to migrate away from these to better designs

import { createTestable, pure } from 'react-app-actions';
import { Form } from './form';

export const ListHeader = createTestable({
    role: 'ListHeader',
    interactions: {
        openFilterPanel: () => $el => {
            pure(() => {
                $el.vDomCallDriver('activateActionByIcon', 'filter');
            })();
        },
        activateActionByIcon: icon => $el => {
            pure(() => {
                $el.vDomCallDriver('activateActionByIcon', icon);
            })();
        },
        searchBy: () => () => {
            throw new Error('Method not supported, use `Search.search` instead.');
        },
        activateActionByTitle: title => $el => {
            pure(() => {
                $el.vDomCallDriver('activateActionByTitle', title);
            })();
        },
    },
});

export const Collapsible = createTestable({
    role: 'Collapsible',
    customPicker: title => $el => {
        if (!title) {
            return true;
        }

        return $el
            .find('.collapse__title')
            .text()
            .includes(title);
    },
    interactions: {
        toggle: () => $el => {
            $el.vDomCallDriver('toggle');
        },
        fill: data => $el => {
            Form.fill(data)($el);
        },
        close: () => $el => {
            $el.vDomCallDriver('close');
        },
    },
});

export const Notification = createTestable({
    role: 'Notification',

    selectors: {
        getNotification: () => $el => {
            return $el.vDomCallDriver('getNotification');
        },
    },

    interactions: {
        closeNotification: () => $el => {
            $el.vDomCallDriver('closeNotification');
        },
    },
});

export const FilterPanel = createTestable({
    role: 'FilterPanel',
    interactions: {
        filterBy: (label, value) => $el => {
            const filterSelector = `[data-test="${label}"]`;
            const $filter = $el.find(filterSelector);

            if (!$filter.length) {
                throw new Error(`couldn't find "${filterSelector}" filter group`);
            }

            if (!$filter.hasClass('filter__group--active')) {
                $filter.find('.filter__group-title').click();
            }

            const $checkbox = $filter.find(`.simple-checkbox:contains('${value}') input:checkbox`);

            if (!$checkbox.length) {
                throw new Error(`checkbox with text label "${value}" not found`);
            }

            $checkbox.click();
        },
        hideExternalReferences: status => $el => {
            const filterSelector = '[data-test="External references"]';
            const $filter = $el.find(filterSelector);

            if (!$filter.length) {
                throw new Error(`couldn't find "${filterSelector}" filter group`);
            }

            if (!$filter.hasClass('filter__group--active')) {
                $filter.find('.filter__group-title').click();
            }

            const $switch = $filter.find('.toggle-switch__slider span:eq(0)');

            if (
                ($switch.hasClass('icon-base--color-green') && status) ||
                ($switch.hasClass('icon-base--color-grey') && !status)
            ) {
                $switch.click();
            }
        },
    },
});
