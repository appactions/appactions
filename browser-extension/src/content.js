let connection;

window.addEventListener('message', ({ data, isTrusted }) => {
    // Filter messages not from the exchange
    if (!isTrusted || data?.source !== 'exchange') {
        return;
    }

    const message = data;

    // Setup connection on init message
    if (message.type === 'connection-init') {
        connection = chrome.runtime.connect({ name: 'exchange' });
        connection.onMessage.addListener(handleMessage);
        connection.onDisconnect.addListener(handleDisconnect);
    }

    if (connection === undefined) {
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
