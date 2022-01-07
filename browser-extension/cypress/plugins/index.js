const { addPlugin } = require('cypress-app-actions/plugin');
const preprocessor = require('cypress-app-actions/preprocessor');

module.exports = on => {
    addPlugin(on);
    on('file:preprocessor', preprocessor());
};
