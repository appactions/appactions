import Logo from 'components/logo';
import Link from 'next/link';

function Header() {
    return (
        <div className="relative bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
                <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/">
                            <a className="block p-2 w-52 text-brand-green">
                                <span className="sr-only">Workflow</span>
                                <Logo />
                            </a>
                        </Link>
                    </div>
                    {/* <div className="-my-2 -mr-2 md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open menu</span>
                        </button>
                    </div> */}
                    <nav className="hidden lg:flex space-x-10">
                        <Link href="/#what">
                            <a className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green">
                                What
                            </a>
                        </Link>
                        <Link href="/#how">
                            <a className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green">
                                How
                            </a>
                        </Link>
                        <Link href="/#about">
                            <a className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green">
                                About
                            </a>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Header;
