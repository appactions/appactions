import EventEmitter from './shared/event-emitter';

export default class Agent extends EventEmitter {
    constructor(bridge) {
        super();

        this._bridge = bridge;
        this._rendererInterfaces = {};

        bridge.addListener('inspectElement', this.inspectElement);
        bridge.addListener('shutdown', this.shutdown);
    }

    inspectElement = ({ forceFullData, id, path, rendererID, requestID }) => {
        console.log('inspect element', {
            forceFullData,
            id,
            path,
            rendererID,
            requestID,
        });
        const renderer = this._rendererInterfaces[rendererID];
        if (renderer == null) {
            console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
        } else {
            this._bridge.send('inspectedElement', renderer.inspectElement(requestID, id, path, forceFullData));
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
}
