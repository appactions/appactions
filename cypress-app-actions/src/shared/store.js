import VendorStore from '../vendor/react-devtools-renderer-build/store';

export default class Store extends VendorStore {
    constructor(bridge, config) {
        super(bridge, config);

        this._bridge.addListener('inspectedElement', this.inspectedElement);
    }

    inspectedElement(data) {
        console.log('inspectedElement', data);
    }
}
