import { useState } from 'react';

export function Star({ size = 40, stroke = 'currentColor', fill = 'currentColor' }) {
    return (
        <svg className="inline-block" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
            <path
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                stroke={stroke}
                strokeWidth={1}
                shapeRendering="optimizeQuality"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function StarInput({ label, name, register, error, onChange }) {
    const [value, setValue] = useState(0);
    const [displayValue, setDisplayValue] = useState(0);
    return (
        <>
            {label ? <label className="block text-sm font-medium text-gray-700">{label}</label> : null}
            <ul className="block mt-2">
                {Array(5)
                    .fill()
                    .map((_, index) => (
                        <li key={index} className="inline-block" onPointerLeave={() => setDisplayValue(value)}>
                            <input
                                type="radio"
                                name={name}
                                value={index + 1}
                                id={`star-${index}`}
                                ref={
                                    register
                                        ? register({ required: 'Please rate your experience from 1 to 5 stars.' })
                                        : null
                                }
                                className="hidden"
                            />
                            <label
                                htmlFor={`star-${index}`}
                                className="relative flex flex-col flex-1 cursor-pointer"
                                onPointerEnter={() => setDisplayValue(index + 1)}
                                onPointerUp={() => {
                                    if (value !== index + 1) {
                                        setValue(index + 1);
                                        if (onChange) onChange(index + 1);
                                    }
                                }}
                            >
                                <Star fill={displayValue > index ? 'currentColor' : 'none'} />
                            </label>
                        </li>
                    ))}
            </ul>
            {error ? <p className="mt-2 text-sm text-red-600">{error.message}</p> : null}
        </>
    );
}

export function StarList({ value, size = 20 }) {
    return (
        <>
            {Array(5)
                .fill()
                .map((_, index) => (
                    <Star key={index} size={size} fill={value > index ? 'currentColor' : 'none'} />
                ))}
        </>
    );
}
