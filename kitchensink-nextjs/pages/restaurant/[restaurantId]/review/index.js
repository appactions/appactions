import protect from 'utils/protect';
import Textarea from 'components/textarea';
import { StarInput } from 'components/stars';
import useForm from 'utils/use-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Alert, Loading } from 'components/message';

function Review() {
    const {
        query: { restaurantId },
    } = useRouter();
    const { isLoading, error, data } = useQuery(['restaurant', restaurantId], () => {
        return fetch(`/api/restaurant/${restaurantId}`).then(res => res.json());
    });

    const { register, handleSubmit, errors, isSubmitting } = useForm();

    if (isLoading) return <Loading />;

    if (error) return <Alert text="Network error">{error.message}</Alert>;

    return (
        <>
            <h1 className="mb-6 text-3xl font-extrabold text-gray-900">
                Leave a review for <span className="italic">{data.name}</span>
            </h1>
            <form
                onSubmit={handleSubmit({
                    method: 'post',
                    url: `/api/restaurant/${restaurantId}/review`,
                    goto: `/restaurant/${restaurantId}`,
                    invalidateQueries: ['restaurant', restaurantId],
                })}
            >
                <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="text-yellow-300 col-span-6">
                                <StarInput label="Rating" name="stars" register={register} error={errors.stars} />
                            </div>
                            <div className="col-span-12">
                                <Textarea name="text" label="Comment" ref={register} error={errors.text} />
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white bg-gradient-to-r to-yellow-400 via-yellow-500 from-yellow-500 rounded-md shadow-sm hover:via-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                            disabled={isSubmitting}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default protect(Review);
