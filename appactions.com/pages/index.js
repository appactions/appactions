import SignUp from 'components/signup';
import Demo from 'components/demo';
import FloatElement from 'components/float-element';

export default function Home() {
    return (
        <>
            <section className="mt-16 mb-32 sm:mt-24">
                <div className="mx-auto max-w-7xl">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                            <div>
                                <h3 className="mt-8 font-sans text-lg font-bold tracking-widest text-black uppercase sm:mt-12 lg:mt-24">
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
                                <div className="mt-10 sm:mt-12">
                                    <p className="my-3 font-sans font-bold tracking-wider text-black uppercase text-md md:text-lg">
                                        SIGN UP TO HEAR AS SOON AS WE LAUNCH!
                                    </p>
                                    <SignUp />
                                </div>

                                <div className="px-4 mt-32">
                                    <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                        High level
                                    </h2>
                                    <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        <span className="text-brand-green">App Actions</span> is an abstraction on
                                        Selenium to test React apps. It frees you from dealing with the low-level API
                                        issues, so you can focus on creating great tests.
                                    </p>
                                </div>
                                <div className="px-4 my-32">
                                    <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                        Session-recording
                                    </h2>
                                    <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        Perform the user behavior once; our browser extension generates the test. Just
                                        check in the resulting code in your version control system, and you are done!
                                    </p>
                                </div>
                                <div className="px-4 my-32">
                                    <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                        Pattern-based selection
                                    </h2>
                                    <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        Selecting elements by CSS selectors is not just a pain, it makes tests go out of
                                        date pretty fast. Instead, App Actions select elements by patterns. Default
                                        patterns are WAI-ARIA roles, but you can define custom ones.
                                    </p>
                                </div>
                                <div className="px-4 my-32">
                                    <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">
                                        Low maintenance
                                    </h2>
                                    <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        App Actions tests are entirely free of implementation details. This way, you
                                        only have to touch a test next time when business logic changes. Because tests
                                        are defined in YAML format, editing them does not require programming skills.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 sm:w-full sm:mx-auto">
                            <div className="w-full">
                                <div className="">
                                    <div className="relative w-full">
                                        <FloatElement unLockAt={1150}>
                                            <Demo />
                                        </FloatElement>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="relative px-4 pt-8 pb-16 mx-auto bg-white sm:pb-24 lg:pb-32 max-w-7xl lg:px-8"
                id="benefits"
            >
                <p className="font-sans text-lg font-bold tracking-widest text-black uppercase">
                    Everything you need to know
                </p>
                <h2 className="my-4 text-4xl font-slab text-gray md:text-5xl lg:text-6xl">Benefits</h2>
                <dl className="pt-10 mt-6 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-12">
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g>
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M5.455 15L1 18.5V3a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v12H5.455zm-.692-2H16V4H3v10.385L4.763 13zM8 17h10.237L20 18.385V8h1a1 1 0 0 1 1 1v13.5L17.545 19H9a1 1 0 0 1-1-1v-1z"></path>
                                    </g>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Why Rust?</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Learn what makes Rust unique and makes it fast and reliable
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Cargo</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Installing dependencies and compiling using the package manager
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M16.018,3.815L15.232,8h-4.966l0.716-3.815L9.018,3.815L8.232,8H4v2h3.857l-0.751,4H3v2h3.731l-0.714,3.805l1.965,0.369 L8.766,16h4.966l-0.714,3.805l1.965,0.369L15.766,16H20v-2h-3.859l0.751-4H21V8h-3.733l0.716-3.815L16.018,3.815z M14.106,14H9.141 l0.751-4h4.966L14.106,14z"></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Numbers, Booleans and Strings
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">Basic Rust data types and their behaviour</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M5,16h3v3c0,1.103,0.897,2,2,2h9c1.103,0,2-0.897,2-2v-9c0-1.103-0.897-2-2-2h-3V5c0-1.103-0.897-2-2-2H5 C3.897,3,3,3.897,3,5v9C3,15.103,3.897,16,5,16z M14.001,14L14.001,14L14,10h0.001V14z M19,10l0.001,9H10v-3h4c1.103,0,2-0.897,2-2 v-4H19z M5,5h9v3h-4c-1.103,0-2,0.897-2,2v4H5V5z"></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Structs and Traits</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">Abstractions to make your own data types</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z"></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Functions and Closures
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">Functions, methods and closures in depth</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g>
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M19 22H5a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12h4v4a3 3 0 0 1-3 3zm-1-5v2a1 1 0 0 0 2 0v-2h-2zm-2 3V4H4v15a1 1 0 0 0 1 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z"></path>
                                    </g>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Common Data Structures in Rust
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">Vectors, linked lists, tries and more</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g>
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.811 5.741L17 12h3a8 8 0 1 0-2.46 5.772l.998 1.795A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2zm0 5a3 3 0 0 1 3 3v1h1v5H8v-5h1v-1a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-.993.883L11 10v1h2v-1a1 1 0 0 0-.883-.993L12 9z"></path>
                                    </g>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Mutability and Ownership
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">The magic Rust memory model simplified</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Pattern Matching</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">Switch cases on steroids</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11.001 10H13.001V15H11.001zM11 16H13V18H11z"></path>
                                    <path d="M13.768,4.2C13.42,3.545,12.742,3.138,12,3.138s-1.42,0.407-1.768,1.063L2.894,18.064 c-0.331,0.626-0.311,1.361,0.054,1.968C3.313,20.638,3.953,21,4.661,21h14.678c0.708,0,1.349-0.362,1.714-0.968 c0.364-0.606,0.385-1.342,0.054-1.968L13.768,4.2z M4.661,19L12,5.137L19.344,19H4.661z"></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Errors</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Handling and recovering from errors in your Rust program
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    version="1.2"
                                    baseProfile="tiny"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g>
                                        <path d="M18 16.184v-8.368c1.161-.415 2-1.514 2-2.816 0-1.654-1.346-3-3-3s-3 1.346-3 3c0 1.302.839 2.401 2 2.815v8.369c-1.161.415-2 1.514-2 2.816 0 1.654 1.346 3 3 3s3-1.346 3-3c0-1.302-.839-2.401-2-2.816zm-1-12.184c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1zm0 16c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1zM10 5c0-1.654-1.346-3-3-3s-3 1.346-3 3c0 1.302.839 2.401 2 2.815v8.369c-1.161.415-2 1.514-2 2.816 0 1.654 1.346 3 3 3s3-1.346 3-3c0-1.302-.839-2.401-2-2.816v-8.368c1.161-.415 2-1.514 2-2.816zm-3-1c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1zm0 16c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1z"></path>
                                    </g>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Concurrency</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">Stress free concurrency, work stealing and more</dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 16 16"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.25 5.75v-4h-1.5v2.542c-1.145-1.359-2.911-2.209-4.84-2.209-3.177 0-5.92 2.307-6.16 5.398l-.02.269h1.501l.022-.226c.212-2.195 2.202-3.94 4.656-3.94 1.736 0 3.244.875 4.05 2.166h-2.83v1.5h4.163l.962-.975V5.75h-.004zM8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                                    ></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">
                                Testing and Debugging
                            </p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Helpful patterns and tools to test and debug your Rust code
                        </dd>
                    </div>
                    <div className="relative">
                        <dt>
                            <span className="inline-block p-2 text-white rounded-md bg-brand-green" aria-hidden="true">
                                <svg
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-6 h-6"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </span>
                            <p className="font-sans text-lg font-semibold text-black lg:text-xl">Ecosystem Packages</p>
                        </dt>
                        <dd className="mt-2 font-sans text-lg">
                            Equivalent packages to the most popular JavaScript libraries
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
                            <SignUp label="Sign Up" light />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
