import React from 'react';
import { useStore } from './hooks';
import AssertButton from './assert-button';
import RecordControls from './record-controls';
import Highlight from 'react-highlight';

export default function SessionRecordingPanel() {
    const yaml = useStore('session-recording-yaml-change', store => store.sessionRecordingYAML);

    return (
        <div className="pt-2 pl-2">
            <div className="inline-flex gap-x-2">
                <RecordControls />
                <AssertButton />
            </div>
            <div className="my-2" style={{ maxWidth: 'calc(100% - 5px)' }}>
                <Highlight className="yaml">{yaml}</Highlight>
            </div>
        </div>
    );
}
