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

            const nesting = this.handleNesting(
                this._sessionRecordingDb.slice(nestingStartIndex, this._sessionRecordingDb.length),
                this._sessionRecordingDb,
            );

            this._sessionRecordingDb = [...this._sessionRecordingDb.slice(0, nestingStartIndex), ...nesting];
        }

        // if there are at least two items, check if the last two can be merged
        if (this._sessionRecordingDb.length > 1) {
            const newItems = merger([
                this._sessionRecordingDb[this._sessionRecordingDb.length - 2],
                this._sessionRecordingDb[this._sessionRecordingDb.length - 1],
            ]);
            
            this._sessionRecordingDb = [...this._sessionRecordingDb.slice(0, -2), ...newItems];
        }

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
            assert: {
                [action]: {
                    test,
                    value,
                },
            },
        };

        this.sendRecordingEvent(assert);
    };

    handleNestingStart = recording => {
        console.log('handleNestingStart');
        return {
            ...recording,
            depth: ++this._sessionRecordingNestingDepth,
            nestingStart: true,
        };
    };

    handleNestingEnd = (recording, simplify, owners) => {
        console.log('handleNestingEnd', simplify, owners);
        return {
            ...recording,
            owners,
            depth: this._sessionRecordingNestingDepth--,
            nestingEnd: true,
            simplify,
        };
    };

    handleNesting = collection => {
        const nestingEnd = collection[collection.length - 1];
        const { pattern, action } = nestingEnd.simplify;
        const simplify = this.window.__REACT_APP_ACTIONS__.simplify.get(nestingEnd.simplify.pattern);
        let args = [];
        try {
            args = simplify[action].collect(new Generator(collection));
        } catch (e) {
            console.error(e);
            console.log('collection', collection);
        }
        const recording = {
            ...nestingEnd,

            pattern,
            action,
            args,
        };

        return [recording];
    };
}

class Generator {
    constructor(collection) {
        this.collection = collection;
        this.index = 0;
    }

    query = ({ pattern, action, name }) => {
        const matches = this.collection.filter(recording => {
            if (name && name !== recording.name) {
                return false;
            }

            if (pattern && pattern !== recording.pattern) {
                return false;
            }

            if (action && action !== recording.action) {
                return false;
            }

            return true;
        });

        if (matches.length === 0) {
            return [];
        }

        if (matches.length > 1) {
            throw new Error('Multiple matches');
        }

        return matches[0].args;
    };
}
