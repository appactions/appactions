import endpoint from 'utils/endpoint';

export default endpoint({
    async POST(db, req, res) {
        const item = {
            text: req.body.text,
            stars: Number(req.body.stars),
            createdAt: Date.now(),
        };

        return await db.restaurants.update({
            Key: { id: req.query.restaurantId },
            ConditionExpression: 'id = :id',
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'set #reviews = list_append(if_not_exists(#reviews, :empty_list), :item)',
            ExpressionAttributeNames: {
                '#reviews': 'reviews',
            },
            ExpressionAttributeValues: {
                ':id': req.query.restaurantId,
                ':item': [item],
                ':empty_list': [],
            },
        });
    },
});
