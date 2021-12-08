import VendorStore from '../vendor/react-devtools-renderer-build/store';

export default class Store extends VendorStore {
    constructor(bridge, config) {
        super(bridge, config);

        this.inspectedElement = null;

        this._bridge.addListener('inspectedElement', this.onInspectedElement);
    }

    onInspectedElement = data => {
        this.inspectedElement = data;
        this.emit('inspectedElement');
    };
}
