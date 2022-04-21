import VendorStore from '../vendor/react-devtools-renderer-build/store';
import { inspectElement } from './backend-api';
import renderYAML from '../recordings-to-yaml';

export default class Store extends VendorStore {
    constructor(bridge, config) {
        super(bridge, config);

        this._idToPattern = {};
        this._selectedElementID = null;
        this._isBackendReady = false;
        this._isRecording = false;

        this._sessionRecordingDb = [];
        this._sessionRecordingYAML = '# empty test';
        this._sessionRecordingMeta = {
            description: undefined,
            start: {
                route: '/',
                auth: false,
            },
        };

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

    get sessionRecordingYAML() {
        return this._sessionRecordingYAML;
    }

    get isRecording() {
        return this._isRecording;
    }

    onInspectedElement = data => {
        if (data.type === 'full-data') {
            this._idToPattern[data.id] = data.value;
            this.emit('inspectedElement');
        }
    };

    getPatternByID = id => {
        return this._idToPattern[id] || null;
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

            this._idToPattern[data.id] = data.value;
            this.emit('selectionChange');
        } catch (error) {
            console.error(error);
        }
    };

    onMutation = ([addedElementIDs]) => {
        addedElementIDs.forEach(async id => {
            if (!this._idToPattern[id]) {
                try {
                    const rendererID = this.getRendererIDForElement(id);

                    const data = await inspectElement({
                        bridge: this._bridge,
                        id,
                        path: null,
                        rendererID,
                    });

                    this._idToPattern[data.id] = data.value;
                    this.emit('newElementAdded');
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    onBackendReady = () => {
        this._isBackendReady = true;
        this._isRecording = true;
        this.emit('backend-ready');
    };

    onSessionRecordingEvent = ([prev, current]) => {
        this._sessionRecordingDb = this._sessionRecordingDb.slice(0, -1).concat([prev, current].filter(Boolean));

        if (!this._sessionRecordingMeta.description) {
            this._sessionRecordingMeta.description = `Test recorded at ${new Date().toLocaleString()}`;
        }

        this._sessionRecordingYAML = renderYAML(this._sessionRecordingMeta, this._sessionRecordingDb);

        this.emit('session-recording-yaml-change');
    };

    onSessionRecordingToggle = isRecording => {
        this._isRecording = isRecording;
        this.emit('session-recording-toggle');
    };

    onSessionRecordingClear = () => {
        this._sessionRecordingDb = [];
        this._sessionRecordingYAML = '# empty test';
        this.emit('session-recording-yaml-change');
    };
}
