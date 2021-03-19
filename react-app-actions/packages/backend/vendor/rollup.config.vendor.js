import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';
import path from 'path';

export default {
    input: 'src/vendor/react-devtools-shared/src/backend/renderer.js',
    output: {
        file: 'src/vendor/react-devtools-renderer-build/index.js',
        format: 'cjs',
    },
    plugins: [
        resolve(),
        alias({
            entries: [
                {
                    find: 'react-devtools-shared',
                    replacement: path.resolve(__dirname, 'react-devtools-shared'),
                },
            ],
        }),
        babel({
            exclude: 'node_modules/**',
        }),
        commonjs({
            include: /node_modules/,
            namedExports: {
                'node_modules/react-is/index.js': [
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
            },
        }),
    ],
};
