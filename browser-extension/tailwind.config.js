const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                teal: colors.teal,
                brand: {
                    green: '#86BA90',
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
