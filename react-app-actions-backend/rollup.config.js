import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'ReactAppActions',
    },
    plugins: [
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
};
