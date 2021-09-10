const path = require('path');

module.exports.addPlugin = on => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.extensions.push(path.resolve('../browser-extension/build'));
            return launchOptions;
        }
    });
};

// TODO this file needs to be cjs, because it will be running in Node; transpile this maybe?
