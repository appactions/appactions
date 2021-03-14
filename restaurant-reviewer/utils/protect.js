import { signIn } from 'next-auth/client';
import useSession from 'utils/use-session';

function protect(Component) {
    function Protected(props) {
        const session = useSession();

        if (!session) {
            return (
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 leading-6">Authentication required</h3>
                        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                            <div className="max-w-xl text-sm text-gray-500">
                                <p>To access this page, you need to sign in.</p>
                            </div>
                            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                                <button
                                    type="button"
                                    onClick={() => signIn(process.env.NEXT_PUBLIC_SPECIAL_AUTH)}
                                    className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white bg-gradient-to-r to-green-400 via-green-500 from-green-500 rounded-md shadow-sm hover:via-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    }

    Protected.displayName = `Protected(${Component.displayName || Component.name || 'Component'})`;

    return Protected;
}

export default protect;
