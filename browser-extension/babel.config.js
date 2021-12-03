module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { firefox: '70', chrome: '78', electron: '9' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
};
