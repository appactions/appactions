const faker = require('faker');
const { addPlugin } = require('cypress-app-actions/src/cypress/plugin');

module.exports = on => {
    addPlugin(on);

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
};
