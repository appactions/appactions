import { createTestable, pure } from 'cypress-app-actions';

export const Input = createTestable({
    role: 'Input',

    interactions: {
        fill: value => {
            return pure($input => {
                $input.vDomCallDriver('fill', value);
            });
        },
    },
});
