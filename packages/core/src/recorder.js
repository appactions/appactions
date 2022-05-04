import { getDriver, getFiberInfo } from './api';
import isMatch from 'lodash.ismatch';
import isEqual from 'lodash.isequal';

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

const mergeEvents = {
    type: (prev, curr) => {
        return {
            args: [prev.args[0] + curr.args[0]],
        };
    },
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

export function merger([prev, curr]) {
    if (isEqual(prev.owners, curr.owners)) {
        return [
            {
                owners: curr.owners,
                payload: [...prev.payload, ...curr.payload],
            },
        ];
    }

    // if (curr.type === 'event') {
    //     if (mergeEvents[curr.action] && prev.action === curr.action) {
    //         if (isEqual(prev.owners, curr.owners)) {
    //             const { args } = mergeEvents[curr.action](prev, curr);
    //             return [
    //                 {
    //                     owners: curr.owners,
    //                     // pattern: curr.pattern,
    //                     // name: curr.name,
    //                     action: curr.action,
    //                     args,
    //                 },
    //             ];
    //         }
    //     }
    // }

    // if (curr.type === 'assert') {
    //     if (isEqual(prev.owners, curr.owners)) {
    //         return [{
    //             owners: curr.owners,
    //             // pattern: curr.pattern,
    //             // name: curr.name,
    //             action: curr.action,
    //             args: curr.args,
    //         }];
    //     }
    // }

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
    // console.groupCollapsed(event.type);

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
        return !!getDriver(fiber);
    });

    console.log('fiber', fiber);

    const currentFiberId = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);
    const driver = getDriver(fiber);

    const annotationGenerator = processAnnotation(driver, event, annotation);
    const owners = agent.getOwners(fiber);
    // const name = driver.getName(getFiberInfo(fiber));
    const { name } = owners[owners.length - 1];

    console.log('annotation', annotation);
    // console.log('owners', owners.map(x => `${x.pattern} (${x.name})`).join(' > '));
    console.log('owners', owners);

    const pattern = annotationGenerator.getPattern();
    const action = annotationGenerator.getAction();
    const args = annotationGenerator.getArgs();

    let recording = {
        id: currentFiberId,

        owners,
        // pattern,
        // name,
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
            recording = agent.handleNestingStart(recording);
            break;
        }

        const nestingEnd = simplify.find(({ end }) => {
            return isMatch({ pattern, name, action }, end);
        });

        if (nestingEnd) {
            recording = agent.handleNestingEnd(recording, nestingEnd, owners.slice(0, i + 1));
            break;
        }
    }

    console.log('recording', recording);
    console.groupEnd();

    return recording;
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
