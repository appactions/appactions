import Status from 'http-status-codes';
import endpoint, { withStatus } from 'utils/endpoint';

export default endpoint({
    async GET(db, req, res) {
        const { Item } = await db.restaurants.get({
            Key: {
                id: req.query.restaurantId,
            },
        });

        if (!Item) {
            return withStatus(Status.NOT_FOUND, { error: 'There is no restaurant with this id.' });
        }

        const reviews = (Item.reviews || []).filter(Boolean);

        let avgRating = null;
        if (reviews.length) {
            avgRating = reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length;
        }

        const worstReview = reviews.reduce((worst, curr) => {
            if (curr.stars < 4) {
                if (!worst) {
                    return curr;
                }
                if (worst.stars > curr.stars) {
                    return curr;
                } else if (worst.stars === curr.stars && curr.createdAt > worst.createdAt) {
                    return curr;
                }
            }
            return worst;
        }, null);

        const bestReview = reviews.reduce((best, curr) => {
            if (curr.stars >= 4) {
                if (!best) {
                    return curr;
                }
                if (best.stars < curr.stars) {
                    return curr;
                } else if (best.stars === curr.stars && curr.createdAt > best.createdAt) {
                    return curr;
                }
            }
            return best;
        }, null);

        return { ...Item, avgRating, worstReview, bestReview };
    },
    async DELETE(db, req, res) {
        return db.restaurants.delete({
            Key: {
                id: req.query.restaurantId,
            },
        });
    },
});
