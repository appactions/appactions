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
            keyframes: {
                'fade-in': {
                    '0%': {
                        opacity: '0',
                    },
                    '80%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                    },
                },
            },
            animation: {
                'delayed-fade-in': 'fade-in 2s ease-in',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
