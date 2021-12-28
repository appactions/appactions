import Link from 'next/link';
import Toggle from './toggle';
import Logo from './logo';
import useSession from 'utils/use-session';
import { signIn, signOut } from 'next-auth/client';
import useRole from 'utils/use-role';
import { createDriver } from 'cypress-app-actions/driver';

export default function Header() {
    const session = useSession();
    const { isOwner } = useRole();
    return (
        <header className="bg-white shadow">
            <div className="container px-2 mx-auto sm:px-4 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex px-2 lg:px-0">
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/">
                                <a>
                                    <Logo />
                                </a>
                            </Link>
                        </div>
                        <nav aria-label="Global" className="flex items-center ml-6 space-x-4">
                            <Link href="/">
                                <a className="px-3 py-2 text-sm font-medium text-gray-900">Dashboard</a>
                            </Link>
                            {isOwner ? (
                                <Link href="/add-new-restaurant">
                                    <a className="px-3 py-2 text-sm font-medium text-gray-900">Add new restaurant</a>
                                </Link>
                            ) : null}
                        </nav>
                    </div>
                    <div className="flex items-center ml-4">
                        <div className="relative flex-shrink-0 ml-4">
                            {session ? (
                                <Toggle
                                    button={toggle => (
                                        <button
                                            type="button"
                                            className="flex mr-2 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            id="user-menu"
                                            aria-haspopup="true"
                                            onClick={toggle}
                                        >
                                            <img
                                                className="w-8 h-8 rounded-full"
                                                src={session.user.image || '/default_avatar.jpg'}
                                                alt="Profile picture"
                                            />
                                        </button>
                                    )}
                                >
                                    <div
                                        className="absolute right-0 w-48 py-1 mt-2 bg-white shadow-lg origin-top-right rounded-md ring-1 ring-black ring-opacity-5"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <span className="block px-4 py-2 text-sm text-gray-400">
                                            {session.user.email}
                                        </span>
                                        <button
                                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                signOut({
                                                    callbackUrl: `/auth/logout`,
                                                })
                                            }
                                            role="menuitem"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </Toggle>
                            ) : (
                                <button
                                    onClick={() => signIn(process.env.NEXT_PUBLIC_TEST_MODE ? 'TestLogin' : 'auth0')}
                                    className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white bg-gradient-to-r to-green-400 via-green-500 from-green-500 rounded-md shadow-sm hover:via-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

createDriver('button', {
    pattern: 'Button',
});
