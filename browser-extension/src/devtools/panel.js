import React, { useEffect } from 'react';
// import Tree from './tree';
import RoleTree from './role-tree';
import portaledContent from './portaled-content';
import SplitView from './split-view';

const Panel = () => {
    return (
        <>
            <SplitView left={<RoleTree />} right={<h2>Sidepanel</h2>} />
        </>
    );
};

export default portaledContent(Panel);
