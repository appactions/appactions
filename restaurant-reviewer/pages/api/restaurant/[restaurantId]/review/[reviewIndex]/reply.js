import endpoint from 'utils/endpoint';

export default endpoint({
    async DELETE(db, req) {
        return db.restaurants.update({
            Key: { id: req.query.restaurantId },
            ConditionExpression: 'id = :id',
            ReturnValues: 'ALL_NEW',
            UpdateExpression: `set #reviews[${req.query.reviewIndex}].replyText = :null`,
            ExpressionAttributeNames: {
                '#reviews': 'reviews',
            },
            ExpressionAttributeValues: {
                ':id': req.query.restaurantId,
                ':replyText': req.body.text,
                ':null': null,
            },
        });
    },
});
