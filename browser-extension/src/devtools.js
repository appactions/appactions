import React from 'react';
import ReactDOM from 'react-dom';
import Tree from 'rc-tree';
import './style.css';

const treeData = [
    {
        key: '0-0',
        title: 'parent 1',
        children: [
            { key: '0-0-0', title: 'parent 1-1', children: [{ key: '0-0-0-0', title: 'parent 1-1-0' }] },
            {
                key: '0-0-1',
                title: 'parent 1-2',
                children: [
                    { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
                    { key: '0-0-1-1', title: 'parent 1-2-1' },
                    { key: '0-0-1-2', title: 'parent 1-2-2' },
                    { key: '0-0-1-3', title: 'parent 1-2-3' },
                    { key: '0-0-1-4', title: 'parent 1-2-4' },
                    { key: '0-0-1-5', title: 'parent 1-2-5' },
                    { key: '0-0-1-6', title: 'parent 1-2-6' },
                    { key: '0-0-1-7', title: 'parent 1-2-7' },
                    { key: '0-0-1-8', title: 'parent 1-2-8' },
                    { key: '0-0-1-9', title: 'parent 1-2-9' },
                    { key: 1128, title: 1128 },
                ],
            },
        ],
    },
];

const DevTools = () => {
    const switcherIcon = node => {
        if (node.isLeaf) {
            return null;
        }
        return node.expanded ? '▼' : '▶';
    };
    return (
        <>
            <Tree
                defaultExpandAll
                treeData={treeData}
                onSelect={(...args) => console.log(...args)}
                showIcon={false}
                switcherIcon={switcherIcon}
            />
        </>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<DevTools />, root);

chrome.devtools.panels.create('App Actions', 'assets/img/icon-128x128.png', 'devtools.html', function (panel) {
    console.log('waddup', panel);
    // code invoked on panel creation
});
