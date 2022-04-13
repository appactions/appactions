const eventsToRecord = {
    CLICK: 'click',
    DBLCLICK: 'dblclick',
    CHANGE: 'change',
    KEYDOWN: 'keydown',
    SELECT: 'select',
    SUBMIT: 'submit',
    LOAD: 'load',
    UNLOAD: 'unload',
};

let isRecorderInitialized = false;

export function setupRecorder(bridge, agent) {
    if (isRecorderInitialized) {
        throw new Error('Recorder is already initialized');
    }

    isRecorderInitialized = true;

    const elementsToListen = getAllFrames(agent.window);

    elementsToListen.forEach(element => {
        Object.values(eventsToRecord).forEach(eventName => {
            element.addEventListener(eventName, recordEvent);
        });
    });

    function recordEvent(event) {
        if (agent._previousRecordEvent && agent._previousRecordEvent.timeStamp === event.timeStamp) {
            return;
        }
        agent._previousRecordEvent = event;

        try {
            agent.onSessionRecordingEvent({ builtInAction: true, event })
        } catch (err) {
            console.error(err);
        }
    }
}

function getAllFrames(windowElement, allFrames = []) {
    allFrames.push(windowElement.frames);

    Array.from(windowElement.frames).forEach(frame => {
        getAllFrames(frame, allFrames);
    });

    return allFrames;
}
