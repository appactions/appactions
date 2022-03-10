import Board from 'react-trello';
import Lane from 'react-trello/dist/controllers/Lane';
import Card from 'react-trello/dist/components/Card';
import NewCardForm from 'react-trello/dist/components/NewCardForm';
import EditableLabel from 'react-trello/dist/widgets/EditableLabel';
import InlineInputController from 'react-trello/dist/widgets/InlineInput';
import AddCardLink from 'react-trello/dist/components/AddCardLink';
import { createDriver } from '@appactions/driver';
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
});
createDriver(NewCardForm, {
    pattern: 'NewCardForm',
});
createDriver(EditableLabel, {
    pattern: 'EditableLabel',
});
createDriver(InlineInputController, {
    pattern: 'Input',
});
createDriver('button', {
    pattern: 'Button',
    getName: ({ $el }) => $el.text().trim(),
});

const Home = () => {
    const shouldReceiveNewData = nextData => {
        console.log('Board has changed');
        console.log(nextData);
    };

    const handleCardDelete = (cardId, laneId) => {
        console.log(`Card: ${cardId} deleted from lane: ${laneId}`);
    };

    const handleCardAdd = (card, laneId) => {
        console.log(`New card added to lane ${laneId}`);
        console.log(card);
    };
    return (
        <main className="">
            <Board
                data={data}
                draggable
                id="EditableBoard1"
                onDataChange={shouldReceiveNewData}
                onCardDelete={handleCardDelete}
                onCardAdd={handleCardAdd}
                onCardClick={(cardId, metadata, laneId) =>
                    console.log(`Card with id:${cardId} clicked. Card in lane: ${laneId}`)
                }
                canAddLanes
                editable
            />
        </main>
    );
};

export default Home;
