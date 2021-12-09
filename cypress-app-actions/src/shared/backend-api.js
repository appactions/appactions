const TIMEOUT_DELAY = 5000;

let requestCounter = 0;

export function inspectElement({ bridge, id, path, rendererID }) {
    const requestID = requestCounter++;
    const promise = getPromiseForRequestID(
        requestID,
        'inspectedElement',
        bridge,
        `Timed out while inspecting element ${id}.`,
    );

    bridge.send('inspectElement', {
        id,
        path,
        rendererID,
        requestID,
    });

    return promise;
}

function getPromiseForRequestID(requestID, eventType, bridge, timeoutMessage) {
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            bridge.removeListener(eventType, onInspectedElement);

            clearTimeout(timeoutID);
        };

        const onInspectedElement = data => {
            if (data.responseID === requestID) {
                cleanup();
                resolve(data);
            }
        };

        const onTimeout = () => {
            cleanup();
            reject(new Error(timeoutMessage));
        };

        bridge.addListener(eventType, onInspectedElement);

        const timeoutID = setTimeout(onTimeout, TIMEOUT_DELAY);
    });
}
