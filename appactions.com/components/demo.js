import { useState, useEffect, useRef } from 'react';

// the /##(.*)##/ thing means that part will be "typed in the animation"
// #### at the end indicates the whole line should appear instantly
const animation = [
    { cursorTarget: '[data-demo="input"]' },
    { code: '  - with: { input: Website }####' },
    {
        code: '    do: { type##: https://pioneer.app## }',
        input: 'https://pioneer.app',
        cursorTarget: '[data-demo="textarea"]',
    },
    { code: '  - with: { textarea: Description }####' },
    {
        code: '    do: { type##: Founders track progress.## }',
        textarea: 'Founders track progress.',
        cursorTarget: '[data-demo="submit"]',
    },
    { code: '  - with: { form }####\n    do: submit####', submitted: true },
    { cursorTarget: '[data-demo="alert"]' },
    { code: '  - with: { alert }####\n    assert: [message, toBe, Success!]####' },
    {},
    {},
    {},
    { cursorTarget: '[data-demo="header"]' },
].reduce(
    (acc, curr) => {
        const last = acc[acc.length - 1];
        return [
            ...acc,
            {
                ...last,
                ...curr,
                code: curr.code ? [last.code, '\n', curr.code].join('').trim() : last.code,
            },
        ];
    },
    [
        {
            input: '',
            textarea: '',
            submitted: false,
            code: 'name: Submit page\ndescription: Should be able to submit links.\nsteps:',
            cursorTarget: '[data-demo="header"]',
        },
    ],
);

function Cursor({ step }) {
    const { cursorTarget } = animation[step];
    const [position, setPosition] = useState(null);
    const ref = useRef();

    useEffect(() => {
        try {
            const parent = ref.current.parentElement.getBoundingClientRect();
            const el = ref.current.parentElement.querySelector(cursorTarget).getBoundingClientRect();
            setPosition({
                left: el.left - parent.left + el.width * 0.7,
                top: el.top - parent.top + el.height * 0.3,
            });
        } catch (e) {}
    }, [cursorTarget]);

    const style = position ? { top: position.top, left: position.left } : { display: 'none' };
    return (
        <svg viewBox="0 0 22 24" fill="none" className="absolute block w-8 h-8 cursor-transition" style={style} ref={ref}>
            <path d="M7.5 17L5 4l11 6.5-5.5 1.5-3 5z" fill="currentColor" />
            <path
                d="M7 17.1l.26 1.28.67-1.12 2.9-4.83 5.3-1.45 1.14-.3-1.02-.61-11-6.5-.95-.56.2 1.08 2.5 13z"
                stroke="#fff"
            />
        </svg>
    );
}

function Demo() {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setStep(step => (step + 1) % animation.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="relative lg:pr-4" data-demo="container">
            <Cursor step={step} />
            <div className="block mx-auto mb-8 overflow-hidden font-mono bg-gray-200 border shadow-xl pointer-events-none rounded-xl demo-window-size ">
                <div className="flex w-full h-8 pl-2 bg-gray-300">
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-red-400 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-yellow-300 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-green-500 rounded-full"></span>
                    <span className="flex-1 font-sans text-center text-gray-600 leading-8 -ml-28" data-demo="header">
                        AwesomeReactApp
                    </span>
                </div>
                <div className="p-4 overflow-hidden h-96">
                    <AppMockup step={step} />
                </div>
            </div>
            <div className="block mx-auto overflow-hidden font-mono bg-gray-800 border shadow-xl rounded-xl demo-window-size sm:mx-auto">
                <div className="flex w-full h-8 pl-2 bg-gray-700">
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-red-400 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-yellow-300 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-green-500 rounded-full"></span>
                    <span className="flex-1 font-sans text-center text-gray-300 leading-8 -ml-28">
                        submit-page.yml — IDE
                    </span>
                </div>
                <div className="py-2 overflow-hidden text-left text-gray-200 pl-14 h-96 dark-scrollbar" data-demo="code">
                    <TestCode step={step} />
                </div>
            </div>
        </div>
    );
}

function useTyping(str) {
    const [pos, setPos] = useState(0);
    useEffect(() => {
        let i = 0;
        let interval = setInterval(() => {
            if (i < str.length) {
                setPos(++i);
            } else {
                clearInterval(interval);
            }
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return pos;
}

function TypingInput({ value }) {
    const pos = useTyping(value);
    return (
        <input
            type="text"
            className="flex-1 block w-full border-gray-300 rounded-md focus:ring-teal-500 focus:border-indigo-500 rounded-r-md sm:text-sm"
            placeholder="www.example.com"
            value={value.slice(0, pos)}
            readOnly
            data-demo="input"
        />
    );
}

function TypingTextarea({ value }) {
    const pos = useTyping(value);
    return (
        <textarea
            id="about"
            name="about"
            rows={3}
            className="block w-full mt-1 border-gray-300 shadow-sm focus:ring-teal-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={value.slice(0, pos)}
            readOnly
            data-demo="textarea"
        />
    );
}

function AppMockup({ step }) {
    const [state, setState] = useState(animation[0]);
    useEffect(() => setState(animation[step]));
    const content = !state.submitted ? (
        <form action="#" method="POST">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                            <label htmlFor="company_website" className="block text-sm font-medium text-gray-700">
                                Website
                            </label>
                            <div className="flex mt-1 rounded-md shadow-sm">
                                <TypingInput value={state.input} key={state.input} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <div className="mt-1">
                            <TypingTextarea key={state.textarea} value={state.textarea} />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        data-demo="submit"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    ) : (
        <div className="p-4 rounded-md bg-green-50" data-demo="alert">
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
                    <p className="text-sm font-medium text-green-800">Success!</p>
                </div>
            </div>
        </div>
    );
    return <div className="mt-5 md:mt-0 md:col-span-2">{content}</div>;
}

function TypingLine({ line }) {
    const [pos, setPos] = useState(0);
    const [substringToType, setTypeStr] = useState(null);

    useEffect(() => {
        const typeMatch = line.match(/##(.*)##/);
        const substringToType = typeMatch && typeMatch[1];

        if (typeof substringToType === 'string') {
            setTypeStr(substringToType);
        }

        let i = 0;
        let interval = setInterval(() => {
            if (i < typeof substringToType === 'string' ? substringToType.length : line.length) {
                setPos(++i);
            } else {
                clearInterval(interval);
            }
        }, 20);

        return () => clearInterval(interval);
    }, []);

    const typing =
        typeof substringToType === 'string'
            ? line.replace(/##.*##/, substringToType.slice(0, pos))
            : line.slice(0, pos);
    return <li>{typing.replace(/ /g, '\u00a0')}</li>;
}

function TestCode({ step }) {
    return (
        <ol className="text-sm list-decimal md:text-base">
            {animation[step].code.split('\n').map((line, index) => (
                <TypingLine key={line} line={line} />
            ))}
        </ol>
    );
}

export default Demo;
