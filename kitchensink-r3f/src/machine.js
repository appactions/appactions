const { Machine, actions } = require("xstate");
const { assign } = actions;

const initialContext = {
  board: Array(9).fill(null),
  moves: 0,
  player: "x",
  winner: undefined
};

const isValidMove = (ctx, e) => {
  return ctx.board[e.value] === null;
};

function checkWin(ctx) {
  const { board } = ctx;
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of winningLines) {
    const xWon = line.every(index => {
      return board[index] === "x";
    });

    if (xWon) {
      return true;
    }

    const oWon = line.every(index => {
      return board[index] === "o";
    });

    if (oWon) {
      return true;
    }
  }
}

function checkDraw(ctx) {
  return ctx.moves === 9;
}

const ticTacToeMachine = Machine(
  {
    initial: "playing",
    states: {
      playing: {
        on: {
          "": [
            { target: "winner", cond: "checkWin" },
            { target: "draw", cond: "checkDraw" }
          ],
          PLAY: [
            {
              target: "playing",
              cond: "isValidMove",
              actions: "updateBoard"
            }
          ]
        }
      },
      winner: {
        onEntry: "setWinner"
      },
      draw: {}
    },
    on: {
      RESET: {
        target: "playing",
        actions: "resetGame"
      }
    }
  },
  {
    actions: {
      updateBoard: assign({
        board: (ctx, e) => {
          const updatedBoard = [...ctx.board];
          updatedBoard[e.value] = ctx.player;
          return updatedBoard;
        },
        moves: ctx => ctx.moves + 1,
        player: ctx => (ctx.player === "x" ? "o" : "x")
      }),
      resetGame: assign(initialContext),
      setWinner: assign({
        winner: ctx => (ctx.player === "x" ? "o" : "x")
      })
    },
    guards: {
      checkWin,
      checkDraw,
      isValidMove
    }
  },
  initialContext
);

export { ticTacToeMachine };
