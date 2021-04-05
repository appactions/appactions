import SignUp from 'components/signup';
import Demo from 'components/demo';

export default function Home() {
    return (
        <>
            <section className="mt-16 sm:mt-24">
                <div className="mx-auto max-w-7xl">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                            <div>
                                <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                                    <span className="md:block">
                                        Leave behind flaky E2E tests <span className="text-brand-green">forever</span>.
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                    Be incredibly productive in testing. Record user sessions inside your browser, keep
                                    the result in source control. Achieve incredible stability thanks to the React-aware
                                    test runner.
                                </p>
                                <div className="mt-10 sm:mt-12">
                                    <SignUp />

                                    <p className="mt-3 text-sm text-gray-400 sm:mt-4">
                                        React App Actions is not ready for public release, but it's close!
                                        <br />
                                        Join the newsletter to be notified when it's available.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                            <div className="sm:max-w-md sm:w-full">
                                <div className="sm:px-10">
                                    <Demo />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative z-10 mx-auto text-center mt-28 max-w-screen-lg xl:max-w-screen-xl">
                <div className="px-4 sm:px-6 md:px-8">
                    <h2 className="mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Current E2E tools don’t actually&nbsp;work.
                    </h2>
                    <p className="max-w-4xl mx-auto mb-6 text-lg font-medium sm:text-2xl sm:leading-10 space-y-6">
                        <span className="highlight">E2E testing is a high reward, high-cost way to test.</span> It gives
                        more confidence to the developer than any other approach. However, getting it right is extremely
                        hard.{' '}
                        <span className="fadeout">
                            E2E tests are flaky, cumbersome to write, execute slowly, need constant maintenance, best
                            practices are scarce, developers are required to write explicit wait logic or the
                            retryability is limited, needs web development experience to write good tests, fixing broken
                            tests is hard work...
                        </span>
                    </p>
                </div>
            </section>
            <section className="relative z-10 mx-auto text-center mt-28 max-w-screen-lg xl:max-w-screen-xl" id="vision">
                <div className="px-4 sm:px-6 md:px-8">
                    <h2 className="mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Introducing a <span className="text-brand-green">holistic&nbsp;change</span> to E2E.
                    </h2>
                    <p className="max-w-4xl mx-auto mb-6 text-lg font-medium sm:text-2xl sm:leading-10 space-y-6">
                        Being React-aware means React App Actions is having direct access to React internals. This
                        enables a <span className="highlight">declarative interface:</span> tests are fully separated
                        from any form of implementation details,{' '}
                        <span className="highlight">
                            test code only declares the expected behavior from the user's perspective.
                        </span>{' '}
                        This results in more maintainable test code, superior stability, excellent performance, and many
                        more.
                    </p>
                    <p className="max-w-4xl mx-auto mb-6 text-lg italic font-medium sm:text-2xl sm:leading-10 space-y-6">
                        “React App Actions does the same to testing, what React did to UI.”
                    </p>
                </div>
            </section>
            <section className="relative z-10 mx-auto mt-28 max-w-screen-lg xl:max-w-screen-xl" id="how-does-it-work">
                <div className="px-4 sm:px-6 md:px-8">
                    <h2 className="mb-8 text-xl font-extrabold leading-none tracking-tight text-center text-gray-900 sm:text-2xl lg:text-4xl lg:text-left">
                        This is how it works:
                    </h2>
                    <div className="mx-auto mb-6 text-lg font-medium sm:text-2xl sm:leading-10 space-y-6">
                        <div className="relative mx-auto max-w-7xl">
                            <div className="max-w-lg mx-auto mt-12 grid gap-5 lg:grid-cols-4 lg:max-w-none">
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="/img/photo-1496128858413-b36217c2ce36.jpeg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <p className="text-xl font-semibold text-gray-900">
                                                1. Record the user flow
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                Just manually test your app. Our browser extension will record what you
                                                do. This is it.
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                All of this happens in your own browser. No jumping between windows. No
                                                CORS issues. No second browser to eat up your CPU.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="/img/photo-1547586696-ea22b4d4235d.jpeg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <p className="text-xl font-semibold text-gray-900">
                                                2. Save the test as a Flow
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                A Flow is a YAML file, generated by the browser extension. It's a very
                                                human-friendly way to declare test logic.
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                Easy to manually edit, if you want to. Works great with version control
                                                systems, like Git.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="/img/photo-1492724441997-5dc865305da7.jpeg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <p className="text-xl font-semibold text-gray-900">
                                                3. Add custom Roles (optional)
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                Element selection happens by roles. This way even a non-technical person
                                                can read and understand what does the test code (a Flow) is saying.
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                In React App Actions, batteries are included. By default, selection
                                                happens by Aria Roles, but you can declare custom ones relevant for your
                                                app.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="/img/photo-1498049860654-af1a5c566876.jpeg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <p className="text-xl font-semibold text-gray-900">4. Add it to CI/CD</p>
                                            <p className="mt-3 text-base text-gray-500">
                                                React App Actions is the tool, that brings your CI/CD to the next level.
                                            </p>
                                            <p className="mt-3 text-base text-gray-500">
                                                No more false positives, no more cryptic errors. The unmatched stability
                                                and clear error messages on real issues will change how you develop
                                                React apps.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative py-16 bg-white sm:py-24 lg:py-32" id="benefits">
                <div className="max-w-md px-4 mx-auto text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                    <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">Benefits</h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Sharp Tool for an Important Job
                    </p>
                    {/* <p className="mx-auto mt-5 text-xl text-gray-500 max-w-prose">
                        Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc,
                        ullamcorper malesuada. Eleifend condimentum id viverra nulla.
                    </p> */}
                    <div className="mt-12">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="pt-6">
                                <div className="px-6 pb-8 rounded-lg flow-root bg-gray-50">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 shadow-lg bg-brand-green rounded-md">
                                                {/* Heroicon name: outline/lock-closed */}
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                            Unbeatable stability
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Having aware of React internals enables the test runner to know exactly what
                                            is going on. From being patient with a slow network, to realize fatal states
                                            early.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="px-6 pb-8 rounded-lg flow-root bg-gray-50">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 shadow-lg bg-brand-green rounded-md">
                                                {/* Heroicon name: outline/refresh */}
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                            Best of Two Worlds
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Enjoy the high-level nature of in-browser solutions, while utilizing all
                                            benefits of Selenium. Develop with an effective high-level API, test with a
                                            mature browser automation tool.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="px-6 pb-8 rounded-lg flow-root bg-gray-50">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 shadow-lg bg-brand-green rounded-md">
                                                {/* Heroicon name: outline/cloud-upload */}
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                            Incredible productivity
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            You. Can. Create. These. Tests. Just. By. Manually. Performing. It. Once.
                                            <br />I have nothing else to say.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="px-6 pb-8 rounded-lg flow-root bg-gray-50">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 shadow-lg bg-brand-green rounded-md">
                                                {/* Heroicon name: outline/shield-check */}
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                            Low maintenance
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Tests are only changing when the feature change. Implementation details are
                                            radically separated from the test code. Unrelated development will never
                                            break a test.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="px-6 pb-8 rounded-lg flow-root bg-gray-50">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 shadow-lg bg-brand-green rounded-md">
                                                {/* Heroicon name: outline/cog */}
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                            Effective Architecture
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            The overhead is super tiny. Development environments will only grow by a
                                            lean browser extension. Unlike other tools, requires no dedicated browser to
                                            develop tests.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="px-6 pb-8 rounded-lg flow-root bg-gray-50">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 shadow-lg bg-brand-green rounded-md">
                                                {/* Heroicon name: outline/server */}
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                            Starts simple, scales great
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Works well with any size of React app. Developer experience is the same on
                                            landing pages and enterprise apps.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                Join the newletter to get notified when React App Actions is available.
                            </p>
                        </div>
                        <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                            <SignUp label="Sign Up" light />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
