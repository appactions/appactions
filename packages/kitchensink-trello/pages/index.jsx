import { useState } from 'react';
import Board from 'react-trello';
import Lane from 'react-trello/dist/controllers/Lane';
import Card from 'react-trello/dist/components/Card';
import NewCardForm from 'react-trello/dist/components/NewCardForm';
import NewLaneForm from 'react-trello/dist/components/NewLaneForm';
import EditableLabel from 'react-trello/dist/widgets/EditableLabel';
import InlineInputController from 'react-trello/dist/widgets/InlineInput';
import NewLaneTitleEditor from 'react-trello/dist/widgets/NewLaneTitleEditor';
import AddCardLink from 'react-trello/dist/components/AddCardLink';
import { AddLaneLink } from 'react-trello/dist/styles/Elements';
import { createDriver, annotate, useAction } from '@appactions/driver';
import data from './data.json';

createDriver(Board, {
    pattern: 'Board',
    actions: {
        addLane({ hook }, title) {
            hook(title || '');
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
        addCard({ actions, hook }, title, label, description) {
            const laneId = actions.getLaneId();
            hook(laneId, { title: title || '', label: label || '', description: description || '' });
        },
        getLaneId({ fiber }) {
            return fiber.stateNode.props.id;
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
createDriver(AddLaneLink, {
    pattern: 'Button',
    getName: ({ $el }) => $el.text().trim(),
});

const Home = () => {
    const [eventBus, setEventBus] = useState(null);

    useAction({ pattern: 'Board', action: 'addLane' }, title => {
        eventBus.publish({
            type: 'ADD_LANE',
            lane: {
                id: String(Date.now()),
                title,
                cards: [],
            },
        });
    });

    useAction({ pattern: 'Lane', action: 'addCard' }, (laneId, { title, label, description }) => {
        eventBus.publish({
            type: 'ADD_CARD',
            laneId,
            card: { id: String(Date.now()), title, label, description },
        });
    });

    return (
        <main>
            <Board
                id="EditableBoard1"
                draggable
                canAddLanes
                editable
                data={data}
                eventBusHandle={setEventBus}
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
