import * as uuid from 'uuid';
import endpoint from 'utils/endpoint';

export default endpoint({
    async GET(db, req, res) {
        const { Items } = await db.restaurants.scan({
            ExpressionAttributeNames: {
                '#name': 'name',
                '#owner': 'owner',
            },
            Select: 'SPECIFIC_ATTRIBUTES',
            ProjectionExpression: 'id, #name, coverPhoto, reviews, #owner',
        });
        const starFilters = req.query.stars || 0;
        return Items.map(item => {
            const reviews = (item.reviews || []).filter(Boolean);
            let avgReviews = 0;
            if (reviews.length) {
                avgReviews = reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length;
            }
            const reviewsWithoutReply = reviews.filter(review => review.text && !review.replyText).length;
            return {
                ...item,
                avgReviews,
                reviewsWithoutReply,
            };
        })
            .filter(item => {
                if (starFilters <= 1) {
                    return true;
                }
                return item.avgReviews > starFilters - 1;
            })
            .sort((a, b) => {
                return b.avgReviews - a.avgReviews;
            });
    },
    async PUT(db, req, res) {
        const item = {
            id: uuid.v4(),
            owner: db.session.user.id,
            name: req.body.name,
            coverPhoto: req.body.coverPhoto,
            createdAt: Date.now(),
            reviews: [],
        };

        await db.restaurants.put({
            Item: item,
        });

        return item;
    },
});
