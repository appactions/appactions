const { addPlugin } = require('@appactions/core/plugin');
const preprocessor = require('@appactions/core/preprocessor');

module.exports = on => {
    addPlugin(on);
    on('file:preprocessor', preprocessor());
};