import VendorStore from '../vendor/react-devtools-renderer-build/store';
import { inspectElement } from './backend-api';

export default class Store extends VendorStore {
    constructor(bridge, config) {
        super(bridge, config);

        this._bridge = bridge;

        this._idToPattern = {};
        this._selectedElementID = null;
        this._isBackendReady = false;

        this._isRecording = false;
        this._sessionRecordingYAML = '';

        bridge.addListener('inspectedElement', this.onInspectedElement);
        bridge.addListener('backend-ready', this.onBackendReady);

        bridge.addListener('session-recording-yaml-change', this.onSessionRecordingYAMLChange);
        bridge.addListener('session-recording-toggle', this.onToggleSessionRecording);

        this.addListener('mutated', this.onMutation);
    }

    get selectedElementID() {
        return this._selectedElementID;
    }

    get isBackendReady() {
        return this._isBackendReady;
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

    onSessionRecordingYAMLChange = yaml => {
        this._sessionRecordingYAML = yaml;
        this.emit('session-recording-yaml-change');
    };

    onToggleSessionRecording = isRecording => {
        this._isRecording = isRecording;
        this.emit('session-recording-toggle');
    };
}
