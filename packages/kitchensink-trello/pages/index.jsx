import Board from 'react-trello';
import Lane from 'react-trello/dist/controllers/Lane';
import Card from 'react-trello/dist/components/Card';
import NewCardForm from 'react-trello/dist/components/NewCardForm';
import NewLaneForm from 'react-trello/dist/components/NewLaneForm';
import EditableLabel from 'react-trello/dist/widgets/EditableLabel';
import InlineInputController from 'react-trello/dist/widgets/InlineInput';
import NewLaneTitleEditor from 'react-trello/dist/widgets/NewLaneTitleEditor';
import AddCardLink from 'react-trello/dist/components/AddCardLink';
import { createDriver, annotate } from '@appactions/driver';
import data from './data.json';

createDriver(Board, {
    pattern: 'Board',
    actions: {
        addLane() {
            console.log('Lane added');
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
        addCard({}, title, label, description) {
            console.log('addCard', title, label, description);
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

const Home = () => {
    return (
        <main className="">
            {/* <button
                onClick={event => {
                    annotate(event, {
                        args: ['test'],
                    });
                }}
            >
                Test
            </button> */}
            <Board
                id="EditableBoard1"
                draggable
                canAddLanes
                editable
                data={data}
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
