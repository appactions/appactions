import React from 'react';
import { createDriver } from '@appactions/cypress/driver';

const Input = React.forwardRef(({ label, type, name, autoComplete, placeholder, error }, ref) => {
    return (
        <>
            <label htmlFor={`html-id-${name}`} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    type={type}
                    name={name}
                    id={`html-id-${name}`}
                    ref={ref}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className={
                        !error
                            ? 'mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            : 'mt-2 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm rounded-md'
                    }
                />
                {error ? (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                ) : null}
            </div>
            {error ? <p className="mt-2 text-sm text-red-600">{error.message}</p> : null}
        </>
    );
});

export default Input;

createDriver(Input, {
    pattern: 'Input',
    actions: {
        fill: ({ instance }, text) => {
            instance.ref.value = text;
        },
        // isDisabled: ({ instance }) => {
        //     return instance.props.disabled;
        // },
    },
});
