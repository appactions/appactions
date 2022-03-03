module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'node 12.0',
                    browsers: { firefox: '70', chrome: '78', electron: '9' },
                },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    plugins: ['@babel/plugin-transform-flow-strip-types', '@babel/plugin-proposal-class-properties'],
};
