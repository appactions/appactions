import { useReducer } from 'react';
import Board from 'react-trello';
import Lane from 'react-trello/dist/controllers/Lane';
import Card from 'react-trello/dist/components/Card';
import NewCardForm from 'react-trello/dist/components/NewCardForm';
import NewLaneForm from 'react-trello/dist/components/NewLaneForm';
import EditableLabel from 'react-trello/dist/widgets/EditableLabel';
import InlineInputController from 'react-trello/dist/widgets/InlineInput';
import NewLaneTitleEditor from 'react-trello/dist/widgets/NewLaneTitleEditor';
import AddCardLink from 'react-trello/dist/components/AddCardLink';
import { createDriver, annotate, useAction } from '@appactions/driver';
import data from './data.json';

createDriver(Board, {
    pattern: 'Board',
    actions: {
        addLane({ hook }, title) {
            hook(title);
        },
    },
    simplify: {
        addLane: {
            start: {
                pattern: 'Button',
                name: '+ Add another lane',
                action: 'click',
            },
            end: {
                pattern: 'Button',
                name: 'Add lane',
                action: 'click',
            },
            collect(generator) {
                return generator.query({ pattern: 'Input', action: 'type' });
            },
        },
    },
});
createDriver(Lane, {
    pattern: 'Lane',
    getName(info) {
        return info.fiber.stateNode.props.title;
    },
    actions: {
        addCard({ hook }, title, label, description) {
            hook(title, label, description);
        },
    },
    simplify: {
        addCard: {
            start: {
                pattern: 'Button',
                name: 'Click to add card',
                action: 'click',
            },
            end: {
                pattern: 'Button',
                name: 'Add card',
                action: 'click',
            },
            collect(generator) {
                const [title] = generator.query({ pattern: 'Input', name: 'title', action: 'type', optional: true });
                const [label] = generator.query({ pattern: 'Input', name: 'label', action: 'type', optional: true });
                const [description] = generator.query({
                    pattern: 'Input',
                    name: 'description',
                    action: 'type',
                    optional: true,
                });

                return [title, label, description];
            },
        },
    },
});
createDriver(Card, {
    pattern: 'Card',
    getName(info) {
        return info.fiber.stateNode.props.title;
    },
});
createDriver(AddCardLink, {
    pattern: 'Button',
    getName: ({ $el }) => $el.text().trim(),
});
createDriver(NewCardForm, {
    pattern: 'Form',
});
createDriver(NewLaneForm, {
    pattern: 'Form',
});
createDriver(EditableLabel, {
    pattern: 'Input',
    getName(info) {
        return info.fiber.stateNode.props.placeholder;
    },
});
createDriver(NewLaneTitleEditor, {
    pattern: 'Input',
});
createDriver(InlineInputController, {
    pattern: 'Input',
    actions: {
        getValue: ({ $el }) => $el.val(),
    },
    asserts: {
        getValue: {
            // optional
            // tester: (a, b) => a === b,
            test: '===',
            input: 'text',
        },
    },
});
createDriver('button', {
    pattern: 'Button',
    getName: ({ $el }) => $el.text().trim(),
});

const reducer = (state, action) => {
    switch (action.type) {
        case 'addCard':
            return {
                ...state,
                lanes: state.lanes.map(lane => {
                    // TODO handle id
                    // if (lane.id === action.laneId) {
                    if (lane.id) {
                        return {
                            ...lane,
                            cards: lane.cards.concat({
                                id: String(Date.now()),
                                title: action.payload.title,
                                label: action.payload.label,
                                description: action.payload.description,
                            }),
                        };
                    }
                }),
            };
        case 'addLane':
            return {
                ...state,
                lanes: state.lanes.concat({
                    id: String(Date.now()),
                    title: action.payload.title,
                    cards: [],
                }),
            };
        default:
            return state;
    }
};

const Home = () => {
    const [state, dispatch] = useReducer(reducer, data);

    useAction({ pattern: 'Board', action: 'addLane' }, title => {
        dispatch({
            type: 'addLane',
            payload: {
                title,
            },
        });
    });

    useAction({ pattern: 'Lane', action: 'addCard' }, (title, label, description) => {
        dispatch({
            type: 'addCard',
            payload: {
                title,
                label,
                description,
            },
        });
    });

    return (
        <main>
            <Board
                id="EditableBoard1"
                draggable
                canAddLanes
                editable
                data={state}
                onCardAdd={(card, laneId) => {
                    annotate(
                        { type: 'click' },
                        {
                            pattern: 'Card',
                            action: 'add',
                            args: [card.title],
                        },
                    );
                }}
            />
        </main>
    );
};

export default Home;
