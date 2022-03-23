/** Collection of targets grouped by tabId. */
const targets = {};

class BackgroundEventTarget {
    constructor() {
        this.listeners = {};
    }

    addEventListener(source, callback) {
        this.listeners[source] = callback;
    }

    removeEventListener(source) {
        this.listeners[source] = undefined;
    }

    /** Dispatches event to all listeners excluding source */
    dispatchEvent(source, event) {
        const targets = { ...this.listeners, [source]: undefined };
        console.log(
            'dispatching an event from',
            source,
            'to',
            Object.keys(targets).filter(key => targets[key]),
            event,
        );
        Object.values(targets).forEach(f => f && f(event));
    }

    connectedSources() {
        return Object.keys(this.listeners);
    }
}

/** Ensures all messages are forwarded to and from tab connections. */
const addToTarget = ({ tabId, port, source }) => {
    if (targets[tabId] === undefined) {
        targets[tabId] = new BackgroundEventTarget();
    }

    const target = targets[tabId];
    const portName = port.name;

    target.addEventListener(portName, a => port.postMessage(a));

    port.onMessage.addListener(e => {
        target.dispatchEvent(portName, e);
    });
    port.onDisconnect.addListener(() => {
        target.removeEventListener(portName);
        target.dispatchEvent(portName, { type: 'connection-disconnect', source });
    });
};

/** Handle initial connection from content script. */
const handleContentScriptConnection = port => {
    if (port?.sender?.tab?.id) {
        const tabId = port.sender.tab.id;

        addToTarget({ tabId, port, source: 'agent' });
        // chrome.pageAction.setIcon({ tabId, path: "/assets/icon-32.png" });
        // port.onDisconnect.addListener(() => {
        //   chrome.pageAction.setIcon(
        //     {
        //       tabId,
        //       path: "/assets/icon-disabled-32.png",
        //     },
        //     () => true
        //   );
        // });

        chrome.webNavigation.getAllFrames({ tabId }, frames => {
            console.log('getAllFrames', tabId, frames);
            const appFrameId = frames.find(
                frame => frame.parentFrameId === 0 && !frame.url.includes('/__cypress/'),
            )?.frameId;

            console.log('appFrameId', appFrameId);

            chrome.tabs.executeScript(tabId, {
                frameId: appFrameId,
                code: "window.__FOOBAR__ = 'foobar';",
            });
        });
    }
};

/** Handle initial connection from devtools panel. */
const handleDevtoolsPanelConnection = port => {
    const source = 'devtools';
    const initialListener = msg => {
        if (msg.type !== 'connection-init') {
            return;
        }

        const tabId = msg?.payload?.tabId;

        // tabId is required when working with chrome extension
        if (!tabId) {
            console.error('Recieved devtools panel connection but no tabId was specified.', msg);
            return;
        }

        addToTarget({ tabId, port, source });
        targets[tabId].dispatchEvent(source, msg);

        port.onMessage.removeListener(initialListener);
    };

    port.onMessage.addListener(initialListener);
};

const connectionHandlers = {
    agent: handleContentScriptConnection,
    devtools: handleDevtoolsPanelConnection,
};

chrome.runtime.onConnect.addListener(port => {
    const handler = connectionHandlers[port.name];
    return handler && handler(port);
});
