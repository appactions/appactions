import React, { useMemo, useCallback } from 'react';
import { useStore } from './hooks';

export default function SessionRecording() {
    const sessionRecordingDb = useStore('session-recording-event', store => store.sessionRecordingDb);

    return (
        <ul>
            {sessionRecordingDb.map((line, index) => (
                <li key={index}>{JSON.stringify(line)}</li>
            ))}
        </ul>
    );
}
