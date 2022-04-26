import Board from 'react-trello';
import Lane from 'react-trello/dist/controllers/Lane';
import Card from 'react-trello/dist/components/Card';
import NewCardForm from 'react-trello/dist/components/NewCardForm';
import EditableLabel from 'react-trello/dist/widgets/EditableLabel';
import InlineInputController from 'react-trello/dist/widgets/InlineInput';
import AddCardLink from 'react-trello/dist/components/AddCardLink';
import { createDriver, annotate } from '@appactions/driver';
import data from './data.json';

createDriver(Board, {
    pattern: 'Board',
    // actions: {
    //     add: ({ hooks }, id, title) => {
    //         hooks.add({ id, title });
    //     },
    // },
});
createDriver(Lane, {
    pattern: 'Lane',
    getName(info) {
        return info.fiber.stateNode.props.title;
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
    pattern: 'NewCardForm',
});
createDriver(EditableLabel, {
    pattern: 'EditableLabel',
    getName(info) {
        return info.fiber.stateNode.props.placeholder;
    },
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
            <button
                onClick={event => {
                    annotate(event, {
                        args: ['test'],
                    });
                }}
            >
                Test
            </button>
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
