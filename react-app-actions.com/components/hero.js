import SignUp from 'components/signup';
import Demo from 'components/demo';

function HeroText() {
    return (
        <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
            <div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                    <span className="md:block">
                        Leave behind flaky E2E tests <span className="text-brand-green">forever</span>.
                    </span>
                </h1>
                <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Be incredibly productive in testing. Record user sessions inside your browser, keep the result in
                    source control. Achieve incredible stability thanks to the React-aware test runner.
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
    );
}

function Hero() {
    return (
        <main className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-7xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <HeroText />
                    <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                        <div className="sm:max-w-md sm:w-full">
                            <div className="sm:px-10">
                                <Demo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Hero;
