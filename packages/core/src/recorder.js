import { getDriver } from './api';
import isMatch from 'lodash.ismatch';
import { handleNestingStart, handleNestingEnd } from './recordings-to-yaml';

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

export function setupRecorder(bridge, agent) {
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
            agent.sendRecordingEvent(recording);
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

function makeRecordingEvent(event, annotation, agent) {
    // console.group('event:', event.type);
    console.groupCollapsed('event:', event.type);

    // TODO refactor that .get(1) thing
    const targetFiber = Cypress.AppActions.hook.renderers.get(1).findFiberByHostInstance(event.target);

    if (!targetFiber) {
        console.log('No fiber found for target');
        console.groupEnd();
        // TODO send "event.target.location.pathname" on the laod event
        return;
    }

    console.log('targetFiber', targetFiber, event.target);

    const fiber = Cypress.AppActions.reactApi.findAncestorElementByPredicate(targetFiber, fiber => {
        return !!getDriver(fiber);
    });

    console.log('fiber', fiber);

    const currentFiberId = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);
    const driver = getDriver(fiber);

    const annotationGenerator = processAnnotation(driver, event, annotation);
    const owners = agent.getOwners(fiber);
    const { name } = owners[owners.length - 1];

    console.log('annotation', annotation);
    console.log('owners', owners);

    const pattern = annotationGenerator.getPattern();
    const action = annotationGenerator.getAction();
    const args = annotationGenerator.getArgs();

    let recording = {
        id: currentFiberId,

        owners,
        payload: [
            {
                type: 'event',
                action,
                args,
            },
        ],
    };

    console.log('raw recording', recording);

    for (let i = owners.length - 1; i >= 0; i--) {
        const { simplify } = owners[i];

        const nestingStart = simplify.find(({ start }) => {
            return isMatch({ pattern, name, action }, start);
        });

        if (nestingStart) {
            recording = handleNestingStart(agent, recording);
            break;
        }

        const nestingEnd = simplify.find(({ end }) => {
            return isMatch({ pattern, name, action }, end);
        });

        if (nestingEnd) {
            recording = handleNestingEnd(agent, recording, nestingEnd, owners.slice(0, i + 1));
            break;
        }
    }

    console.log('recording', recording);
    console.groupEnd();

    return recording;
}

export function makeAssertionEvent({ action, args, value, owners }) {
    console.groupCollapsed('assertion:', action);

    const assert = {
        owners,
        payload: [
            {
                type: 'assert',
                action,
                value,
                args,
            },
        ],
    };

    console.log('assert', assert);
    console.groupEnd();

    return assert;
}

// function getCoordinates(event) {
//     const eventsWithCoordinates = {
//         mouseup: true,
//         mousedown: true,
//         mousemove: true,
//         mouseover: true,
//     };

//     return eventsWithCoordinates[event.type] ? { x: event.clientX, y: event.clientY } : null;
// }
