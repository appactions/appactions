const { addPlugin } = require('@appactions/cypress/plugin');
const preprocessor = require('@appactions/cypress/preprocessor');

module.exports = on => {
    addPlugin(on);
    on('file:preprocessor', preprocessor());
};
