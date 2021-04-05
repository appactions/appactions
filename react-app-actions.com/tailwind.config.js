const colors = require('tailwindcss/colors');

module.exports = {
    purge: ['./pages/**/*.js', './components/**/*.js'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                teal: colors.teal,
                brand: {
                    red: '#DF2935',
                    green: '#86BA90',
                    yellow: '#F5F3BB',
                    tan: '#DFA06E',
                    brown: '#412722',
                },
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
        },
    },
    variants: {
        extend: {
            opacity: ['disabled'],
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
