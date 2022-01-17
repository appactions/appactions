module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['last 2 Chrome versions'],
                },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    plugins: ['@babel/plugin-transform-flow-strip-types', '@babel/plugin-proposal-class-properties'],
};
