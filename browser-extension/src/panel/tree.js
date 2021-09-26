import React, { useState, useEffect } from 'react';
import RcTree from 'rc-tree';
import { useDevtoolsContext } from './context';

const treeData = [
    {
        key: '0-0',
        title: ({ className }) => (
            <span className={className}>
                root<span className="pl-4 text-gray-400">#__next</span>
            </span>
        ),
        children: [
            { key: '0-0-0', title: 'Logo' },
            {
                key: '0-0-1',
                title: ({ className }) => (
                    <span className={className}>
                        Link<span className="pl-4 text-gray-400">Dashboard</span>
                    </span>
                ),
            },
            {
                key: '0-0-2',
                title: ({ className }) => (
                    <span className={className}>
                        Button<span className="pl-4 text-gray-400">Sign in</span>
                    </span>
                ),
            },
            { key: '0-0-3', title: 'Filter' },
            {
                key: '0-0-4',
                title: 'Grid',
                children: [
                    {
                        key: '0-1-0',
                        title: ({ className }) => (
                            <span className={className}>
                                Card<span className="pl-4 text-gray-400">BREDA</span>
                            </span>
                        ),
                    },
                    {
                        key: '0-1-1',
                        title: ({ className }) => (
                            <span className={className}>
                                Card<span className="pl-4 text-gray-400">The Lebanese Sajeria</span>
                            </span>
                        ),
                    },
                    {
                        key: '0-1-2',
                        title: ({ className }) => (
                            <span className={className}>
                                Card<span className="pl-4 text-gray-400">Fou Fow Ramen</span>
                            </span>
                        ),
                    },
                ],
            },
        ],
    },
];

const switcherIcon = node => {
    if (node.isLeaf) {
        return null;
    }
    return node.expanded ? '▼' : '▶';
};

const randomKey = () => String(Math.floor(Math.random() * 1e6));

export default function Tree() {
    const { sendMessage, addMessageHandler } = useDevtoolsContext();
    const [tree, setTree] = useState(treeData);
    // Listen for response for devtools
    useEffect(() => {
        return addMessageHandler(e => {
            setTree(tree => [
                ...tree,
                {
                    key: randomKey(),
                    title: ({ className }) => (
                        <span className={className}>
                            Test<span className="pl-4 text-gray-400">{JSON.stringify(e.data)}</span>
                        </span>
                    ),
                },
            ]);
        });
    }, [addMessageHandler]);
    addMessageHandler;
    return (
        <>
            <RcTree
                defaultExpandAll
                treeData={tree}
                onMouseEnter={({ node }) => sendMessage({ position: node.pos })}
                showIcon={false}
                switcherIcon={switcherIcon}
            />
        </>
    );
}
