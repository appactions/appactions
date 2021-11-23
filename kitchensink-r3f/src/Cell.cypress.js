import { register } from 'cypress-app-actions';

register('Cell', {
    role: 'Cell',
    drivers: {
        click: () => ($el, self) => {
            // TODO
        },
    },
});
