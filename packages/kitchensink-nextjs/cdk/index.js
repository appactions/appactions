const { App } = require('@aws-cdk/core');
const { DBStack } = require('./db-stack');

const app = new App();

const stackName = `RestaurantReviewer-DBStack-${process.env.STAGE}`;
new DBStack(app, stackName);
