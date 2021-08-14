import aws from 'aws-sdk';
import Status from 'http-status-codes';
import { getSession } from 'next-auth/client';

const requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

function createDb(tableName) {
    const client = new aws.DynamoDB.DocumentClient({
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.APP_AWS_REGION,
        params: {
            TableName: tableName,
        },
    });

    return {
        get: params => client.get(params).promise(),
        put: params => client.put(params).promise(),
        query: params => client.query(params).promise(),
        update: params => client.update(params).promise(),
        delete: params => client.delete(params).promise(),
        scan: params => client.scan(params).promise(),
    };
}

const usersTable = createDb(process.env.DYNAMODB_USER_TABLE_NAME);
const restaurantsTable = createDb(process.env.DYNAMODB_RESTAURANT_TABLE_NAME);

export const db = {
    users: usersTable,
    restaurants: restaurantsTable,
};

export const getState = session => ({
    users: usersTable,
    restaurants: restaurantsTable,
    session,
});

export default function endpoint({ schemas = {}, ..._handlers }) {
    if (Object.keys(_handlers).some(method => !requestMethods.includes(method))) {
        throw new Error(`There is no method called "${method}"`);
    }

    const handlers = {
        ..._handlers,
        OPTIONS() {
            return res.status(Status.OK).end();
        },
    };

    const allowedMethods = Object.keys(handlers).join(', ');

    return async (req, res) => {
        res.setHeader('Access-Control-Allow-Methods', allowedMethods);

        if (req.method === 'GET') {
            const result = await handlers['GET'](getState(), req, res);
            if (result && result.__withStatus__) {
                return res.status(result.status).json(result.data);
            }

            return res.status(Status.OK).json(result);
        } else if (handlers[req.method]) {
            const session = await getSession({ req });

            if (!session) {
                return res.status(Status.UNAUTHORIZED).end();
            }

            if (schemas[req.method]) {
                const validation = schema.validate(req.body);
                if (validation.error) {
                    return res.status(Status.BAD_REQUEST).json({ error: validation.error });
                }
            }

            const result = await handlers[req.method](getState(session), req, res);

            if (result && result.__withStatus__) {
                return res.status(result.status).json(result.data);
            }

            return res.status(Status.OK).json(result);
        }

        return res.status(Status.BAD_REQUEST).end();
    };
}

export function withStatus(status, data) {
    return {
        status,
        data,
        __withStatus__: true,
    };
}
