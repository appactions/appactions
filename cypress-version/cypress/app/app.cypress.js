import { register } from '../../.';

register('Table', {
    role: 'Table',
    drivers: {
        sort: (label, order) => (_, self) => {
            self.reorder(label, order)(new Event('click'));
        },
    },
});

register('TableRow', {
    role: 'TableRowTestable',
});

register('h2', {
    role: 'Header',
});
