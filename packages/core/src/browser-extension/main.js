import ReactDOM from 'react-dom';
import Bridge from '../shared/bridge';
import Store from '../shared/store';
import App from './devtools/app';

let panelCreated = false;

function createPanelIfReactLoaded() {
    if (panelCreated) {
        return;
    }

    panelCreated = true;

    clearInterval(loadCheckInterval);

    let bridge = null;
    let store = null;
    let root = null;
    let render = null;

    let needsToSyncElementSelection = false;

    let portalContainer = null; // portal for the panel

    function initBridgeAndStore() {
        const connection = chrome.runtime.connect({ name: 'devtools' });

        bridge = new Bridge({
            listen(fn) {
                const handleMessage = msg => {
                    if (msg?.source !== 'agent') {
                        return;
                    }

                    fn({
                        type: msg.type,
                        payload: msg.payload,
                    });
                };

                connection.onMessage.addListener(handleMessage);
                return () => connection.onMessage.removeListener(handleMessage);
            },
            send(type, payload) {
                connection.postMessage({ source: 'devtools', type, payload });
            },
        });

        store = new Store(bridge);

        bridge.addListener('connection-init', () => {
            bridge.send('connection-acknowledge');
        });

        bridge.send('connection-init', {
            tabId: chrome.devtools.inspectedWindow.tabId,
        });

        render = () => {
            // this won't be appended to any document, content will be portaled to portalContainer
            root = document.createElement('div');

            ReactDOM.render(<App store={store} bridge={bridge} portalContainer={portalContainer} />, root);
        };
    }

    initBridgeAndStore();

    chrome.devtools.panels.create('App Actions', '', 'panel.html', extensionPanel => {
        extensionPanel.onShown.addListener(panel => {
            if (needsToSyncElementSelection) {
                needsToSyncElementSelection = false;
                bridge.send('syncSelectionFromNativeElementsPanel');
            }

            portalContainer = panel.container; // panel is pointing to the window object of the devtools panel

            if (portalContainer) {
                render();
            }
        });
        //         extensionPanel.onHidden.addListener(panel => {
        //             // TODO: Stop highlighting and stuff.
        //         });
    });

    chrome.devtools.network.onNavigated.removeListener(createPanelIfReactLoaded);

    // Re-initialize DevTools panel when a new page is loaded.
    chrome.devtools.network.onNavigated.addListener(function onNavigated() {
        // clean up potential stale state
        if (root) {
            ReactDOM.unmountComponentAtNode(root);
            root = null;
        }

        initBridgeAndStore();
        render();
    });
}

chrome.devtools.network.onNavigated.addListener(createPanelIfReactLoaded);

// Check to see if React has loaded once per second in case React is added
// after page load
const loadCheckInterval = setInterval(function () {
    createPanelIfReactLoaded();
}, 1000);

createPanelIfReactLoaded();
