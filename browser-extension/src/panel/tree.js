import React, { useState, useCallback } from 'react';
import { useDevtoolsContext } from './context';

const treeData = [
    {
        key: '0-0',
        title: 'root',
        description: '#__next',
        children: [
            { key: '0-0-0', title: 'Logo' },
            {
                key: '0-0-1',
                title: 'Link',
                description: 'Dashboard',
            },
            {
                key: '0-0-2',
                title: 'Button',
                description: 'Sign in',
            },
            { key: '0-0-3', title: 'Filter' },
            {
                key: '0-0-4',
                title: 'Grid',
                children: [
                    {
                        key: '0-1-0',
                        title: 'Card',
                        description: 'BREDA',
                    },
                    {
                        key: '0-1-1',
                        title: 'Card',
                        description: 'The Lebanese Sajeria',
                    },
                    {
                        key: '0-1-2',
                        title: 'Card',
                        description: 'Fou Fow Ramen',
                    },
                ],
            },
        ],
    },
];

const TreeNode = ({ tree, onClick: _onClick, onMouseEnter: _onMouseEnter }) => {
    const isLeaf = tree.children?.length === 0;
    const [isHovered, setHovered] = useState(false);
    const [isClosed, setClosed] = useState(false);
    const onClick = useCallback(() => {
        setClosed(closed => !closed);
    }, []);
    const onMouseEnter = useCallback(() => {
        setHovered(hovered => !hovered);
    }, []);

    if (tree.children && tree.children.length) {
        return (
            <div className="w-full pl-4 cursor-pointer ">
                <div className="w-full hover:bg-blue-300" onClick={onClick}>
                    <span className="w-2">{isClosed ? '▶' : '▼'}</span>
                    {tree.title}
                    {tree.description ? <span className="pl-4 text-gray-400">{tree.description}</span> : null}
                    {isClosed ? null : tree.children.map(node => <TreeNode key={node.key} tree={node} />)}
                </div>
            </div>
        );
    }
    return <div className="w-full cursor-pointer">{tree.title}</div>;
};

export default function Tree() {
    const { sendMessage, addMessageHandler } = useDevtoolsContext();
    const [tree, setTree] = useState(treeData);
    return tree.map(node => <TreeNode key={node.key} tree={node} />);
    // return (
    //     <>
    //         <RcTree
    //             defaultExpandAll
    //             treeData={tree}
    //             onMouseEnter={({ node }) => sendMessage({ position: node.pos })}
    //             showIcon={false}
    //             switcherIcon={switcherIcon}
    //         />
    //     </>
    // );
}
