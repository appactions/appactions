export default function Home() {
    return (
        <>
            <div className="pt-10 bg-gray-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                            <div className="lg:py-24">
                                {/* <a
                                    href="#"
                                    className="inline-flex items-center text-white bg-black rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                                >
                                    <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full">
                                        We're hiring
                                    </span>
                                    <span className="ml-4 text-sm">Visit our careers page</span>
                                    <svg
                                        className="ml-2 w-5 h-5 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a> */}
                                <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                    <span className="block">A better way to</span>
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 block">
                                        test web apps
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                    We are currently in closed beta. Subscribe to our newsletter for early access.
                                </p>
                                <div className="mt-10 sm:mt-12">
                                    {/* <form action="#" className="sm:max-w-xl sm:mx-auto lg:mx-0">
                                        <div className="sm:flex">
                                            <div className="min-w-0 flex-1">
                                                <label htmlFor="email" className="sr-only">
                                                    Email address
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                                                />
                                            </div>
                                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                                <button
                                                    type="submit"
                                                    className="block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                                                >
                                                    Start free trial
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-300 sm:mt-4">
                                            Start your free 14-day trial, no credit card necessary. By providing your
                                            email, you agree to our{' '}
                                            <a href="#" className="font-medium text-white">
                                                terms or service
                                            </a>
                                            .
                                        </p>
                                    </form> */}
                                    <form
                                        action="https://reactappactions.substack.com/api/v1/free?nojs=true"
                                        method="post"
                                        className="sm:max-w-xl sm:mx-auto lg:mx-0"
                                        noValidate
                                    >
                                        <div className="sm:flex">
                                            <div className="min-w-0 flex-1">
                                                <label htmlFor="email" className="sr-only">
                                                    Email address
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    className="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                                                    placeholder="Type your email"
                                                />
                                            </div>
                                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                                <button
                                                    type="submit"
                                                    className="block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                                                    tabIndex="0"
                                                >
                                                    Subscribe
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
                                <img
                                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/img/cloud-illustration-teal-cyan.svg"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Feature section with screenshot */}
            {/* <div className="relative bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
                <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
                    <div>
                        <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">Serverless</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                            No server? No problem.
                        </p>
                        <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                            Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc,
                            ullamcorper malesuada. Eleifend condimentum id viverra nulla.
                        </p>
                    </div>
                    <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
                        <img
                            className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                            src="https://tailwindui.com/img/component-images/green-project-app-screenshot.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </div> */}
            {/* Feature section with grid */}
            <div className="relative bg-white py-16 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                    <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">Develop faster</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                        Radically different testing experience
                    </p>
                    <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                        Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc,
                        ullamcorper malesuada. Eleifend condimentum id viverra nulla.
                    </p>
                    <div className="mt-12">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                                                {/* Heroicon name: cloud-upload */}
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            Effortless
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit
                                            morbi lobortis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                                                {/* Heroicon name: lock-closed */}
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            Stable
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit
                                            morbi lobortis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                                                {/* Heroicon name: refresh */}
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            Blazing fast
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit
                                            morbi lobortis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                                                {/* Heroicon name: shield-check */}
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            Future proof
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit
                                            morbi lobortis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                                                {/* Heroicon name: cog */}
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            Extendable
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit
                                            morbi lobortis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                                                {/* Heroicon name: server */}
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            Powerful reporter
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit
                                            morbi lobortis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Testimonial section */}
            <div className="pb-16 bg-gradient-to-r from-teal-500 to-cyan-600 lg:pb-0 lg:z-10 lg:relative">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="relative lg:-my-8">
                        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-white lg:hidden" />
                        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:p-0 lg:h-full">
                            <div className="aspect-w-10 aspect-h-6 rounded-xl shadow-xl overflow-hidden sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none lg:h-full">
                                <img className="object-cover lg:h-full lg:w-full" src="/img/jazzware-ceo.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 lg:m-0 lg:col-span-2 lg:pl-8">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none">
                            <blockquote>
                                <div>
                                    <svg
                                        className="h-12 w-12 text-white opacity-25"
                                        fill="currentColor"
                                        viewBox="0 0 32 32"
                                        aria-hidden="true"
                                    >
                                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                    </svg>
                                    <p className="mt-6 text-2xl font-medium text-white">Dope stuff!</p>
                                </div>
                                <footer className="mt-6">
                                    <p className="text-base font-medium text-white">Daniel Gulyas</p>
                                    <p className="text-base font-medium text-cyan-100">CEO at JazzWare</p>
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
            {/* Blog section */}
            <div className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
                <div className="relative">
                    <div className="text-center mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                        <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">Learn</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                            Helpful Resources
                        </p>
                        <p className="mt-5 mx-auto max-w-prose text-xl text-gray-500">
                            Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc,
                            ullamcorper malesuada. Eleifend condimentum id viverra nulla.
                        </p>
                    </div>
                    <div className="mt-12 mx-auto max-w-md px-4 grid gap-8 sm:max-w-lg sm:px-6 lg:px-8 lg:grid-cols-3 lg:max-w-7xl">
                        <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-48 w-full object-cover"
                                    src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                    alt=""
                                />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-cyan-600">
                                        <a href="#" className="hover:underline">
                                            Article
                                        </a>
                                    </p>
                                    <a href="#" className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">
                                            Boost your conversion rate
                                        </p>
                                        <p className="mt-3 text-base text-gray-500">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
                                            accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos
                                            quis dolorum.
                                        </p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <a href="#">
                                            <span className="sr-only">Roel Aufderehar</span>
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            <a href="#" className="hover:underline">
                                                Roel Aufderehar
                                            </a>
                                        </p>
                                        <div className="flex space-x-1 text-sm text-gray-500">
                                            <time dateTime="2020-03-16">Mar 16, 2020</time>
                                            <span aria-hidden="true">·</span>
                                            <span>6 min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-48 w-full object-cover"
                                    src="https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                    alt=""
                                />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-cyan-600">
                                        <a href="#" className="hover:underline">
                                            Video
                                        </a>
                                    </p>
                                    <a href="#" className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">
                                            How to use search engine optimization to drive sales
                                        </p>
                                        <p className="mt-3 text-base text-gray-500">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit facilis
                                            asperiores porro quaerat doloribus, eveniet dolore. Adipisci tempora aut
                                            inventore optio animi., tempore temporibus quo laudantium.
                                        </p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <a href="#">
                                            <span className="sr-only">Brenna Goyette</span>
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            <a href="#" className="hover:underline">
                                                Brenna Goyette
                                            </a>
                                        </p>
                                        <div className="flex space-x-1 text-sm text-gray-500">
                                            <time dateTime="2020-03-10">Mar 10, 2020</time>
                                            <span aria-hidden="true">·</span>
                                            <span>4 min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-48 w-full object-cover"
                                    src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                    alt=""
                                />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-cyan-600">
                                        <a href="#" className="hover:underline">
                                            Case Study
                                        </a>
                                    </p>
                                    <a href="#" className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">
                                            Improve your customer experience
                                        </p>
                                        <p className="mt-3 text-base text-gray-500">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum
                                            voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi
                                            cumque corporis perferendis hic.
                                        </p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <a href="#">
                                            <span className="sr-only">Daniela Metz</span>
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            <a href="#" className="hover:underline">
                                                Daniela Metz
                                            </a>
                                        </p>
                                        <div className="flex space-x-1 text-sm text-gray-500">
                                            <time dateTime="2020-02-12">Feb 12, 2020</time>
                                            <span aria-hidden="true">·</span>
                                            <span>11 min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* CTA Section */}
            <div className="relative bg-gray-900">
                <div className="relative h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
                    <img
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&sat=-100"
                        alt=""
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600"
                        style={{ mixBlendMode: 'multiply' }}
                    />
                </div>
                <div className="relative mx-auto max-w-md px-4 py-12 sm:max-w-7xl sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32">
                    <div className="md:ml-auto md:w-1/2 md:pl-10">
                        <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
                            Can we make your engineering team twice as productive?
                        </h2>
                        <p className="mt-2 text-white text-3xl font-extrabold tracking-tight sm:text-4xl">
                            We’re happy to talk to you
                        </p>
                        <p className="mt-3 text-lg text-gray-300">
                            Working on large apps is difficult. Your team might ship great features, but struggle with
                            regressions. We beleive React App Action will transform your business.
                        </p>
                        <div className="mt-8">
                            <div className="inline-flex rounded-md shadow">
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
                                >
                                    Visit the help center
                                    {/* Heroicon name: external-link */}
                                    <svg
                                        className="-mr-1 ml-3 h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
