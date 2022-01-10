const webpack = require('@cypress/webpack-preprocessor');
const { addPlugin } = require('@appactions/cypress/plugin');

module.exports = on => {
    const options = webpack.defaultOptions;

    on('file:preprocessor', webpack(options));

    addPlugin(on);
};
