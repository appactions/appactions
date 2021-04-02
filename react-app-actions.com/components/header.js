import Logo from 'components/logo';

function Header() {
    const onClickCTA = event => {
        event.preventDefault();

        const cta = document.querySelector('[data-cta="cta-input"]');
        cta.scrollIntoView({ behavior: 'smooth' });
        cta.focus();
    };
    return (
        <div className="relative bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
                <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <a href="#">
                            <span className="sr-only">Workflow</span>
                            <Logo />
                        </a>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open menu</span>
                        </button>
                    </div>
                    <nav className="hidden md:flex space-x-10">
                        <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            How does it work
                        </a>
                        <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            Session recording
                        </a>
                        <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            Features
                        </a>
                    </nav>
                    <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
                        <button
                            onClick={onClickCTA}
                            className="inline-flex items-center justify-center px-4 py-2 ml-8 text-base font-medium text-gray-900 border-4 rounded-full"
                        >
                            Join wait list
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
