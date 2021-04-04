const colors = require('tailwindcss/colors');

module.exports = {
    purge: ['./pages/**/*.js', './components/**/*.js'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                teal: colors.teal,
                cyan: colors.cyan,
            },
            fontFamily: {
                // reorder list to resembe more to VSCode
                mono: [
                    'Monaco', // Monaco is the VSCode font on Mac
                    'Menlo', // Menlo is on Window (I think)
                    'ui-monospace',
                    'SFMono-Regular',
                    'Consolas',
                    '"Liberation Mono"',
                    '"Courier New"',
                    'monospace',
                ],
            },
            width: {
                192: '40rem',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
