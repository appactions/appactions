import React, { useEffect } from 'react';
// import Tree from './tree';
import RoleTree from './role-tree';
import portaledContent from './portaled-content';
import SplitView from './split-view';

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
                    <h2>Sidepanel</h2>
                </div>
            }
        />
    );
};

export default portaledContent(Panel);
