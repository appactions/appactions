import { createRoot, flushSync } from 'react-dom';
import Store from 'cypress-app-actions/src/vendor/react-devtools-renderer-build/storage';
import Bridge from './bridge/bridge';
import App from './panel/app';

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
                        event: msg.type, // bridge expects "event", but the extension is written for "type", not fixing that lol
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

        bridge.addListener('syncSelectionToNativeElementsPanel', () => {
            setBrowserSelectionFromReact();
        });

        bridge.addListener('connection-init', () => {
            bridge.send('connection-acknowledge');
        });

        bridge.send('connection-init', {
            tabId: chrome?.devtools?.inspectedWindow?.tabId,
        });

        render = () => {
            // this won't be appended to any document, content will be portaled to portalContainer
            root = createRoot(document.createElement('div'));

            // try {

            root.render(<App bridge={bridge} store={store} portalContainer={portalContainer} />);
            // } catch (e) {
            //     console.error(e);
            //     bridge.send('__error', e, !!bridge, !!store)
            // }
        };
    }

    initBridgeAndStore();

    function setBrowserSelectionFromReact() {
        // This is currently only called on demand when you press "view DOM".
        // In the future, if Chrome adds an inspect() that doesn't switch tabs,
        // we could make this happen automatically when you select another component.
        chrome.devtools.inspectedWindow.eval(
            '(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0 !== $0) ?' +
                '(inspect(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0), true) :' +
                'false',
            (didSelectionChange, evalError) => {
                if (evalError) {
                    console.error(evalError);
                }
            },
        );
    }

    function setReactSelectionFromBrowser() {
        // When the user chooses a different node in the browser Elements tab,
        // copy it over to the hook object so that we can sync the selection.
        chrome.devtools.inspectedWindow.eval(
            '(window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0 !== $0) ?' +
                '(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0 = $0, true) :' +
                'false',
            (didSelectionChange, evalError) => {
                if (evalError) {
                    console.error(evalError);
                } else if (didSelectionChange) {
                    // Remember to sync the selection next time we show Components tab.
                    needsToSyncElementSelection = true;
                }
            },
        );
    }

    setReactSelectionFromBrowser();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
        setReactSelectionFromBrowser();
    });

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
        flushSync(() => root.unmount());

        initBridgeAndStore();
    });
}

chrome.devtools.network.onNavigated.addListener(createPanelIfReactLoaded);

// Check to see if React has loaded once per second in case React is added
// after page load
const loadCheckInterval = setInterval(function () {
    createPanelIfReactLoaded();
}, 1000);

createPanelIfReactLoaded();
