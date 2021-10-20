import Input from 'components/input';
import ImagePicker from 'components/image-picker';
import useForm from 'utils/use-form';
import protect from 'utils/protect';

function AddNewRestaurant() {
    const { register, handleSubmit, errors, isSubmitting } = useForm();
    return (
        <form
            onSubmit={handleSubmit({
                method: 'put',
                url: '/api/restaurants',
                goto: '/',
                invalidateQueries: 'restaurants',
            })}
        >
            <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <Input
                                type="text"
                                name="name"
                                label="Restaurant name"
                                ref={register({ required: 'Restaurant name is required.' })}
                                error={errors.name}
                            />
                        </div>
                        <div className="col-span-6">
                            <ImagePicker
                                label="Select a cover photo"
                                images={['imgs/01.jpg', 'imgs/02.jpg', 'imgs/03.jpg', 'imgs/04.jpg']}
                                register={register}
                                error={errors.coverPhoto}
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
                        Create
                    </button>
                </div>
            </div>
        </form>
    );
}

export default protect(AddNewRestaurant);
