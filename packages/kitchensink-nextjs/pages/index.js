import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Link from 'next/link';
import Image from 'next/image';
import { StarList, StarInput } from 'components/stars';
import { Alert, Message, Loading } from 'components/message';
import useRole from 'utils/use-role';
import { getSession } from 'next-auth/client';

const getRestaurants = async stars => {
    return fetch(`/api/restaurants?stars=${stars}`).then(res => res.json());
};

function RestaurantCard({ restaurant }) {
    const { id, owner, name, coverPhoto, avgReviews, reviewsWithoutReply } = restaurant;
    const { isOwnerOfThis } = useRole({ restaurantOwner: owner });

    return (
        <li key={id} className="overflow-hidden bg-white rounded-lg shadow-md col-span-1">
            <Link
                href={{
                    pathname: '/restaurant/[restaurantId]',
                    query: { restaurantId: id },
                }}
            >
                <a className="relative flex w-full h-52">
                    <Image
                        className="self-center"
                        objectFit={'cover'}
                        layout="fill"
                        src={`/${coverPhoto}`}
                        alt={`Cover photo of ${name}`}
                    />
                    <div className="backdrop"></div>
                    <div className="absolute bottom-0 left-0 z-10 p-4 text-white">
                        <h2 className="text-3xl font-extrabold">{name}</h2>
                        <StarList value={avgReviews} />
                    </div>
                    {isOwnerOfThis && reviewsWithoutReply ? (
                        <span className="absolute top-0 right-0 inline-flex items-center px-3 m-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full py-0.5">
                            {reviewsWithoutReply > 1
                                ? `${reviewsWithoutReply} new reviews`
                                : `${reviewsWithoutReply} new review`}
                        </span>
                    ) : null}
                </a>
            </Link>
        </li>
    );
}

export default function Home() {
    const [stars, setStars] = useState(1);
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery(['restaurants', stars], () => getRestaurants(stars));

    useEffect(() => {
        Array(5)
            .fill()
            .map((_, index) => {
                queryClient.prefetchQuery(['restaurants', index + 1], () => getRestaurants(index + 1));
            });
    }, []);

    if (isLoading) return <Loading />;

    if (error) return <Alert text="Network error">{error.message}</Alert>;

    return (
        <>
            <div className="flex flex-row mb-6 text-gray-700">
                <span className="self-center mr-8 md:text-xl text-md text-bold trailing">Filter</span>
                <StarInput initialValue={5} onChange={stars => setStars(stars)} />
            </div>
            {data.length ? (
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {data.map(restaurant => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </ul>
            ) : (
                <Message text="Could not find any restaurants." />
            )}
        </>
    );
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });

    return { props: { session } };
}
