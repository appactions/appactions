import Delay from './delay';

export function Message({ text }) {
    return (
        <div className="p-4 rounded-md bg-blue-50">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg
                        className="w-5 h-5 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className="flex-1 ml-3 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">{text}</p>
                </div>
            </div>
        </div>
    );
}

export function Loading({ text = 'Loading...' }) {
    return (
        <Delay>
            <div className="p-4 bg-blue-100 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 mr-3 -ml-1 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1 ml-3 md:flex md:justify-between">
                        <p className="text-sm text-blue-500">{text}</p>
                    </div>
                </div>
            </div>
        </Delay>
    );
}

export function Alert({ text, children }) {
    return (
        <div className="p-4 rounded-md bg-red-50">
            <div className="flex">
                <div className="flex-shrink-0">
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
                    <h3 className="text-sm font-medium text-red-800">{text}</h3>
                    {children ? <div className="mt-2 text-sm text-red-700">{children}</div> : null}
                </div>
            </div>
        </div>
    );
}
