import React from 'react';
import { useStore } from './hooks';
import { useDevtoolsContext } from './context';
import Highlight from 'react-highlight';
import json2yaml from './json-to-yaml';

function RecordControls() {
    const { bridge, store } = useDevtoolsContext();
    const recording = useStore('session-recording-toggle', store => store.isRecording);
    const replay = event => {
        bridge.send('session-recording-replay');
    };
    const toggleRecord = event => {
        bridge.send('session-recording-toggle', !recording);
    };
    const clear = event => {
        bridge.send('session-recording-clear');
    };
    return (
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none"
                onClick={replay}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none"
                onClick={toggleRecord}
            >
                {!recording ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </button>
            <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none"
                onClick={clear}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </span>
    );
}

const meta = {
    description: `Test recorded at ${new Date().toLocaleString()}`,
    start: {
        route: '/',
        auth: false,
    },
};

export default function SessionRecording() {
    const sessionRecording = useStore('session-recording-event', store => store.sessionRecordingDb);

    return (
        <div className="pt-2 pl-2">
            <RecordControls />
            <div className="my-2">
                <Highlight className="yaml">{renderYAML(meta, sessionRecording)}</Highlight>
            </div>
        </div>
    );
}

function renderYAML(meta, events) {
    if (events.length === 0) {
        return '# empty test';
    }

    return json2yaml({
        description: meta.description,
        start: {
            route: meta.start.route,
            auth: meta.start.auth,
        },
        steps: events.map(event => ({
            with: event.patternName,
            do: event.args.length === 0 ? event.actionName : { [event.actionName]: event.args },
        })),
    });
}
