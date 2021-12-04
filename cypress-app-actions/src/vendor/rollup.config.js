import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import path from 'path';

const makeConfig = (input, output) => ({
    input,
    output: {
        file: output,
        format: 'es',
    },
    plugins: [
        resolve({
            preferBuiltins: false,
        }),
        alias({
            entries: [
                {
                    find: 'react-debug-tools',
                    replacement: path.resolve(__dirname, 'react/packages/react-debug-tools'),
                },
                {
                    find: 'react-devtools-feature-flags',
                    replacement: path.resolve(
                        __dirname,
                        'react/packages/react-devtools-shared/src/config/DevToolsFeatureFlags.default.js',
                    ),
                },
                {
                    find: 'react-devtools-shared',
                    replacement: path.resolve(__dirname, 'react/packages/react-devtools-shared'),
                },
                {
                    find: 'react-reconciler',
                    replacement: path.resolve(__dirname, 'react/packages/react-reconciler'),
                },
                {
                    find: 'shared',
                    replacement: path.resolve(__dirname, 'react/packages/shared'),
                },
            ],
        }),
        commonjs({
            include: /node_modules/,
            // include: ['node_modules/**', 'react/packages/**'],
            // namedExports: {
            //     '../node_modules/react-is/index.js': [
            //         'isElement',
            //         'typeOf',
            //         'ContextConsumer',
            //         'ContextProvider',
            //         'ForwardRef',
            //         'Fragment',
            //         'Lazy',
            //         'Memo',
            //         'Portal',
            //         'Profiler',
            //         'StrictMode',
            //         'Suspense',
            //     ],
            //     '../node_modules/clipboard-js/clipboard.js': ['copy'],
            // },
        }),
        babel({
            babelHelpers: 'bundled',
            // exclude: 'node_modules/**',
        }),
        replace({
            preventAssignment: true,
            values: {
                __DEV__: false,
            },
        }),
    ],
});

export default [
    makeConfig(
        'src/vendor/react/packages/react-devtools-shared/src/devtools/store.js',
        'src/vendor/react-devtools-renderer-build/store.js',
    ),
    makeConfig(
        'src/vendor/react/packages/react-devtools-shared/src/backend/renderer.js',
        'src/vendor/react-devtools-renderer-build/renderer.js',
    ),
];
