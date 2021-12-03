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

    Cypress.AppActions.sendMessage = (type, payload) => {
        window.parent.postMessage({
            source: 'agent',
            type,
            payload,
        });
    };

    window.parent.addEventListener('message', ({ data, isTrusted }) => {
        // Filter messages not from the agent
        if (!isTrusted || data?.source !== 'devtools') {
            return;
        }

        if (data?.type === 'connection-init' || data?.type === 'connection-disconnect') {
            return;
        }

        console.log('[Devtools] message:', data.payload);
    });
}
