import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'src/driver-api.js',
        external: [/@babel\/runtime/],
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        plugins: [babel({ babelHelpers: 'runtime' })],
    },
    {
        input: 'src/flow-api.js',
        external: [/@babel\/runtime/],
        output: {
            file: 'dist/flow-api.js',
            format: 'cjs',
        },
        plugins: [babel({ babelHelpers: 'runtime' })],
    },
];
