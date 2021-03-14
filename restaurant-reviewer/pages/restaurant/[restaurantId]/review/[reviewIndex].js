import protect from 'utils/protect';
import Textarea from 'components/textarea';
import useForm from 'utils/use-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { StarList } from 'components/stars';
import { Alert, Loading } from 'components/message';

function ReviewResponse() {
    const {
        query: { restaurantId, reviewIndex },
    } = useRouter();
    const { isLoading, error, data } = useQuery(['restaurant', restaurantId], () => {
        return fetch(`/api/restaurant/${restaurantId}`).then(res => res.json());
    });

    const { register, handleSubmit, errors, isSubmitting } = useForm();

    if (isLoading) return <Loading />;

    if (error) return <Alert text="Network error">{error.message}</Alert>;

    const replyingTo = data.reviews[reviewIndex];

    return (
        <>
            <h1 className="mb-6 text-3xl font-extrabold text-gray-900">Post a reply</h1>
            <form
                onSubmit={handleSubmit({
                    method: 'post',
                    url: `/api/restaurant/${restaurantId}/review/${reviewIndex}`,
                    goto: `/restaurant/${restaurantId}`,
                    invalidateQueries: ['restaurant', restaurantId],
                })}
            >
                <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-12">
                                <div className="relative pb-8">
                                    <div className="relative flex space-x-3">
                                        <div className="text-yellow-300">
                                            <StarList value={replyingTo.stars} />
                                        </div>
                                        <div className="flex justify-between flex-1 min-w-0 pt-1.5 space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">{replyingTo.text}</p>
                                            </div>
                                            <div className="text-sm text-right text-gray-500 whitespace-nowrap">
                                                <time dateTime={replyingTo.createdAt}>
                                                    {new Date(replyingTo.createdAt).toLocaleDateString('en-US')}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <Textarea
                                    name="text"
                                    label="Reply"
                                    ref={register}
                                    error={errors.text}
                                    defaultValue={replyingTo.replyText}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white bg-gradient-to-r to-green-400 via-green-500 from-green-500 rounded-md shadow-sm hover:via-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                            disabled={isSubmitting}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default protect(ReviewResponse);
