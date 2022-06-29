import React, { useEffect } from 'react';

const callback = mutationList => {
    console.log('-------')
    for (const mutation of mutationList) {
        if (mutation.addedNodes.length > 0) {
            console.log('mutation', mutation);
        }
    }
};

const config = {
    childList: true,
    subtree: true,
};

const targetNode = document.getElementById('gameport');

export default function App() {
    useEffect(() => {
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        return () => observer.disconnect();
    }, []);
    return <h1>YOLO</h1>;
}
