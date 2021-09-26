import '../polyfill';
import { register as registerDo } from './cypress-do';
import { register as registerWith } from './cypress-with';
import { addVDOMUtilsToJQuery } from '../add-vdom-utils-to-jquery';
import { installReactDevtoolsHook } from '../agent';

export function registerCypressCommands(config = {}) {
    const { withCommandName = 'with', doCommandName = 'do', $ = Cypress.$, defaultIsLoading } = config;

    Cypress.on('window:before:load', win => {
        installReactDevtoolsHook(win);
    });

    registerWith(withCommandName, { defaultIsLoading });
    registerDo(doCommandName);

    addVDOMUtilsToJQuery($);

    window.parent.postMessage({
        type: 'connection-init',
        source: 'agent',
    });

    Cypress.AppActions.sendMessage = payload => {
        window.parent.postMessage({
            source: 'agent',
            payload,
        });
    };
}
