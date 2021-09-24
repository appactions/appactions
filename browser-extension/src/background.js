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

        addToTarget({ tabId, port, source: 'exchange' });
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
    }
};

/** Handle initial connection from devtools panel. */
const handleDevtoolsPanelConnection = port => {
    const source = 'devtools';
    const initialListener = msg => {
        if (msg.type !== 'connection-init') {
            return;
        }

        // tabId is required when working with chrome extension
        if (msg.tabId === undefined) {
            console.error('Recieved devtools panel connection but no tabId was specified.');
            return;
        }

        addToTarget({ tabId: msg.tabId, port, source });
        targets[msg.tabId].dispatchEvent(source, msg);

        port.onMessage.removeListener(initialListener);
    };

    port.onMessage.addListener(initialListener);
};

const connectionHandlers = {
    exchange: handleContentScriptConnection,
    devtools: handleDevtoolsPanelConnection,
};

chrome.runtime.onConnect.addListener(port => {
    const handler = connectionHandlers[port.name];
    return handler && handler(port);
});
