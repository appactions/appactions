import Link from 'next/link';
import { useQuery } from 'react-query';
import { StarList } from 'components/stars';
import DeleteAction from 'components/delete-action';
import Toggle from 'components/toggle';
import useRole from 'utils/use-role';
import { Alert, Loading } from 'components/message';
import { useRouter } from 'next/router';

const getRestaurant = async id => {
    return fetch(`/api/restaurant/${id}`).then(res => res.json());
};

function ReviewCard({ review, restaurantId, reviewIndex, restaurantOwner }) {
    const { isAdmin, isOwnerOfThis } = useRole({ restaurantOwner });
    return (
        <li className="relative pb-4">
            <div className="relative flex space-x-3">
                <div className="text-yellow-300">
                    <StarList value={review.stars} />
                </div>
                <div className="flex justify-between flex-1 min-w-0 pt-1.5 space-x-4">
                    <div>
                        <p className="text-sm text-gray-800">{review.text}</p>
                    </div>
                    <div className="flex items-stretch text-sm text-right text-gray-500 whitespace-nowrap">
                        <time dateTime={review.createdAt}>
                            {new Date(review.createdAt).toLocaleDateString('en-US')}
                        </time>

                        {isOwnerOfThis || isAdmin ? (
                            <Toggle
                                button={toggle => (
                                    <button
                                        onClick={toggle}
                                        className="ml-2 text-gray-500 cursor-pointer hover:text-gray-600"
                                    >
                                        <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                )}
                            >
                                <div
                                    className="absolute right-0 w-32 py-1 mt-2 bg-white shadow-lg origin-top-right rounded-md ring-1 ring-black ring-opacity-5"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                                >
                                    {isAdmin ? (
                                        <DeleteAction
                                            config={{
                                                url: `/api/restaurant/${restaurantId}/review/${reviewIndex}`,
                                                invalidateQueries: ['restaurant', restaurantId],
                                            }}
                                        >
                                            <button
                                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Delete review
                                            </button>
                                        </DeleteAction>
                                    ) : null}
                                    <DeleteAction
                                        config={{
                                            url: `/api/restaurant/${restaurantId}/review/${reviewIndex}/reply`,
                                            invalidateQueries: ['restaurant', restaurantId],
                                        }}
                                    >
                                        <button
                                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Delete reply
                                        </button>
                                    </DeleteAction>
                                </div>
                            </Toggle>
                        ) : null}
                    </div>
                </div>
            </div>
            {review.text ? (
                <div className="my-2 mr-8 ml-28">
                    {review.replyText ? (
                        <div className="py-2 pl-2 mb-1 border-l-4 border-gray-100">
                            <h3 className="mb-1 text-sm text-gray-500">Reply by the owner:</h3>
                            <p className="text-gray-800">{review.replyText}</p>
                        </div>
                    ) : null}

                    {isOwnerOfThis ? (
                        <Link
                            href={{
                                pathname: '/restaurant/[restaurantId]/review/[reviewIndex]',
                                query: { restaurantId, reviewIndex },
                            }}
                        >
                            <a className="text-sm text-indigo-500 hover:text-indigo-600">
                                {review.replyText ? 'Edit reply' : 'Reply'}
                            </a>
                        </Link>
                    ) : null}
                </div>
            ) : null}
        </li>
    );
}

export default function Restaurant() {
    const {
        query: { restaurantId },
    } = useRouter();
    const { isLoading, error, data } = useQuery(['restaurant', restaurantId], () => getRestaurant(restaurantId));
    const { isOwnerOfThis, isAdmin } = useRole({ restaurantOwner: data && data.owner });

    if (isLoading) return <Loading />;

    if (error) return <Alert text="Network error">{error.message}</Alert>;

    if (data.error) {
        return <Alert text={data.error} />;
    }

    return (
        <div className="rounded shadow">
            <div className="px-4 pt-5 bg-white sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h3 className="text-3xl font-extrabold text-center text-gray-900 truncate">{data.name}</h3>
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                        {isOwnerOfThis || isAdmin ? (
                            <DeleteAction
                                config={{
                                    url: `/api/restaurant/${restaurantId}`,
                                    goto: '/',
                                    invalidateQueries: 'restaurants',
                                }}
                            >
                                <button className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Delete restaurant
                                </button>
                            </DeleteAction>
                        ) : (
                            <Link
                                href={{
                                    pathname: '/restaurant/[restaurantId]/review',
                                    query: { restaurantId },
                                }}
                            >
                                <button className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white bg-gradient-to-r to-yellow-400 via-yellow-500 from-yellow-500 rounded-md shadow-sm hover:via-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
                                    Write a review
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="pt-3 mt-8">
                    <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
                        <h3 className="mt-2 ml-2 text-lg font-bold text-gray-900 leading-6">Review summary</h3>
                    </div>
                    <div>
                        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="overflow-hidden bg-white rounded-lg shadow">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Avarage rating</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {data.avgRating ? (
                                            data.avgRating.toFixed(2)
                                        ) : (
                                            <span className="font-extrabold font-4xl">-</span>
                                        )}
                                    </dd>
                                </div>
                            </div>
                            <div className="overflow-hidden bg-white rounded-lg shadow">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Best review</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {data.bestReview ? (
                                            <StarList value={data.bestReview.stars} />
                                        ) : (
                                            <span className="font-extrabold font-4xl">-</span>
                                        )}
                                    </dd>
                                </div>
                            </div>
                            <div className="overflow-hidden bg-white rounded-lg shadow">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Worst review</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {data.worstReview ? (
                                            <StarList value={data.worstReview.stars} />
                                        ) : (
                                            <span className="font-extrabold font-4xl">-</span>
                                        )}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="pt-3 mt-8">
                    <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
                        <h3 className="mt-2 ml-2 text-lg font-bold text-gray-900 leading-6">Reviews</h3>
                    </div>

                    <ul className="mt-8 flow-root">
                        {data.reviews && data.reviews.length ? (
                            data.reviews.map((review, index) => {
                                if (!review) return null; // deleted
                                return (
                                    <ReviewCard
                                        key={index}
                                        review={review}
                                        restaurantId={restaurantId}
                                        reviewIndex={index}
                                        restaurantOwner={data.owner}
                                    />
                                );
                            })
                        ) : (
                            <p className="mb-4 text-gray-500">No reviews yet.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
