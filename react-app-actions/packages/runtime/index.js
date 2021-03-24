import { installBackend } from './install-backend';
import { dispatch } from './dispatch';
import get from 'lodash.get';

export default {
    installBackend,
    dispatch,
    utils: {
        get,
    },
};
