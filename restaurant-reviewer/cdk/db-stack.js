const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');

class DBStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const restaurantsTable = new dynamodb.Table(this, 'Restaurants', {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        const usersTable = new dynamodb.Table(this, 'Users', {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        new cdk.CfnOutput(this, 'RestaurantTableName', {
            value: restaurantsTable.tableName,
        });

        new cdk.CfnOutput(this, 'UserTableName', {
            value: usersTable.tableName,
        });
    }
}

module.exports.DBStack = DBStack;