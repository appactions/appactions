import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import multi from 'rollup-plugin-multi-input';
import replace from '@rollup/plugin-replace';

export default {
    input: ['src/index.js', 'src/cypress/plugin.js'],
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    plugins: [
        multi(),
        resolve(),
        // alias({
        //     entries: [
        //         {
        //             find: 'react-devtools-shared',
        //             replacement: path.resolve(__dirname, 'react-devtools-shared'),
        //         },
        //     ],
        // }),
        babel({
            // exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        commonjs({
            // include: /node_modules/,
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
        replace({
            preventAssignment: true,
            values: {
                process: false,
                'process.env.NODE_ENV': JSON.stringify('production'),
            },
        }),
    ],
};
