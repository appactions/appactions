import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'packages/driver/index.js',
        external: [/@babel\/runtime/],
        output: {
            file: 'dist/driver.js',
            format: 'cjs',
        },
        plugins: [babel({ babelHelpers: 'runtime' })],
    },
    {
        input: 'packages/runner/index.js',
        external: [/@babel\/runtime/, 'fs', 'path', 'yaml', 'glob', 'puppeteer', 'expect'],
        output: {
            file: 'dist/runner.js',
            format: 'cjs',
        },
        plugins: [babel({ babelHelpers: 'runtime' })],
    },
    {
        input: 'packages/backend/index.js',
        output: {
            file: 'dist/backend.js',
            format: 'iife',
            name: 'ReactAppActionsBackend',
        },
        plugins: [
            commonjs(),
            resolve(),
            babel({ babelHelpers: 'bundled' }),
            replace({
                preventAssignment: true,
                values: {
                    process: false,
                    'process.env.NODE_ENV': JSON.stringify('production'),
                },
            }),
        ],
    },
];
