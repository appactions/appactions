import { getDriver, getFiberInfo } from './api';
import isMatch from 'lodash.ismatch';

// const eventsToRecord = {
//     CLICK: 'click',
//     DBLCLICK: 'dblclick',
//     CHANGE: 'change',
//     KEYDOWN: 'keydown',
//     SELECT: 'select',
//     SUBMIT: 'submit',
//     LOAD: 'load',
//     UNLOAD: 'unload',
// };

// Map<native events, built in actions>
const eventsToRecord = {
    click: 'click',
    keydown: 'type',
    load: 'goto',
};

const extractArgs = {
    type: event => [event.key],
    goto: event => [event.target.href],
};

function processAnnotation(driver, event, annotation = {}) {
    const self = {
        getPattern() {
            if (annotation.pattern) {
                return annotation.pattern;
            }

            return driver.pattern;
        },
        getAction() {
            if (annotation.action) {
                return annotation.action;
            }

            const eventType = event.type;
            const builtInAction = eventsToRecord[eventType];

            if (builtInAction) {
                return builtInAction;
            }

            return eventType;
        },
        getArgs() {
            if (annotation.args) {
                return annotation.args;
            }

            const action = self.getAction();

            if (extractArgs[action]) {
                return extractArgs[action](event);
            }

            return [];
        },
    };

    return self;
}

let isRecorderInitialized = false;

export function setupRecorder(bridge, agent) {
    if (isRecorderInitialized) {
        throw new Error('Recorder is already initialized');
    }

    isRecorderInitialized = true;

    const elementsToListen = getAllFrames(agent.window);

    elementsToListen.forEach(element => {
        Object.keys(eventsToRecord).forEach(eventName => {
            element.addEventListener(eventName, recordEvent);
        });
    });

    function recordEvent(event) {
        if (agent._previousRecordEvent && agent._previousRecordEvent.timeStamp === event.timeStamp) {
            return;
        }
        agent._previousRecordEvent = event;

        let annotation;

        const annotationIndex = agent.window.__REACT_APP_ACTIONS__.annotations.findIndex(annotation => {
            return event === annotation.matcher?.nativeEvent || isMatch(event, annotation.matcher);
        });

        if (annotationIndex !== -1) {
            annotation = agent.window.__REACT_APP_ACTIONS__.annotations[annotationIndex];
            agent.window.__REACT_APP_ACTIONS__.annotations.splice(annotationIndex, 1);
        }

        const recording = makeRecordingEvent(event, annotation, agent);

        if (recording) {
            agent.sendRecordingEvent(recording, merger);
        }
    }
}

function merger([prev, curr]) {
    if (!prev) {
        return [curr];
    }
    if (prev.action === 'type' && curr.action === 'type') {
        return [
            {
                ...prev,
                args: [prev.args[0] + curr.args[0]],
            },
        ];
    }

    return [prev, curr];
}

function getAllFrames(windowElement, allFrames = []) {
    allFrames.push(windowElement.frames);

    Array.from(windowElement.frames).forEach(frame => {
        getAllFrames(frame, allFrames);
    });

    return allFrames;
}

function makeRecordingEvent(event, annotation, agent) {
    console.group(event.type);

    // TODO refactor that .get(1) thing
    const targetFiber = Cypress.AppActions.hook.renderers.get(1).findFiberByHostInstance(event.target);

    if (!targetFiber) {
        console.log('No fiber found for target');
        console.groupEnd();
        // TODO send "event.target.location.pathname" on the laod event
        // debugger;
        return;
    }

    console.log('targetFiber', targetFiber, event.target);

    const fiber = Cypress.AppActions.reactApi.findAncestorElementByPredicate(targetFiber, fiber => {
        const driver = getDriver(fiber);
        return driver && driver.pattern;
    });

    console.log('fiber', fiber);

    const currentFiberId = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);
    const driver = getDriver(fiber);

    const annotationGenerator = processAnnotation(driver, event, annotation);
    const name = driver.getName(getFiberInfo(fiber));
    const owners = agent.getOwners(fiber);

    console.log('annotation', annotation);
    console.log('owners', owners.map(x => `${x.pattern} (${x.name})`).join(' > '));

    const recording = {
        // app actions
        name,
        owners,
        pattern: annotationGenerator.getPattern(),
        action: annotationGenerator.getAction(),
        args: annotationGenerator.getArgs(),

        // native
        value: event.target.value,
        tagName: event.target.tagName,
        keyCode: event.keyCode ? event.keyCode : null,
        href: event.target.href ? event.target.href : null,
        coordinates: getCoordinates(event),

        // non-overrideable
        id: currentFiberId,
    };

    console.log('recording', recording);

    // agent.window.recordings = agent.window.recordings || [];
    // agent.window.recordings.push(recording);

    console.groupEnd();

    return recording;
}

function getCoordinates(event) {
    const eventsWithCoordinates = {
        mouseup: true,
        mousedown: true,
        mousemove: true,
        mouseover: true,
    };

    return eventsWithCoordinates[event.type] ? { x: event.clientX, y: event.clientY } : null;
}
