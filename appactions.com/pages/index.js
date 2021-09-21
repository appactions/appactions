import SignUp from 'components/signup';
import Demo from 'components/demo';
import FloatElement from 'components/float-element';
import FadeInSection from 'components/fade-in-section';

export default function Home() {
    return (
        <>
            <section className="mt-16 mb-32 sm:mt-24">
                <div className="mx-auto max-w-7xl">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                            <div>
                                <h3 className="mt-8 font-sans text-lg font-bold tracking-widest text-black uppercase sm:mt-12 lg:mt-24">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        className="inline-block w-6 h-6 mb-1 mr-2"
                                        style={{ color: '#61dafb' }}
                                        height="1em"
                                        width="1em"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        fill="transparent"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <g
                                            transform="translate(.648 2.438) scale(.05696)"
                                            fill="none"
                                            fillRule="evenodd"
                                        >
                                            <circle r={50.167} cy={237.628} cx={269.529} fill="currentColor" />
                                            <g stroke="currentColor" strokeWidth={24}>
                                                <path d="M269.53 135.628c67.356 0 129.928 9.665 177.107 25.907 56.844 19.57 91.794 49.233 91.794 76.093 0 27.99-37.04 59.503-98.083 79.728-46.15 15.29-106.88 23.272-170.818 23.272-65.554 0-127.63-7.492-174.3-23.44C36.184 297.006.62 265.085.62 237.628c0-26.642 33.37-56.076 89.415-75.616 47.355-16.51 111.472-26.384 179.486-26.384z" />
                                                <path d="M180.736 186.922c33.65-58.348 73.28-107.724 110.92-140.48C337.006 6.976 380.163-8.48 403.43 4.937c24.248 13.983 33.042 61.814 20.067 124.796-9.8 47.618-33.234 104.212-65.176 159.6-32.75 56.788-70.25 106.82-107.377 139.272-46.98 41.068-92.4 55.93-116.185 42.213-23.08-13.3-31.906-56.92-20.834-115.233 9.355-49.27 32.832-109.745 66.8-168.664z" />
                                                <path d="M180.82 289.482c-33.745-58.282-56.72-117.287-66.31-166.255-11.544-59-3.382-104.11 19.864-117.566 24.224-14.024 70.055 2.244 118.14 44.94 36.356 32.28 73.688 80.837 105.723 136.173 32.844 56.733 57.46 114.21 67.036 162.582 12.117 61.213 2.31 107.984-21.453 121.74-23.057 13.348-65.25-.784-110.24-39.5-38.013-32.71-78.682-83.253-112.76-142.115z" />
                                            </g>
                                        </g>
                                    </svg>
                                    App Actions
                                </h3>
                                <h1 className="text-4xl font-extrabold tracking-tight sm:leading-none lg:text-5xl xl:text-6xl">
                                    <span className="md:block">
                                        Effortless E2E testing for <span className="text-brand-green">React</span>.
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-900 mb-28 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                    "Write" tests in a no-code browser extension. Store results in source control. Tests
                                    are entirely implementation details free. Update them only when UX changes.
                                </p>
                                <div className="mb-32 lg:hidden">
                                    <Demo />
                                </div>
                                <div className="mt-10 sm:mt-12">
                                    <p className="my-3 font-sans font-bold tracking-wider text-black uppercase text-md md:text-lg">
                                        SIGN UP TO HEAR AS SOON AS WE LAUNCH!
                                    </p>
                                    <SignUp light />
                                </div>
                                <FadeInSection>
                                    <div className="mt-32">
                                        <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                            High level
                                        </h2>
                                        <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                            <span className="text-brand-green">App Actions</span> is an abstraction on
                                            Selenium to test React apps. It frees you from dealing with the low-level
                                            API issues, so you can focus on creating great tests.
                                        </p>
                                    </div>
                                </FadeInSection>
                                <FadeInSection>
                                    <div className="my-32">
                                        <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                            Session-recording
                                        </h2>
                                        <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                            Perform the user behavior once; our browser extension generates the test.
                                            Just check in the resulting code in your version control system, and you are
                                            done!
                                        </p>
                                    </div>
                                </FadeInSection>
                                <FadeInSection>
                                    <div className="my-32">
                                        <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                            Pattern-based selection
                                        </h2>
                                        <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                            Selecting elements by CSS selectors is not just a pain, it makes tests go
                                            out of date pretty fast. Instead, App Actions select elements by patterns.
                                            Default patterns are WAI-ARIA roles, but you can define custom ones.
                                        </p>
                                    </div>
                                </FadeInSection>
                                <FadeInSection>
                                    <div className="my-32">
                                        <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                            Low maintenance
                                        </h2>
                                        <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                            App Actions tests are entirely free of implementation details. This way, you
                                            only have to touch a test next time when business logic changes. Because
                                            tests are defined in YAML format, editing them does not require programming
                                            skills.
                                        </p>
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                        <div className="hidden mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 lg:block">
                            <FloatElement unLockAt={1150}>
                                <Demo />
                            </FloatElement>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="relative px-4 pt-8 pb-16 mx-auto bg-white sm:pb-24 lg:pb-32 max-w-7xl lg:px-8"
                id="benefits"
            >
                <p className="font-sans text-lg font-bold tracking-widest text-black uppercase">Designed for scale</p>
                <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">Benefits</h2>
                <dl className="pt-10 mt-6 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-12">
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <path d="M3 17L9 11 13 15 21 7" />
                                    <path d="M14 7L21 7 21 14" />
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Fast</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Thanks to the under the hood optimization, test running performance will always be faster
                            than the same test written in plain Selenium.
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <path d="M4 21V8a3 3 0 013-3h10a3 3 0 013 3v6a3 3 0 01-3 3H8l-4 4" />
                                    <path d="M8 9L16 9" />
                                    <path d="M8 13L14 13" />
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Clear error messages
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            When a test fails, errors messages are always clarified. Understanding the issue will never
                            be a problem.
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <g transform="translate(.648 2.438) scale(.05696)" fill="none" fillRule="evenodd">
                                        <circle r={50.167} cy={237.628} cx={269.529} fill="currentColor" />
                                        <g stroke="currentColor" strokeWidth={24}>
                                            <path d="M269.53 135.628c67.356 0 129.928 9.665 177.107 25.907 56.844 19.57 91.794 49.233 91.794 76.093 0 27.99-37.04 59.503-98.083 79.728-46.15 15.29-106.88 23.272-170.818 23.272-65.554 0-127.63-7.492-174.3-23.44C36.184 297.006.62 265.085.62 237.628c0-26.642 33.37-56.076 89.415-75.616 47.355-16.51 111.472-26.384 179.486-26.384z" />
                                            <path d="M180.736 186.922c33.65-58.348 73.28-107.724 110.92-140.48C337.006 6.976 380.163-8.48 403.43 4.937c24.248 13.983 33.042 61.814 20.067 124.796-9.8 47.618-33.234 104.212-65.176 159.6-32.75 56.788-70.25 106.82-107.377 139.272-46.98 41.068-92.4 55.93-116.185 42.213-23.08-13.3-31.906-56.92-20.834-115.233 9.355-49.27 32.832-109.745 66.8-168.664z" />
                                            <path d="M180.82 289.482c-33.745-58.282-56.72-117.287-66.31-166.255-11.544-59-3.382-104.11 19.864-117.566 24.224-14.024 70.055 2.244 118.14 44.94 36.356 32.28 73.688 80.837 105.723 136.173 32.844 56.733 57.46 114.21 67.036 162.582 12.117 61.213 2.31 107.984-21.453 121.74-23.057 13.348-65.25-.784-110.24-39.5-38.013-32.71-78.682-83.253-112.76-142.115z" />
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Any React framework</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Next, Redwood, or any other, we support them all.
                            <br />
                            WebGL app written in R3F? No problem!
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <rect x={4} y={4} width={16} height={16} rx={1} />
                                    <path d="M4 8L20 8" />
                                    <path d="M8 4L8 8" />
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Same browser for dev and test
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Unlike other tools, it requires no dedicated browser to develop tests. At development time,
                            the browser extension will handle everything in your everyday browser.
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <path d="M3 12h4l3 8 4-16 3 8h4" />
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">No flakiness</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Our advanced retriability feature will recover tests from the most unfortunate scenarios,
                            making sure false negatives won't waste your time.
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <path d="M16 7h1a2 2 0 012 2v.5a.5.5 0 00.5.5.5.5 0 01.5.5v3a.5.5 0 01-.5.5.5.5 0 00-.5.5v.5a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v6a2 2 0 002 2h1M12 8l-2 4h3l-2 4" />
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Batteries included</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Authentication? Data generation? You never have to wonder, the core solution has all the
                            best practices baked in.
                        </dd>
                    </div>
                </dl>
            </section>

            <section className="relative">
                <div className="absolute left-0 right-0 h-1/2 bg-warm-gray-50" aria-hidden="true" />
                <div className="relative px-4 mx-auto max-w-7xl lg:px-8">
                    <div className="px-6 py-10 rounded-lg bg-gradient-to-l from-teal-400 to-brand-green sm:py-16 sm:px-12 lg:py-20 lg:px-20 lg:flex lg:items-center">
                        <div className="lg:w-0 lg:flex-1">
                            <h2 className="text-3xl font-extrabold tracking-tight text-white">
                                Want to be an early adopter?
                            </h2>
                            <p className="max-w-3xl mt-4 text-lg text-white">
                                Join the newletter to get notified when App Actions is available.
                            </p>
                        </div>
                        <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                            <SignUp label="Sign Up" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
