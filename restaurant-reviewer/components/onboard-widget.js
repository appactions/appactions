import useForm from 'utils/use-form';

export default function OnboardWidget({ onSuccess }) {
    const { register, handleSubmit, errors, isSubmitting } = useForm();

    return (
        <div className="flex flex-col justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                    Welcome to <span className="whitespace-nowrap">Restaurant Reviewer!</span>
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit({
                            method: 'post',
                            url: `/api/user/me`,
                            onSuccess,
                        })}
                    >
                        <div>
                            <span className="block mb-2 text-sm font-medium text-gray-700">
                                How are you going to use our app?
                            </span>
                            <div className="flex items-center">
                                <div className="flex items-center flex-grow">
                                    <span className="relative z-0 inline-flex w-full shadow-sm rounded-md">
                                        <input
                                            type="radio"
                                            name="user_role"
                                            value="normal_user"
                                            id="normal_user"
                                            ref={register({ required: 'Please choose the type that describes you.' })}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="normal_user"
                                            className="relative inline-flex items-center justify-between w-full py-2 pl-6 pr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-pointer rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <span>Restaurant goer</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="invisible w-10 h-10 text-green-500 after-checked:visible"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </label>
                                    </span>
                                </div>

                                <div className="flex items-center flex-grow">
                                    <span className="relative z-0 inline-flex w-full shadow-sm rounded-md">
                                        <input
                                            type="radio"
                                            name="user_role"
                                            value="owner_user"
                                            id="owner_user"
                                            ref={register({ required: 'Please choose the type that describes you.' })}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="owner_user"
                                            className="relative inline-flex items-center justify-between w-full py-2 pl-6 pr-4 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-pointer rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <span>Restaurant owner</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="invisible w-10 h-10 text-green-500 after-checked:visible"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </label>
                                    </span>
                                </div>
                            </div>
                            {errors.user_role ? (
                                <p className="mt-2 text-sm text-red-600">{errors.user_role.message}</p>
                            ) : null}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
