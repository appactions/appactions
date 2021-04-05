import { useState } from 'react';

const STATUSES = {
    INIT: 'INIT',
    SUBMITTING: 'SUBMITTING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
};

function SignUp({ label = 'Join waitlist', light }) {
    const [status, setStatus] = useState(STATUSES.INIT);
    const onSubmit = event => {
        event.preventDefault();

        setStatus(STATUSES.SUBMITTING);

        fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify({
                email: event.target.elements.email.value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.ok) {
                    setStatus(STATUSES.SUCCESS);
                } else {
                    setStatus(STATUSES.ERROR);
                }
            })
            .catch(() => {
                setStatus(STATUSES.ERROR);
            });
    };

    if (status === STATUSES.SUCCESS) {
        return (
            <div className="p-4 rounded-md bg-green-50">
                <div className="flex">
                    <div className="flex-shrink-0">
                        {/* Heroicon name: solid/check-circle */}
                        <svg
                            className="w-5 h-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Please check your email to confirm</h3>
                        {/* <div className="mt-2 text-sm text-green-700">
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum
                                similique veniam.
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }

    if (status === STATUSES.ERROR) {
        return (
            <div className="p-4 rounded-md bg-red-50">
                <div className="flex">
                    <div className="flex-shrink-0">
                        {/* Heroicon name: solid/x-circle */}
                        <svg
                            className="w-5 h-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Something went wrong.</h3>
                        <button
                            className="mt-2 text-sm text-red-700 underline"
                            onClick={event => {
                                event.preventDefault();
                                setStatus(STATUSES.INIT);
                            }}
                        >
                            Click here to try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="sm:max-w-xl sm:mx-auto lg:mx-0">
            <div className="sm:flex">
                <div className="flex-1 min-w-0">
                    <label htmlFor="email" className="sr-only">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        disabled={status === STATUSES.SUBMITTING}
                        className={
                            light
                                ? 'shadow block w-full px-4 py-3 text-base text-gray-900 placeholder-teal-400 border-4 border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300'
                                : 'shadow block w-full px-4 py-3 text-base text-gray-900 placeholder-teal-400 border-4 border-brand-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300'
                        }
                        data-cta="cta-input"
                    />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                        type="submit"
                        disabled={status === STATUSES.SUBMITTING}
                        className={
                            light
                                ? 'block px-4 py-3 font-medium border-4 shadow border-white text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 disabled:opacity-50'
                                : 'block px-4 py-3 font-medium border-4 shadow border-brand-green text-brand-green hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 disabled:opacity-50'
                        }
                    >
                        {label}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SignUp;
