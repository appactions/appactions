import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: 'src/index.js',
    external: [/@babel\/runtime/],
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'ReactAppActionsBackend',
    },
    plugins: [
        resolve(),
        babel({ babelHelpers: 'runtime' }),
        replace({
            preventAssignment: true,
            values: {
                process: false,
                'process.env.NODE_ENV': JSON.stringify('production'),
            },
        }),
    ],
};
