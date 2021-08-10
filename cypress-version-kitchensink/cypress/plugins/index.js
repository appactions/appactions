const { execSync } = require('child_process');
const { getClientEnvironment } = require('../../config/env');
const { onPreprocess } = require('cypress-shared-webpack');

const env = getClientEnvironment();

if (env.stringified['process.env'].NODE_ENV !== '"test"') {
    throw new Error('Cypress loader must have ENV set to "test"');
}

module.exports = on => {
    on('file:preprocessor', onPreprocess());

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push('--auto-open-devtools-for-tabs');
        }
        return launchOptions;
    });

    on('task', {
        resetBackendState() {
            // TODO
        },
    });
};
