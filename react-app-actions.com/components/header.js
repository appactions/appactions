import Logo from 'components/logo';
import Link from 'next/link';

function Header() {
    const onClickCTA = event => {
        event.preventDefault();

        const cta = Array.from(document.querySelectorAll('[data-cta="cta-input"]')).slice(-1).pop();
        cta.scrollIntoView({ behavior: 'smooth' });
        // cta.focus();
    };
    const smootScroll = event => {
        const hash = event.target.getAttribute('href');
        const el = document.querySelector(hash);
        if (el) {
            event.preventDefault();
            el.scrollIntoView({ behavior: 'smooth' });
            history.replaceState({}, '', hash);
        }
    };
    return (
        <div className="relative bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
                <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/">
                            <a className="block w-40 text-brand-green">
                                <span className="sr-only">Workflow</span>
                                <Logo />
                            </a>
                        </Link>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open menu</span>
                        </button>
                    </div>
                    <nav className="hidden md:flex space-x-10">
                        <a
                            href="#vision"
                            onClick={smootScroll}
                            className="text-base font-medium text-gray-500 hover:text-gray-900"
                        >
                            Vision
                        </a>
                        <a
                            href="#how-does-it-work"
                            onClick={smootScroll}
                            className="text-base font-medium text-gray-500 hover:text-gray-900"
                        >
                            How does it work
                        </a>
                        <a
                            href="#benefits"
                            onClick={smootScroll}
                            className="text-base font-medium text-gray-500 hover:text-gray-900"
                        >
                            Benefits
                        </a>
                        {/* <Link href="/about">
                            <a className="text-base font-medium text-gray-500 hover:text-gray-900">About</a>
                        </Link> */}
                    </nav>
                    <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
                        <button
                            onClick={onClickCTA}
                            className="block px-4 py-3 font-medium text-white bg-teal-500 rounded-full shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 focus:ring-offset-gray-900"
                        >
                            Join waitlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
