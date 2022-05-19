import { getCypressElementCoordinates } from './coord-utils';
import { keyCodeDefinitions, keyToModifierBitMap, getKeyDefinition } from './keyboard-definitions';
import isMatch from 'lodash.ismatch';
import isEqual from 'lodash.isequal';

export const builtInActions = {
    async click({ $el }) {
        const { x, y } = getCypressElementCoordinates($el, { x: 10, y: 10 });
        Cypress.automation('remote:debugger:protocol', {
            command: 'Input.dispatchMouseEvent',
            params: {
                type: 'mousePressed',
                x,
                y,
                clickCount: 1,
                buttons: 1,
                pointerType: 'mouse',
                button: 'left',
            },
        });
        Cypress.automation('remote:debugger:protocol', {
            command: 'Input.dispatchMouseEvent',
            params: {
                type: 'mouseReleased',
                x,
                y,
                clickCount: 1,
                buttons: 1,
                pointerType: 'mouse',
                button: 'left',
            },
        });
    },
    hover({ $el }) {
        const { x, y } = getCypressElementCoordinates($el, { x: 10, y: 10 });
        Cypress.automation('remote:debugger:protocol', {
            command: 'Input.dispatchMouseEvent',
            params: {
                x,
                y,
                type: 'mouseMoved',
                button: 'none',
                pointerType: 'mouse',
            },
        });
    },
    async press(_, keyOrShortcut, options = {}) {
        let modifiers = 0;
        const keys = Array.isArray(keyOrShortcut) ? keyOrShortcut : [keyOrShortcut];
        const keyDefinitions = keys.map(getKeyDefinition);
        for (const key of keyDefinitions) {
            modifiers |= keyToModifierBitMap[key.key] ?? 0;
            Cypress.automation('remote:debugger:protocol', {
                command: 'Input.dispatchKeyEvent',
                params: {
                    type: key.text ? 'keyDown' : 'rawKeyDown',
                    modifiers,
                    ...key,
                },
            });
            if (key.code === 'Enter') {
                Cypress.automation('remote:debugger:protocol', {
                    command: 'Input.dispatchKeyEvent',
                    params: {
                        type: 'char',
                        unmodifiedText: '\r',
                        text: '\r',
                    },
                });
            }
            await new Promise(res => setTimeout(res, options.pressDelay ?? 25));
        }
        await Promise.all(
            keyDefinitions.map(key => {
                return Cypress.automation('remote:debugger:protocol', {
                    command: 'Input.dispatchKeyEvent',
                    params: {
                        type: 'keyUp',
                        modifiers,
                        ...key,
                    },
                });
            }),
        );
    },
    swipe({ $el }) {
        throw new Error('Not implemented');
    },
    touch({ $el }) {
        throw new Error('Not implemented');
    },
    async type({ $el }, text) {
        const availableChars = Object.keys(keyCodeDefinitions);
        function assertChar(char) {
            if (!availableChars.includes(char)) {
                throw new Error(`Unrecognized character "${char}".`);
            }
        }

        const chars = text
            .split(/({.+?})/)
            .filter(Boolean)
            .reduce((acc, group) => {
                return /({.+?})/.test(group) ? [...acc, group] : [...acc, ...group.split('')];
            }, []);

        $el.focus();

        for (const char of chars) {
            assertChar(char);
            await builtInActions.press({ $el }, char, {
                pressDelay: 15,
            });

            await new Promise(res => setTimeout(res, 25));
        }
    },
    mouseDown({ $el }) {
        throw new Error('Not implemented');
    },
    mouseMove({ $el }) {
        throw new Error('Not implemented');
    },
    mouseUp({ $el }) {
        throw new Error('Not implemented');
    },
    goto() {
        throw new Error('Not implemented');
    },

    // for assertions
    exists() {
        throw new Error('Not implemented');
    },
    text() {
        throw new Error('Not implemented');
    },
};

export const builtInAsserts = {
    exists: {
        test: null,
        input: null,
    },
    text: {
        test: '===',
        input: 'text',
    },
};

export const builtInTesters = {
    '===': 'toBe',
    equal: 'toEqual',
    // '===': (actual, expected) => actual === expected,
    // '!==': (actual, expected) => actual !== expected,
    // '_.isEqual': (actual, expected) => isEqual(actual, expected),
    // '_.isMatch': (actual, expected) => isMatch(actual, expected),
    // 'String .includes': (actual, expected) => actual.includes(expected),
    // 'String .startsWith': (actual, expected) => actual.startsWith(expected),
    // 'String .endsWith': (actual, expected) => actual.endsWith(expected),
    // 'String .match': (actual, expected) => actual.match(expected),
};
