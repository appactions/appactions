const { App } = require('@aws-cdk/core');
const { CdkStack } = require('./cdk-stack');

const app = new App();
new CdkStack(app, 'CdkStack');
