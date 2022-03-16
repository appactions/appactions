import { getCypressElementCoordinates } from './coord-utils';
import { keyCodeDefinitions } from './keyboard-definitions';

function getKeyDefinition(key) {
    const keyDefinition = keyCodeDefinitions[key];

    if (!keyDefinition) {
        throw new Error(`Unsupported key '${key}'.`);
    }

    const keyCode = keyDefinition.keyCode ?? 0;
    return {
        keyCode,
        key: keyDefinition?.key ?? '',
        text: keyDefinition.key.length === 1 ? keyDefinition.key : undefined,
        code: keyDefinition.code ?? '',
        location: keyDefinition.location ?? 0,
        windowsVirtualKeyCode: keyCode,
    };
}

const keyToModifierBitMap = {
    Alt: 1,
    Control: 2,
    Meta: 4,
    Shift: 8,
};

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
};