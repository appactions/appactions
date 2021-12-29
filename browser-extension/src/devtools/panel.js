import React, { useEffect } from 'react';
// import Tree from './tree';
import RoleTree from './role-tree';
import SessionRecording from './session-recording';
import portaledContent from './portaled-content';
import SplitView from './split-view';
import SidePanel from './side-panel'

const Panel = () => {
    return (
        <SplitView
            left={
                <div className="m-4">
                    <RoleTree />
                </div>
            }
            right={
                <div className="m-4">
                    <SessionRecording />
                </div>
            }
        />
    );
};

export default portaledContent(Panel);
