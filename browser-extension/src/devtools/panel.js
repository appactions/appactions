import React, { useEffect } from 'react';
// import Tree from './tree';
import RoleTree from './role-tree';
import portaledContent from './portaled-content';

const Panel = () => {
    return (
        <>
            <RoleTree />
        </>
    );
};

export default portaledContent(Panel);
