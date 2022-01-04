import EventEmitter from './shared/event-emitter';
import { setupHighlighter } from './highlighter';
import { getDriver, getFiberInfo } from './api';

function getMockedSessionRecordEvent() {
    return {
        args: [],
        patternName: null,
        actionName: null,
        id: null,
        __MOCKED__: true,
    };
}

export default class Agent extends EventEmitter {
    constructor(bridge) {
        super();

        this._bridge = bridge;
        this._rendererInterfaces = {};
        this._sessionRecordingEvents = [];
        this._isRecording = false;

        bridge.addListener('inspectElement', this.inspectElement);
        bridge.addListener('shutdown', this.shutdown);
        bridge.addListener('session-recording-toggle', this.toggleSessionRecording);
        bridge.addListener('session-recording-replay', this.replaySessionRecording);
        bridge.addListener('session-recording-clear', this.clearSessionRecording);

        setupHighlighter(bridge, this);
    }

    inspectElement = ({ id, path, rendererID, requestID }) => {
        const renderer = this._rendererInterfaces[rendererID];
        if (renderer == null) {
            console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
        } else {
            try {
                const { value: inspection = {}, ...meta } = renderer.inspectElement(requestID, id, path, true);

                const result = {
                    id,
                    displayName: inspection.displayName,
                    source: inspection.source,
                    rendererPackageName: inspection.rendererPackageName,
                    rendererVersion: inspection.rendererVersion,

                    // driver
                    pattern: null,
                    name: null,
                    actions: [],
                };

                const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);
                const fiberInfo = getFiberInfo(fiber);
                if (fiberInfo.driver) {
                    result.pattern = fiberInfo.driver.pattern;
                    result.actions = Object.keys(fiberInfo.driver.actions || {});

                    if (fiberInfo.driver.getName) {
                        result.name = fiberInfo.driver.getName(fiberInfo);
                    }
                }

                this._bridge.send('inspectedElement', {
                    ...meta,
                    value: result,
                });
            } catch (error) {
                this._bridge.send('inspectedElement', {
                    type: 'error',
                    id,
                    responseID: requestID,
                    message: error.message,
                    stack: error.stack,
                });
            }
        }
    };

    shutdown = () => {
        // Clean up the overlay if visible, and associated events.
        this.emit('shutdown');
    };

    setRendererInterface = (rendererID, rendererInterface) => {
        this._rendererInterfaces[rendererID] = rendererInterface;
    };

    onUnsupportedRenderer(rendererID) {
        this._bridge.send('unsupportedRendererVersion', rendererID);
    }

    onFastRefreshScheduled = () => {
        this._bridge.send('fastRefreshScheduled');
    };

    onHookOperations = operations => {
        this._bridge.send('operations', operations);
    };

    onTraceUpdates = nodes => {
        this.emit('traceUpdates', nodes);
    };

    onBackendReady = () => {
        this._bridge.send('backend-ready');
    };

    toggleSessionRecording = () => {
        this._isRecording = !this._isRecording;
        this._bridge.send('session-recording-toggle', this._isRecording);
    }

    clearSessionRecording = () => {
        this._sessionRecordingEvents = [];

        this._bridge.send('session-recording-clear');
    }

    replaySessionRecording = () => {
        this._isRecording = false;
        this._bridge.send('session-recording-toggle', this._isRecording);
    }

    onSessionRecordingEvent = payload => {
        if (!this._isRecording) {
            return;
        }

        const { args, patternName, actionName, event } = payload;
        const target = event.nativeEvent?.target || event.target;

        const fiber = getFiberOfTarget(target, patternName, actionName);
        const fiberInfo = getFiberInfo(fiber);
        const id = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);

        const currentEvent = { args, patternName, actionName, id };

        const [head, ...tail] = this._sessionRecordingEvents;

        let result = [head, currentEvent];

        if (fiberInfo.driver?.tunnel?.[actionName]) {
            // let's transform the last two events
            result = fiberInfo.driver?.tunnel?.[actionName](
                // when an event is null, we pass in a mocked object instead
                ...result.map(event => (event ? event : getMockedSessionRecordEvent())),
            );

            if (!result || !Array.isArray(result) || result.length !== 2) {
                throw new Error(`Tunnel function must return an array of two elements (${patternName}.${actionName})`);
            }
        }

        // reverting the mocked object back to null
        result = result.map(event => (event && event.__MOCKED__ ? null : event));

        const [prev, current] = result;

        if (!prev && !current) {
            this._sessionRecordingEvents = tail;
        } else if (!prev) {
            this._sessionRecordingEvents = [current, ...tail];
        } else if (!current) {
            this._sessionRecordingEvents = [prev, ...tail];
        } else {
            this._sessionRecordingEvents = [current, prev, ...tail];
        }

        this._bridge.send('session-recording-event', [prev, current]);
    };
}

function getFiberOfTarget(target, patternName, actionName) {
    let targetFiber;
    try {
        targetFiber = Cypress.AppActions.reactApi.findFiber(target);
    } catch (error) {
        throw new Error(`Cannot find fiber for event target`);
    }
    const hasDriverWeNeed = fiber => {
        const driver = getDriver(fiber);
        return driver && driver.pattern === patternName && driver.actions?.[actionName];
    };
    return Cypress.AppActions.reactApi.findAncestorElementByPredicate(targetFiber, hasDriverWeNeed);
}
