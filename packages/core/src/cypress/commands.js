import { register as registerDo } from './cypress-do';
import { register as registerWith } from './cypress-with';
import { addVDOMUtilsToJQuery } from '../add-vdom-utils-to-jquery';
import { installHook } from '../hook';
import { activateBackend } from '../backend';

export function registerCypressCommands(config) {
    Cypress.AppActions.setConfig(config);

    Cypress.on('window:before:load', win => {
        Cypress.AppActions.hook = installHook(win);
        activateBackend(win);
    });

    registerWith('with');
    registerDo('do', { returnValueIsSubject: true });
    registerDo('read', { returnValueIsSubject: false });

    addVDOMUtilsToJQuery(Cypress.$);
}
