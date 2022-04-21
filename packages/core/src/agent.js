import EventEmitter from './shared/event-emitter';
import { setupHighlighter } from './highlighter';
import { setupAssertMenu } from './assert-menu';
import { setupRecorder } from './recorder';
import { getFiberInfo, getOwnerPatterns, isFiberMounted } from './api';

export default class Agent extends EventEmitter {
    constructor(bridge) {
        super();

        this._bridge = bridge;
        this._rendererInterfaces = {};
        this._sessionRecordingEvents = [];
        this._isRecording = false;
        this._previousRecordEvent = null;
        this._idToOwners = new WeakMap();
        this.window = window.__APP_ACTIONS_TARGET_WINDOW__ || window;

        bridge.addListener('inspectElement', this.inspectElement);
        bridge.addListener('shutdown', this.shutdown);
        bridge.addListener('session-recording-toggle', this.toggleSessionRecording);
        bridge.addListener('session-recording-replay', this.replaySessionRecording);
        bridge.addListener('session-recording-clear', this.clearSessionRecording);
        bridge.addListener('session-recording-save', this.saveSessionRecording);

        setupHighlighter(bridge, this);
        setupAssertMenu(bridge, this);
        setupRecorder(bridge, this);
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
                    result.owners = getOwnerPatterns(fiber);

                    this.saveOwners(fiber, result.owners);

                    if (fiberInfo.driver.getName) {
                        result.name = fiberInfo.driver.getName(fiberInfo);
                    }
                }

                this._bridge.send('inspectedElement', {
                    ...meta,
                    value: result,
                });
            } catch (error) {
                console.error(error);
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

    get rendererInterfaces() {
        return this._rendererInterfaces;
    }

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
        this._isRecording = true;
        this._bridge.send('backend-ready');
    };

    toggleSessionRecording = () => {
        this._isRecording = !this._isRecording;
        this._bridge.send('session-recording-toggle', this._isRecording);
    };

    clearSessionRecording = () => {
        this._sessionRecordingEvents = [];

        this._bridge.send('session-recording-clear');
    };

    replaySessionRecording = () => {
        this._isRecording = false;
        this._bridge.send('session-recording-toggle', this._isRecording);
    };

    sendRecordingEvent = payload => {
        if (!this._isRecording) {
            return;
        }

        this._bridge.send('session-recording-event', payload);
    };

    saveSessionRecording = payload => {
        Cypress.backend('task', {
            task: 'saveSessionRecording',
            arg: payload,
            timeout: 4000,
        });
    };

    saveOwners = (fiber, owners) => {
        // TODO this should be a graph, so a new owner updates all the previous ones
        this._idToOwners.set(fiber, owners);
    };

    getOwners = fiber => {
        if (isFiberMounted(fiber)) {
            return getOwnerPatterns(fiber);
        } else if (this._idToOwners.has(fiber)) {
            return this._idToOwners.get(fiber);
        } else {
            return getOwnerPatterns(fiber);
        }
    };
}
