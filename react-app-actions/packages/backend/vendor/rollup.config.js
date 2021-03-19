import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import path from 'path';

export default {
    input: 'packages/backend/vendor/react-devtools-shared/src/backend/renderer.js',
    output: {
        file: 'packages/backend/vendor/react-devtools-renderer.js',
        format: 'es',
    },
    plugins: [
        alias({
            entries: [
                {
                    find: 'react-devtools-shared',
                    replacement: path.resolve(__dirname, 'react-devtools-shared'),
                },
            ],
        }),
        resolve(),
        commonjs({
            include: /node_modules/,
        }),
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/env', '@babel/preset-flow'],
        }),
        replace({
            preventAssignment: true,
            values: {
                __DEV__: false,
            },
        }),
    ],
};
