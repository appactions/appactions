import Hero from 'components/hero';
import SignUp from 'components/signup';

export default function Home() {
    return (
        <>
            <Hero />
            <section className="relative z-10 mx-auto text-center mt-28 max-w-screen-lg xl:max-w-screen-xl">
                <div className="px-4 sm:px-6 md:px-8">
                    <h2 className="mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Current E2E tools don’t actually&nbsp;work.
                    </h2>
                    <p className="max-w-4xl mx-auto mb-6 text-lg font-medium sm:text-2xl sm:leading-10 space-y-6">
                        E2E testing is a high reward, high cost way to test. It gives more cofidence to the developer
                        than no other approach.
                    </p>
                </div>
            </section>
            <section className="relative z-10 mx-auto text-center mt-28 max-w-screen-lg xl:max-w-screen-xl">
                <div className="px-4 sm:px-6 md:px-8">
                    <h2 className="mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        React App Action introduces a <span className="text-teal-500">holistic&nbsp;change</span> to
                        E2E.
                    </h2>
                    <p className="max-w-4xl mx-auto mb-6 text-lg font-medium sm:text-2xl sm:leading-10 space-y-6">
                        lorem ipsum
                    </p>
                </div>
            </section>
            <section className="relative z-10 mx-auto mt-28 max-w-screen-lg xl:max-w-screen-xl">
                <div className="px-4 sm:px-6 md:px-8">
                    <h2 className="mb-8 text-xl font-extrabold leading-none tracking-tight text-center text-gray-900 sm:text-2xl lg:text-4xl lg:text-left">
                        This is how it works:
                    </h2>
                    <p className="mx-auto mb-6 text-lg font-medium sm:text-2xl sm:leading-10 space-y-6">
                        <div className="relative mx-auto max-w-7xl">
                            <div className="max-w-lg mx-auto mt-12 grid gap-5 lg:grid-cols-4 lg:max-w-none">
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixqx=J6502672yF&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                            alt
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <a href="#" className="block mt-2">
                                                <p className="text-xl font-semibold text-gray-900">
                                                    1. Record the user flow
                                                </p>
                                                <p className="mt-3 text-base text-gray-500">
                                                    Just manually test your app. Our browser extension will record what
                                                    you do. This is it.
                                                </p>
                                                <p className="mt-3 text-base text-gray-500">
                                                    All of this happens in your own browser. No second browser to eat up
                                                    your CPU. No CORS issues. No jumping between browsers.
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixqx=J6502672yF&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                            alt
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <a href="#" className="block mt-2">
                                                <p className="text-xl font-semibold text-gray-900">
                                                    2. Save the test as a Flow
                                                </p>
                                                <p className="mt-3 text-base text-gray-500">
                                                    A Flow is just a YAML file, that you generate by the browser
                                                    extension. A Flow defines what an user supposed to do at a certain
                                                    feature. This is our test! These Flows only contain information that
                                                    relevant in the user's perspective.{' '}
                                                    <span className="bold">All</span> implementation details separated,
                                                    thanks to the React-aware test runner.
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixqx=J6502672yF&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                            alt
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <a href="#" className="block mt-2">
                                                <p className="text-xl font-semibold text-gray-900">
                                                    3. Add custom User Patterns (optional)
                                                </p>
                                                <p className="mt-3 text-base text-gray-500">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum
                                                    rerum voluptatem quo recusandae magni placeat saepe molestiae, sed
                                                    excepturi cumque corporis perferendis hic.
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="object-cover w-full h-32"
                                            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixqx=J6502672yF&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                                            alt
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            <a href="#" className="block mt-2">
                                                <p className="text-xl font-semibold text-gray-900">
                                                    4. Easy to understand error messages
                                                </p>
                                                <p className="mt-3 text-base text-gray-500">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum
                                                    rerum voluptatem quo recusandae magni placeat saepe molestiae, sed
                                                    excepturi cumque corporis perferendis hic.
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </p>
                </div>
            </section>
            <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="px-8 py-12 overflow-hidden bg-teal-400 rounded-lg shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
                    <h3 className="mb-8 text-xl font-extrabold leading-none tracking-tight text-white sm:text-2xl lg:text-4xl">
                        What to be an early adopter? Join the wait list:
                    </h3>
                    <SignUp label="Sign Up" />
                </div>
            </section>
        </>
    );
}
