import Status from 'http-status-codes';
import endpoint, { withStatus } from 'utils/endpoint';

export default endpoint({
    async GET(db, req, res) {
        const { Item } = await db.users.get({
            Key: {
                id: db.session.user.id,
            },
        });

        return Item;
    },
    async POST(db, req) {
        try {
            return await db.users.update({
                Key: { id: db.session.user.id },
                ReturnValues: 'ALL_NEW',
                UpdateExpression: 'set #role = :new_role',
                ConditionExpression: '#role = :onboarding',
                ExpressionAttributeNames: {
                    '#role': 'role',
                },
                ExpressionAttributeValues: {
                    ':onboarding': 'onboarding',
                    ':new_role': req.body.user_role,
                },
            });
        } catch (error) {
            if (error.code === 'ConditionalCheckFailedException') {
                return withStatus(Status.CONFLICT, {
                    error: 'Role has been already set',
                });
            }

            throw error;
        }
    },
});
