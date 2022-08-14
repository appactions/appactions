const { defineConfig } = require('cypress');
const { addPlugin } = require('@appactions/core/plugin');
const preprocessor = require('@appactions/core/preprocessor');

module.exports = defineConfig({
    viewportHeight: 1500,
    e2e: {
        specPattern: 'flows/**/*.{yml,yaml}',
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            addPlugin(on);
            on('file:preprocessor', preprocessor());
        },
    },
});
