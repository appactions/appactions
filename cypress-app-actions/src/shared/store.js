import VendorStore from '../vendor/react-devtools-renderer-build/store';
import { inspectElement } from './backend-api';

export default class Store extends VendorStore {
    constructor(bridge, config) {
        super(bridge, config);

        this._idToRole = {};
        this._selectedElementID = null;
        this._isBackendReady = false;
        this._isRecording = false;

        this._sessionRecordingDb = [];

        this._bridge.addListener('inspectedElement', this.onInspectedElement);
        this._bridge.addListener('backend-ready', this.onBackendReady);
        this._bridge.addListener('session-recording-event', this.onSessionRecordingEvent);
        this._bridge.addListener('session-recording-toggle', this.onSessionRecordingToggle);
        this._bridge.addListener('session-recording-clear', this.onSessionRecordingClear);

        this.addListener('mutated', this.onMutation);
    }

    get selectedElementID() {
        return this._selectedElementID;
    }

    get isBackendReady() {
        return this._isBackendReady;
    }

    get sessionRecordingDb() {
        return this._sessionRecordingDb;
    }

    get isRecording() {
        return this._isRecording;
    }

    onInspectedElement = data => {
        if (data.type === 'full-data') {
            this._idToRole[data.id] = data.value;
            this.emit('inspectedElement');
        }
    };

    getRoleByID = id => {
        return this._idToRole[id] || null;
    };

    selectElement = async id => {
        this._selectedElementID = id;
        this.emit('selectionChange');

        try {
            const rendererID = this.getRendererIDForElement(id);

            const data = await inspectElement({
                bridge: this._bridge,
                id,
                path: null,
                rendererID,
            });

            this._idToRole[data.id] = data.value;
            this.emit('selectionChange');
        } catch (error) {
            console.error(error);
        }
    };

    onMutation = ([addedElementIDs]) => {
        addedElementIDs.forEach(async id => {
            if (!this._idToRole[id]) {
                try {
                    const rendererID = this.getRendererIDForElement(id);

                    const data = await inspectElement({
                        bridge: this._bridge,
                        id,
                        path: null,
                        rendererID,
                    });

                    this._idToRole[data.id] = data.value;
                    this.emit('newElementAdded');
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    onBackendReady = () => {
        this._isBackendReady = true;
        this.emit('backend-ready');
    };

    onSessionRecordingEvent = ([prev, current]) => {
        this._sessionRecordingDb = this._sessionRecordingDb.slice(0, -1).concat([prev, current].filter(Boolean));

        this.emit('session-recording-event');
    };

    onSessionRecordingToggle = isRecording => {
        this._isRecording = isRecording;
        this.emit('session-recording-toggle');
    }

    onSessionRecordingClear = () => {
        this._sessionRecordingDb = [];
        this.emit('session-recording-event');
    }
}
