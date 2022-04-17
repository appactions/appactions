import { getDriver } from './api';
import isMatch from 'lodash.ismatch';

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

        let annotation;

        const annotationIndex = agent.window.__REACT_APP_ACTIONS__.annotations.findIndex(annotation => {
            return event === annotation.matcher?.nativeEvent || isMatch(event, annotation.matcher);
        });

        if (annotationIndex !== -1) {
            annotation = agent.window.__REACT_APP_ACTIONS__.annotations[annotationIndex];
            agent.window.__REACT_APP_ACTIONS__.annotations.splice(annotationIndex, 1);
        }

        agent.sendRecordingEvent(processHistoricalEvents(makeRecordingEvent(event, annotation)));
    }
}

function getAllFrames(windowElement, allFrames = []) {
    allFrames.push(windowElement.frames);

    Array.from(windowElement.frames).forEach(frame => {
        getAllFrames(frame, allFrames);
    });

    return allFrames;
}

function makeRecordingEvent(event, annotation = {}) {
    // TODO refactor that .get(1) thing
    const targetFiber = Cypress.AppActions.hook.renderers.get(1).findFiberByHostInstance(event.target);

    console.group(event.type);

    console.log('targetFiber', targetFiber, event.target);

    let currentFiberId = null;
    let driver = null;

    if (targetFiber) {
        const fiber = Cypress.AppActions.reactApi.findAncestorElementByPredicate(targetFiber, fiber => {
            const driver = getDriver(fiber);
            return driver && driver.pattern;
        });

        console.log('fiber', fiber);

        currentFiberId = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);
        driver = getDriver(fiber);
    }

    console.log('annotation', annotation);
    const recording = {
        id: currentFiberId,
        args: event.args ? event.args : [],
        patternName: driver ? driver.pattern : null,
        actionName: event.type,
        value: event.target.value,
        tagName: event.target.tagName,
        action: event.type,
        keyCode: event.keyCode ? event.keyCode : null,
        href: event.target.href ? event.target.href : null,
        coordinates: getCoordinates(event),
    };

    console.log('recording', recording);

    console.groupEnd();

    return recording;
}

// function getMockedSessionRecordEvent() {
//     return {
//         args: [],
//         patternName: null,
//         actionName: null,
//         id: null,
//         __MOCKED__: true,
//     };
// }

// function getFiberOfTarget(target, patternName, actionName) {
//     let targetFiber;
//     try {
//         targetFiber = Cypress.AppActions.reactApi.findFiber(target);
//     } catch (error) {
//         throw new Error(`Cannot find fiber for event target`);
//     }
//     const hasDriverWeNeed = fiber => {
//         const driver = getDriver(fiber);
//         return driver && driver.pattern === patternName && driver.actions?.[actionName];
//     };
//     return Cypress.AppActions.reactApi.findAncestorElementByPredicate(targetFiber, hasDriverWeNeed);
// }

function getCoordinates(event) {
    const eventsWithCoordinates = {
        mouseup: true,
        mousedown: true,
        mousemove: true,
        mouseover: true,
    };

    return eventsWithCoordinates[event.type] ? { x: event.clientX, y: event.clientY } : null;
}

let prev = null;

function processHistoricalEvents(current) {
    const result = [prev, current];
    prev = current;
    return result;

    // const target = event.nativeEvent?.target || event.target;
    // const fiber = getFiberOfTarget(target, patternName, actionName);
    // const fiberInfo = getFiberInfo(fiber);
    // const id = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);
    // const currentEvent = { args, patternName, actionName, id };
    // const [head, ...tail] = this._sessionRecordingEvents;
    // let result = [head, currentEvent];
    // if (fiberInfo.driver?.tunnel?.[actionName]) {
    //     // let's transform the last two events
    //     result = fiberInfo.driver?.tunnel?.[actionName](
    //         // when an event is null, we pass in a mocked object instead
    //         ...result.map(event => (event ? event : getMockedSessionRecordEvent())),
    //     );
    //     if (!result || !Array.isArray(result) || result.length !== 2) {
    //         throw new Error(`Tunnel function must return an array of two elements (${patternName}.${actionName})`);
    //     }
    // }
    // // reverting the mocked object back to null
    // result = result.map(event => (event && event.__MOCKED__ ? null : event));
    // const [prev, current] = result;
    // if (!prev && !current) {
    //     this._sessionRecordingEvents = tail;
    // } else if (!prev) {
    //     this._sessionRecordingEvents = [current, ...tail];
    // } else if (!current) {
    //     this._sessionRecordingEvents = [prev, ...tail];
    // } else {
    //     this._sessionRecordingEvents = [current, prev, ...tail];
    // }
}
