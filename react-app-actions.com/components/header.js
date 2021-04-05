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
                            <a className="block p-2 border-4 shadow w-52 text-brand-green border-brand-green">
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
                    <nav className="hidden md:flex space-x-10">
                        <a
                            href="#vision"
                            onClick={smootScroll}
                            className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green"
                        >
                            Vision
                        </a>
                        <a
                            href="#how-does-it-work"
                            onClick={smootScroll}
                            className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green"
                        >
                            How does it work
                        </a>
                        <a
                            href="#benefits"
                            onClick={smootScroll}
                            className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green"
                        >
                            Benefits
                        </a>
                        <Link href="/about">
                            <a className="text-xl font-medium text-gray-500 border-b-4 border-transparent hover:text-brand-green hover:border-brand-green">
                                About
                            </a>
                        </Link>
                    </nav>
                    <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
                        <button
                            onClick={onClickCTA}
                            className="block px-4 py-3 font-medium border-4 shadow border-brand-green text-brand-green hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300"
                        >
                            Request access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
