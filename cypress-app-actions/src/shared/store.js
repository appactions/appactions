import VendorStore from '../vendor/react-devtools-renderer-build/store';
import { inspectElement } from './backend-api';

export default class Store extends VendorStore {
    constructor(bridge, config) {
        super(bridge, config);

        this._idToRole = {};
        this._selectedElementID = null;

        this._bridge.addListener('inspectedElement', this.onInspectedElement);
    }

    get selectedElementID() {
        return this._selectedElementID;
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
}
