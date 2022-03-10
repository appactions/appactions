import { getCypressElementCoordinates } from './coord-utils';

export const builtInActions = {
    click({ $el }) {
        const { x, y } = getCypressElementCoordinates($el, { x: 0, y: 0 });
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
        const { x, y } = getCypressElementCoordinates($el, { x: 0, y: 0 });
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
    press({ $el }) {
        throw new Error('Not implemented');
    },
    swipe({ $el }) {
        throw new Error('Not implemented');
    },
    touch({ $el }) {
        throw new Error('Not implemented');
    },
    type({ $el }) {
        throw new Error('Not implemented');
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
