import React, { useReducer } from 'react';
// import Tree from './tree';
import RoleTree from './role-tree';
import SessionRecording from './session-recording';
import SidePanel from './side-panel';
import portaledContent from './portaled-content';
import SplitView from './split-view';
import classNames from 'classnames';

const reducer = (state, action) => {
    switch (action.type) {
        case 'set-tab':
            return state.map(tab => {
                if (tab.id === action.tabId) {
                    return { ...tab, selected: true };
                }
                return { ...tab, selected: false };
            });
        default:
            return state;
    }
};

const Panel = () => {
    const [tabs, dispatch] = useReducer(reducer, [
        { name: 'RoleTree', id: 'role-tree', selected: true },
        { name: 'SessionRecording', id: 'session-recording' },
    ]);
    const selectedTab = tabs.find(tab => tab.selected);
    console.log('selectedTab', selectedTab.id, selectedTab.id === 'role-tree', selectedTab.id === 'session-recording');
    return (
        <SplitView
            left={
                <div className="m-4">
                    <RoleTree />
                </div>
            }
            right={
                <>
                    <div className="pl-2 border-b border-gray-200">
                        <nav className="flex -mb-px space-x-8">
                            {tabs.map(tab => (
                                <span
                                    key={tab.id}
                                    className={classNames(
                                        tab.selected
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
                                    )}
                                    onClick={event => {
                                        event.preventDefault();

                                        dispatch({
                                            type: 'set-tab',
                                            tabId: tab.id,
                                        });
                                    }}
                                >
                                    {tab.name}
                                </span>
                            ))}
                        </nav>
                    </div>
                    {selectedTab.id === 'role-tree' ? <SidePanel /> : null}
                    {selectedTab.id === 'session-recording' ? <SessionRecording /> : null}
                </>
            }
        />
    );
};

export default portaledContent(Panel);
