module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '12',
                    firefox: '70',
                    chrome: '78',
                    electron: '9',
                },
            },
        ],
    ],
};
