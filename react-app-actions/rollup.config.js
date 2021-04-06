import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';

// const sourcemap = process.env.NODE_ENV === 'production' ? false : 'inline';
const sourcemap = false;

export default [
    {
        input: 'packages/driver/index.js',
        external: [/@babel\/runtime/],
        output: {
            file: 'dist/driver.js',
            format: 'cjs',
            sourcemap,
        },
        plugins: [babel({ babelHelpers: 'runtime' })],
    },
    {
        input: 'packages/runner/index.js',
        external: [/@babel\/runtime/, 'fs', 'path', 'yaml', 'glob', 'puppeteer', 'expect'],
        output: {
            file: 'dist/runner.js',
            format: 'cjs',
            sourcemap,
        },
        plugins: [babel({ babelHelpers: 'runtime' })],
    },
    {
        input: 'packages/runtime/index.js',
        output: {
            file: 'dist/runtime.js',
            format: 'iife',
            name: 'ReactAppActions',
            sourcemap,
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
