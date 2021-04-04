import { useState, useEffect } from 'react';

// the /##(.*)##/ thing means that part will be "typed in the animation"
// #### at the end indicates the whole line should appear instantly
const animation = [
    { code: 'name: Feedback form' },
    { code: 'description: General user flows.' },
    { code: 'steps:' },
    { code: '  - with: { input: Website }####', cursorTarget: '[data-demo="input"]' },
    { code: '    do: { type##: foo bar## }', input: 'foo bar' },
    { code: '  - with: { textarea: Review }####', cursorTarget: '[data-demo="textarea"]' },
    { code: '    do: { type##: qwe asd wedf sadf as## }', textarea: 'qwe asd wedf sadf as' },
    { code: '  - with: { form }####', cursorTarget: '[data-demo="submit"]' },
    { code: '    do: submit####', submit: true },
    { submitted: true },
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
    [{ input: '', textarea: '', submit: false, submitted: false, code: '', cursorTarget: '[data-demo="code"]' }],
);

function Cursor({ step }) {
    const { cursorTarget } = animation[step];
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const el = document.querySelector(cursorTarget);
        if (el) {
            setPosition(el.getBoundingClientRect());
        }
    }, [cursorTarget]);

    const style = position
        ? { top: position.top + position.height * 0.3, left: position.left + position.width * 0.7 }
        : { display: 'none' };

    return (
        <svg viewBox="0 0 22 24" fill="none" className="fixed block w-8 h-8 cursor-transition" style={style}>
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
        }, 1000);
        return () => clearInterval(interval);
        // const onStep = event => {
        //     event.preventDefault();
        //     setStep(step => {
        //         let result = step;
        //         if (event.key === 'ArrowRight') {
        //             result = step + 1;
        //         } else if (event.key === 'ArrowLeft') {
        //             result = step - 1;
        //         }

        //         return Math.max(0, result % animation.length);
        //     });
        // };
        // document.addEventListener('keyup', onStep);

        // return () => document.removeEventListener('keyup', onStep);
    }, []);
    return (
        <>
            <Cursor step={step} />
            <div className="block mb-8 overflow-hidden font-mono bg-gray-200 border pointer-events-none rounded-xl w-192">
                <div className="block w-full h-8 pl-2 bg-gray-300">
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-red-400 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-yellow-300 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-green-500 rounded-full"></span>
                    <span className="inline-block font-sans text-center text-gray-700">AwesomeReactApp</span>
                </div>
                <div className="p-4 overflow-hidden h-96">
                    <AppMockup step={step} />
                </div>
            </div>
            <div className="block overflow-hidden font-mono bg-gray-800 border rounded-xl w-192">
                <div className="block w-full h-8 pl-2 bg-gray-700">
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-red-400 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-yellow-300 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-green-500 rounded-full"></span>
                    <span className=" inline-block  font-sans text-center text-gray-300">feedback.yml — IDE</span>
                </div>
                <div className="py-2 overflow-hidden text-gray-200 pl-14 h-96 dark-scrollbar" data-demo="code">
                    <TestCode step={step} />
                </div>
            </div>
        </>
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
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return pos;
}

function TypingInput({ value }) {
    const pos = useTyping(value);
    return (
        <input
            type="text"
            className="flex-1 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                            Review
                        </label>
                        <div className="mt-1">
                            <TypingTextarea key={state.textarea} value={state.textarea} />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={state.submit}
                        data-demo="submit"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    ) : (
        <h4>submitted</h4>
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
        }, 30);

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
        <ol className="list-decimal">
            {animation[step].code.split('\n').map((line, index) => (
                <TypingLine key={line} line={line} />
            ))}
        </ol>
    );
}

export default Demo;
