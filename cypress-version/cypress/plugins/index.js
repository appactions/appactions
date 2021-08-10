const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');

module.exports = on => {
    const options = webpack.defaultOptions;

    // use the one in the source, not the copy in node_modules
    options.webpackOptions.resolve = {
        alias: {
            'react-app-actions$': path.resolve('../react-app-actions'),
        },
    };

    on('file:preprocessor', webpack(options));

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push('--auto-open-devtools-for-tabs');
        }
        return launchOptions;
    });
};
