const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');

module.exports = on => {
    const options = webpack.defaultOptions;

    on('file:preprocessor', webpack(options));

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push('--auto-open-devtools-for-tabs');
        }
        return launchOptions;
    });
};
