import { useState, useEffect } from 'react';

const animation = [
    { code: 'name: Feedback form' },
    { code: 'description: General user flows.' },
    { code: 'steps:' },
    { code: '  - with: { input: Website }' },
    { code: '    do: { type: foo bar }', input: 'foo bar' },
    { code: '  - with: { textarea: Review }' },
    { code: '    do: { type: qwe asd wedf sadf as }', textarea: 'qwe asd wedf sadf as' },
    { code: '  - with: form' },
    { code: '    do: submit', submit: true },
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
    [{ input: '', textarea: '', submit: false, submitted: false, code: '' }],
);

function Demo() {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const onStep = event => {
            event.preventDefault();
            setStep(step => {
                let result = step;
                if (event.key === 'ArrowRight') {
                    result = step + 1;
                } else if (event.key === 'ArrowLeft') {
                    result = step - 1;
                }

                return Math.max(0, result % animation.length);
            });
        };
        document.addEventListener('keyup', onStep);

        return () => document.removeEventListener('keyup', onStep);
    }, []);
    return (
        <>
            <h4>Step: {step}</h4>
            <div className="block mb-8 overflow-hidden font-mono bg-gray-200 border pointer-events-none rounded-xl w-192">
                <div className="block w-full h-8 pl-2 bg-gray-300">
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-red-400 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-yellow-300 rounded-full"></span>
                    <span className="inline-block w-4 h-4 my-2 ml-2 bg-green-500 rounded-full"></span>
                    <span className=" inline-block  font-sans text-center text-gray-700">AwesomeReactApp</span>
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
                <div className="py-2 overflow-y-scroll text-gray-200 pl-14 h-96 dark-scrollbar">
                    <TestCode step={step} />
                </div>
            </div>
        </>
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
                                <input
                                    type="text"
                                    name="company_website"
                                    id="company_website"
                                    className="flex-1 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md sm:text-sm"
                                    placeholder="www.example.com"
                                    value={state.input}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                            Review
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full mt-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={state.textarea}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={state.submit}
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

function TestCode({ step }) {
    return (
        <ol className="list-decimal">
            {animation[step].code.split('\n').map((line, index) => (
                <li key={index}>{line.replace(/ /g, '\u00a0')}</li>
            ))}
        </ol>
    );
}

export default Demo;
