module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'plugin:tailwind/recommended',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
};
