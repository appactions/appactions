const plugin = require('tailwindcss/plugin');

const checkedLabelPlugin = plugin(({ addVariant, e }) => {
    addVariant('after-checked', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `:checked + * .${e(`after-checked${separator}${className}`)}`;
        });
    });
});

module.exports = {
    purge: ['./pages/**/*.js', './components/**/*.js'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
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
        extend: {
            visibility: ['after-checked'],
            opacity: ['disabled'],
        },
    },
    plugins: [require('@tailwindcss/forms'), checkedLabelPlugin],
};
