import EventEmitter from './shared/event-emitter';
import { setupHighlighter } from './highlighter';
import { setupAssertMenu } from './assert-menu';
import { setupRecorder, makeAssertionEvent } from './recorder';
import { getFiberInfo, getOwnerPatterns, isFiberMounted } from './api';
import renderYAML from './recordings-to-yaml';

export default class Agent extends EventEmitter {
    constructor(bridge) {
        super();

        this._bridge = bridge;
        this._rendererInterfaces = {};
        this._sessionRecordingEvents = [];
        this._previousRecordEvent = null;
        this.window = window.__APP_ACTIONS_TARGET_WINDOW__ || window;

        this._isRecording = false;
        this._sessionRecordingDb = [];
        this._sessionRecordingNestingDepth = 0;
        this._sessionRecordingMeta = {
            description: undefined,
            start: {
                route: '/',
                auth: false,
            },
        };

        bridge.addListener('inspectElement', this.inspectElement);
        bridge.addListener('shutdown', this.shutdown);

        bridge.addListener('session-recording-toggle', this.onToggleSessionRecording);
        bridge.addListener('session-recording-clear', this.onSessionRecordingClear);
        bridge.addListener('session-recording-replay', this.onReplaySessionRecording);
        bridge.addListener('session-recording-save', this.onSaveSessionRecording);
        bridge.addListener('session-recording-assert', this.onSessionRecordingAssert);

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

                const fiber = renderer.findCurrentFiberUsingSlowPathById(id);
                const fiberInfo = getFiberInfo(fiber);
                if (fiberInfo.driver) {
                    result.pattern = fiberInfo.driver.pattern;
                    result.actions = Object.keys(fiberInfo.driver.actions);
                    result.key = fiber.key;
                    result.asserts = Object.entries(fiberInfo.driver.asserts).map(([name, { test, input }]) => ({
                        name,
                        test,
                        input,
                    }));
                    result.simplify = Object.entries(fiberInfo.driver.simplify).map(([name, { start, end }]) => ({
                        name,
                        start,
                        end,
                    }));
                    result.owners = getOwnerPatterns(fiber);

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
        this.sendYAML();
    };

    onToggleSessionRecording = () => {
        this._isRecording = !this._isRecording;
        this._bridge.send('session-recording-toggle', this._isRecording);
    };

    onReplaySessionRecording = () => {
        throw new Error('Not implemented');
    };

    onSaveSessionRecording = () => {
        const content = this.generateYAML();
        const fileName = `recorded_${new Date().toISOString().replace('T', '_').substring(0, 19)}.yml`;
        Cypress.backend('task', {
            task: 'saveSessionRecording',
            arg: { content, fileName },
            timeout: 4000,
        });
    };

    onSessionRecordingClear = () => {
        this._sessionRecordingDb = [];
        this.sendYAML();
    };

    getOwners = fiber => {
        if (isFiberMounted(fiber)) {
            return getOwnerPatterns(fiber);
        }

        return Cypress.AppActions.hook.getUnmountedOwners(fiber);
    };

    generateYAML = () => {
        try {
            return renderYAML({ agent: this, meta: this._sessionRecordingMeta, recordings: this._sessionRecordingDb });
        } catch (error) {
            console.error(error);
            return `# Error: ${error.message}`;
        }
    };

    sendYAML = () => {
        this._bridge.send('session-recording-yaml-change', this.generateYAML());
    };

    sendRecordingEvent = recording => {
        if (!this._isRecording) {
            return;
        }

        this._sessionRecordingDb = [...this._sessionRecordingDb, recording];

        // console.log('recordings', this._sessionRecordingDb);

        if (!this._sessionRecordingMeta.description) {
            this._sessionRecordingMeta.description = `Test recorded at ${new Date().toLocaleString()}`;
        }

        this.sendYAML();
    };

    onSessionRecordingAssert = ({ id, action, args, value }) => {
        const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);
        const owners = this.getOwners(fiber);
        const assert = makeAssertionEvent({ action, args, value, owners });

        this.sendRecordingEvent(assert);
    };

    getSimplifyForPattern = pattern => {
        return this.window.__REACT_APP_ACTIONS__.simplify.get(pattern);
    };
}
