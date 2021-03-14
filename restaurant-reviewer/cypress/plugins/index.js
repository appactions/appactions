const faker = require('faker');

require('dotenv').config();

module.exports = (on, config) => {
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

    config.env.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
    config.env.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
    config.env.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

    return config;
};
