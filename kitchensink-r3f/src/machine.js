import { createMachine, assign } from 'xstate';

const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWin(board) {
    for (let line of winningLines) {
        const xWon = line.every(index => {
            return board[index] === 'x';
        });

        if (xWon) {
            return ['x', line];
        }

        const oWon = line.every(index => {
            return board[index] === 'o';
        });

        if (oWon) {
            return ['o', line];
        }
    }

    return false;
}

const initialContext = {
    board: Array(9).fill(null),
    player: 'x', // or 'o'
    winner: null,
    winningLine: null,
    moves: 0,
};

export const ticTacToeMachine = createMachine({
    initial: 'playing',
    context: initialContext,
    states: {
        playing: {
            always: [
                {
                    target: 'winner',
                    cond: ctx => !!checkWin(ctx.board),
                    actions: assign({
                        winner: ctx => checkWin(ctx.board)[0],
                        winningLine: ctx => checkWin(ctx.board)[1],
                    }),
                },
                {
                    target: 'draw',
                    cond: ctx => ctx.board.every(item => item),
                },
            ],
            on: {
                PLAY: {
                    target: 'playing',
                    actions: assign({
                        board: (ctx, e) => {
                            const updatedBoard = [...ctx.board];
                            updatedBoard[e.value] = ctx.player;
                            return updatedBoard;
                        },
                        player: ctx => (ctx.player === 'x' ? 'o' : 'x'),
                        moves: ctx => ctx.moves + 1,
                    }),
                    cond: (ctx, e) => ctx.board[e.value] === null,
                },
                RESET: undefined,
            },
        },
        winner: {},
        draw: {},
    },
    on: {
        RESET: {
            target: '.playing',
            actions: assign(initialContext),
        },
    },
});
