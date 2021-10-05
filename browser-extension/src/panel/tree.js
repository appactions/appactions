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

const TreeNode = ({ tree, indent, isClosed, setClosed }) => {
    const { sendMessage, addMessageHandler } = useDevtoolsContext();
    const onMouseEnter = useCallback(() => {
        sendMessage({ type: 'ELEMENT_HOVER', key: tree.key });
    }, []);
    const onClick = useCallback(() => {
        setClosed(closed => !closed);
    }, []);

    if (tree.children?.length) {
        return (
            <div
                className="w-full p-px m-px font-mono rounded cursor-pointer select-none hover:bg-blue-200"
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                <span className="whitespace-pre-wrap">
                    {'  '.repeat(indent)}
                    {isClosed ? '▶ ' : '▼ '}
                </span>
                {tree.title}
                {tree.description ? <span className="pl-4 text-gray-400">{tree.description}</span> : null}
            </div>
        );
    }

    return (
        <div
            className="w-full p-px m-px font-mono rounded cursor-pointer select-none hover:bg-blue-200"
            onMouseEnter={onMouseEnter}
        >
            <span className="whitespace-pre-wrap">{'  '.repeat(indent)}</span>
            {tree.title}
        </div>
    );
};

function Tree({ data, indent = 0 }) {
    const [isClosed, setClosed] = useState(false);
    return data.map(node => {
        return (
            <>
                <TreeNode key={node.key} tree={node} indent={indent} isClosed={isClosed} setClosed={setClosed} />
                {!isClosed && node.children?.length ? <Tree data={node.children} indent={indent + 1} /> : null}
            </>
        );
    });
}

export default function TreePanel() {
    const [tree, setTree] = useState(treeData);
    return <Tree data={tree} />;
}
