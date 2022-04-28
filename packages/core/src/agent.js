import EventEmitter from './shared/event-emitter';
import { setupHighlighter } from './highlighter';
import { setupAssertMenu } from './assert-menu';
import { setupRecorder, merger } from './recorder';
import { getFiberInfo, getOwnerPatterns, isFiberMounted } from './api';
import renderYAML from './recordings-to-yaml';

export default class Agent extends EventEmitter {
    constructor(bridge) {
        super();

        this._bridge = bridge;
        this._rendererInterfaces = {};
        this._sessionRecordingEvents = [];
        this._previousRecordEvent = null;
        this._idToOwners = new WeakMap();
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

                const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);
                const fiberInfo = getFiberInfo(fiber);
                if (fiberInfo.driver) {
                    result.pattern = fiberInfo.driver.pattern;
                    result.actions = Object.keys(fiberInfo.driver.actions);
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

    generateYAML = () => {
        return renderYAML(this._sessionRecordingMeta, this._sessionRecordingDb);
    };

    sendYAML = () => {
        this._bridge.send('session-recording-yaml-change', this.generateYAML());
    };

    sendRecordingEvent = recording => {
        if (!this._isRecording) {
            return;
        }

        this._sessionRecordingDb = [...this._sessionRecordingDb, recording];

        if (recording.nestingEnd) {
            let nestingStartIndex = this._sessionRecordingDb.length - 1;
            for (; nestingStartIndex >= 0; nestingStartIndex--) {
                if (
                    this._sessionRecordingDb[nestingStartIndex].nestingStart &&
                    this._sessionRecordingDb[nestingStartIndex].depth === recording.depth
                ) {
                    break;
                }
            }

            const nesting = foobar(this._sessionRecordingDb.slice(nestingStartIndex, this._sessionRecordingDb.length));

            this._sessionRecordingDb = [...this._sessionRecordingDb.slice(0, nestingStartIndex), ...nesting];
        }

        const newItems = merger([
            this._sessionRecordingDb[this._sessionRecordingDb.length - 2],
            this._sessionRecordingDb[this._sessionRecordingDb.length - 1],
        ]);

        this._sessionRecordingDb = [...this._sessionRecordingDb.slice(0, -2), ...newItems];

        if (!this._sessionRecordingMeta.description) {
            this._sessionRecordingMeta.description = `Test recorded at ${new Date().toLocaleString()}`;
        }

        this.sendYAML();
    };

    onSessionRecordingAssert = payload => {
        const { id, action, test, value } = payload;
        const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);

        const owners = this.getOwners(fiber);

        const assert = {
            type: 'assert',
            id,
            owners,
            action,
            test,
            value,
        };

        this.sendRecordingEvent(assert);
    };

    handleNestingStart = (recording, simplify, owners) => {
        console.log('handleNestingStart', simplify);
        return {
            ...recording,
            owners,
            depth: ++this._sessionRecordingNestingDepth,
            nestingStart: true,
            simplify,
        };
    };

    handleNestingEnd = (recording, simplify, owners) => {
        console.log('handleNestingEnd', simplify);
        return {
            ...recording,
            owners,
            depth: this._sessionRecordingNestingDepth--,
            nestingEnd: true,
            simplify,
        };
    };
}

function foobar(arr) {
    const nestingEnd = arr[arr.length - 1];
    const { pattern, action } = nestingEnd.simplify;
    // debugger;
    const recording = {
        ...nestingEnd,

        pattern,
        action,
        args: ['TODO'],
    };

    return [recording];
}
