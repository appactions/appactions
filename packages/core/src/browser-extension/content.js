let connection;

window.addEventListener('message', ({ data: message, isTrusted }) => {
    // Filter messages not from the agent
    if (!isTrusted || message?.source !== 'agent') {
        return;
    }

    // Setup connection on init message
    if (message.type === 'connection-init') {
        connection = chrome.runtime.connect({ name: 'agent' });
        connection.onMessage.addListener(handleMessage);
        connection.onDisconnect.addListener(handleDisconnect);
    }

    if (!connection) {
        return console.warn('Unable to send message to App Actions extension');
    }

    // Forward message to devtools
    connection.postMessage(message);
});

/** Handle message from background script. */
const handleMessage = message => {
    window.postMessage(message, window.location.origin);
};

/** Handle disconnect from background script. */
const handleDisconnect = () => {
    connection = undefined;
};

document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'assert-menu-iframe';
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10000000,
        border: 'none',
        display: 'none',
    });
    iframe.src = chrome.runtime.getURL('assert.html');
    document.body.appendChild(iframe);
});
