import React, { useReducer } from 'react';
import PatternTree from './pattern-tree';
import SessionRecordingPanel from './session-recording-panel';
import InspectPanel from './inspect-panel';
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
        { name: 'Recording', id: 'session-recording', selected: true },
        { name: 'Debug', id: 'inspect-panel' },
    ]);
    const selectedTab = tabs.find(tab => tab.selected);

    return (
        <SplitView
            left={<PatternTree />}
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
                                        'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm cursor-pointer',
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
                    {selectedTab.id === 'session-recording' ? <SessionRecordingPanel /> : null}
                    {selectedTab.id === 'inspect-panel' ? <InspectPanel /> : null}
                </>
            }
        />
    );
};

export default portaledContent(Panel);
