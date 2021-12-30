import EventEmitter from './shared/event-emitter';
import { setupHighlighter } from './highlighter';
import { getDriver } from './api';

export default class Agent extends EventEmitter {
    constructor(bridge) {
        super();

        this._bridge = bridge;
        this._rendererInterfaces = {};

        bridge.addListener('inspectElement', this.inspectElement);
        bridge.addListener('shutdown', this.shutdown);

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
                    actions: [],
                };

                const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);
                const driver = getDriver(fiber);
                if (driver) {
                    result.pattern = driver.pattern;
                    result.actions = Object.keys(driver.actions || {});
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

    onSessionRecordingEvent = payload => {
        const { args, patternName, actionName, event } = payload;
        const targetFiber = Cypress.AppActions.reactApi.findFiber(event.target);
        const hasDriverWeNeed = fiber => {
            const driver = getDriver(fiber);
            return driver && driver.pattern === patternName && driver.actions?.[actionName];
        };
        const fiber = Cypress.AppActions.reactApi.findAncestorElementByPredicate(targetFiber, hasDriverWeNeed);
        const id = Cypress.AppActions.reactApi.getOrGenerateFiberID(fiber);

        this._bridge.send('session-recording-event', { args, patternName, actionName, id });
    };
}
