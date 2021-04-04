function SignUp({ label = 'Join wait list' }) {
    return (
        <form action="#" className="sm:max-w-xl sm:mx-auto lg:mx-0">
            <div className="sm:flex">
                <div className="flex-1 min-w-0">
                    <label htmlFor="email" className="sr-only">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="block w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-gray-900"
                        data-cta="cta-input"
                    />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                        type="submit"
                        className="block w-full px-4 py-3 font-medium text-white bg-teal-500 shadow rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-gray-900"
                    >
                        {label}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SignUp;
