import { getCsrfToken } from 'next-auth/client';

export default function SignIn({ csrfToken }) {
    return (
        <div className="flex flex-col justify-center max-w-md">
            <form
                method="post"
                action="/api/auth/callback/credentials"
                className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10"
            >
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <label className="block text-sm font-medium text-gray-700">
                    Email
                    <input
                        name="email"
                        type="email"
                        className="block w-full px-3 py-2 my-4 placeholder-gray-400 border border-gray-300 appearance-none rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </label>
                <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign in
                </button>
            </form>
        </div>
    );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}
