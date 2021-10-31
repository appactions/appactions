import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import path from 'path';

export default {
    input: 'src/vendor/react/packages/react-devtools-shared/src/backend/renderer.js',
    output: {
        file: 'src/vendor/react-devtools-renderer-build/index.js',
        format: 'cjs',
    },
    plugins: [
        resolve({
            jail: __dirname,
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
        babel({
            exclude: 'node_modules/**',
        }),
        commonjs({
            include: ['node_modules/**', 'react/packages/**'],
            namedExports: {
                '../node_modules/react-is/index.js': [
                    'isElement',
                    'typeOf',
                    'ContextConsumer',
                    'ContextProvider',
                    'ForwardRef',
                    'Fragment',
                    'Lazy',
                    'Memo',
                    'Portal',
                    'Profiler',
                    'StrictMode',
                    'Suspense',
                ],
                '../node_modules/clipboard-js/clipboard.js': ['copy'],
            },
        }),
    ],
};
