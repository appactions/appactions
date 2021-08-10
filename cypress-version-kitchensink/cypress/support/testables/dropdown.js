import { createTestable, pure, sideEffect } from 'react-app-actions';

function findClickable(labels) {
    const open = sideEffect($root => {
        $root.vDomCallDriver('open');
        return $root;
    });

    const hover = sideEffect($current => {
        $current.vDomCallDriver('hover');
        return $current;
    });

    const findNext = (label, index) => {
        return pure($current => {
            const match = Array.from($current.vDomFind('Clickable')).find(el => {
                return (
                    Cypress.$(el)
                        .text()
                        .trim() === label
                );
            });
            if (!match) {
                // TODO: wrong error message when a nested path doesn't exist
                throw new Error(`Could not find dropdown item labelled as "${label}"`);
            }
            // let's wait for items to be active before proceeding, except for the last item
            // last item is the selected one, outer code will decide what to do with it (Dropdown.isItemActive for example)
            if (index < labels.length - 1 && match.classList.contains('dropdown__option--disabled')) {
                throw new Error(`Selected dropdown item "${label}" is not active`);
            }
            return Cypress.$(match);
        });
    };

    return $root => {
        const $result = labels.reduce(($el, label, index) => {
            return findNext(label, index)(hover($el));
        }, open($root));

        if (!$result.length) {
            throw new Error(`could not find clickable with labels "${labels.join(', ')}"`);
        }

        return $result;
    };
}

export const Dropdown = createTestable({
    role: 'Dropdown',

    customPicker: title => $el => {
        if (!title) {
            return true;
        }

        return Array.from($el.vDomFind('Clickable')).some(el => {
            const dropdownLabel = Cypress.$(el)
                .text()
                .trim();

            if (title instanceof RegExp) {
                return title.test(dropdownLabel);
            }

            return dropdownLabel === title;
        });
    },

    interactions: {
        select: (...labels) => {
            const validate = pure($match => {
                if ($match.hasClass('dropdown__option--disabled')) {
                    throw new Error(`selected dropdown item "${labels[labels.length - 1]}" is not active`);
                }

                return $match;
            });
            const click = sideEffect($match => {
                $match[0].click();
            });
            const close = sideEffect($root => {
                $root.vDomCallDriver('close');
            });
            return $root => {
                click(validate(findClickable(labels)($root)));

                // sometimes the previous click can cause the $root to disappear,
                // for example if it's a DetailPane, and an action was making it closed
                if (Cypress.$.contains(document, $root[0])) {
                    close($root);
                }
            };
        },
    },

    selectors: {
        isItemActive: (...labels) => {
            const isActive = pure($match => {
                return !$match.hasClass('dropdown__option--disabled');
            });
            const close = sideEffect($root => {
                $root.vDomCallDriver('close');
            });
            return $root => {
                const clickable = findClickable(labels)($root);
                const result = isActive(clickable);
                close($root);
                return result;
            };
        },
    },
});
