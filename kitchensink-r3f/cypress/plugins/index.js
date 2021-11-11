const { addPlugin } = require('cypress-app-actions/dist/cypress/plugin');

module.exports = on => {
    addPlugin(on);
};
