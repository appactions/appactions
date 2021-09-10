const faker = require('faker');
const { addPlugin } = require('cypress-app-actions/src/cypress/plugin');

module.exports = on => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push('--auto-open-devtools-for-tabs');
        }
        return launchOptions;
    });

    on('task', {
        freshUser() {
            return {
                email: `regular_${faker.random.number()}@miklos.dev`,
                password: faker.internet.password(),
            };
        },
        freshRestaurant() {
            return {
                name: faker.company.companyName(),
            };
        },
    });

    addPlugin(on);
};
