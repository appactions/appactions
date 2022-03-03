import Board from 'react-trello';
import data from './data.json';

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
                editable
            />
        </main>
    );
};

export default Home;
