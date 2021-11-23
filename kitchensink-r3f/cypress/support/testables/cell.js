import { createTestable, pure } from 'cypress-app-actions';

export const Cell = createTestable({
    role: 'Cell',

    // interactions: {
    //     fill: value => {
    //         return pure($input => {
    //             $input.vDomCallDriver('fill', value);
    //         });
    //     },
    // },
});
