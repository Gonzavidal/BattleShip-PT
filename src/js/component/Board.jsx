import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const BOARD_SIZE = 10;

const initialState = {
  playerBoard: Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  ),
  computerBoard: Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  ),
  isGameOver: false,
  winner: null,
  isPlayerTurn: false
};

const shipTypes = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 }
];

const App = () => {
  const [state, setState] = useState(initialState);

  const placeShipsRandomly = (board) => {
    const updatedBoard = board.map((row) => [...row]);

    shipTypes.forEach((shipType) => {
      let isShipPlaced = false;
      while (!isShipPlaced) {
        const isVertical = Math.random() >= 0.5;
        const { size } = shipType;
        const ship = Array.from({ length: size }, () => 1);

        let randomRow = Math.floor(Math.random() * BOARD_SIZE);
        let randomCol = Math.floor(Math.random() * BOARD_SIZE);

        if (
          (isVertical && randomRow + size <= BOARD_SIZE) ||
          (!isVertical && randomCol + size <= BOARD_SIZE)
        ) {
          let isCollision = false;
          for (let i = 0; i < size; i++) {
            if (isVertical && updatedBoard[randomRow + i][randomCol] !== null) {
              isCollision = true;
              break;
            }
            if (
              !isVertical &&
              updatedBoard[randomRow][randomCol + i] !== null
            ) {
              isCollision = true;
              break;
            }
          }

          if (!isCollision) {
            for (let i = 0; i < size; i++) {
              if (isVertical) {
                updatedBoard[randomRow + i][randomCol] = ship[i];
              } else {
                updatedBoard[randomRow][randomCol + i] = ship[i];
              }
            }
            isShipPlaced = true;
          }
        }
      }
    });

    return updatedBoard;
  };

  const handleMove = (row, col, board) => {
    if (state.isGameOver || board[row][col] !== null) {
      return;
    }

    const updatedBoard = board.map((row) => [...row]);

    if (updatedBoard[row][col] === 1) {
      updatedBoard[row][col] = 2;

      const isGameOver = board.every((ship) =>
        ship.every((cell) => cell === 2)
      );

      setState((prevState) => ({
        ...prevState,
        computerBoard: updatedBoard,
        isGameOver,
        winner: isGameOver ? "Player" : null,
        isPlayerTurn: !prevState.isPlayerTurn
      }));
    } else {
      updatedBoard[row][col] = 3;

      setState((prevState) => ({
        ...prevState,
        computerBoard: updatedBoard,
        isPlayerTurn: !prevState.isPlayerTurn
      }));

      if (!prevState.isPlayerTurn) {
        setTimeout(() => {
          handleComputerMove();
        }, 1000);
      }
    }
  };

  const handleComputerMove = () => {
    if (state.isGameOver) {
      return;
    }

    const updatedPlayerBoard = state.playerBoard.map((row) => [...row]);

    let randomRow, randomCol;
    let isMoveValid = false;

    while (!isMoveValid) {
      randomRow = Math.floor(Math.random() * BOARD_SIZE);
      randomCol = Math.floor(Math.random() * BOARD_SIZE);

      if (updatedPlayerBoard[randomRow][randomCol] === null) {
        isMoveValid = true;
      }
    }

    if (updatedPlayerBoard[randomRow][randomCol] === 1) {
      updatedPlayerBoard[randomRow][randomCol] = 2;

      const isGameOver = updatedPlayerBoard.every((ship) =>
        ship.every((cell) => cell === 2)
      );

      setState((prevState) => ({
        ...prevState,
        playerBoard: updatedPlayerBoard,
        isGameOver,
        winner: isGameOver ? "Computer" : null,
        isPlayerTurn: !prevState.isPlayerTurn
      }));
    } else {
      updatedPlayerBoard[randomRow][randomCol] = 3;

      setState((prevState) => ({
        ...prevState,
        playerBoard: updatedPlayerBoard,
        isPlayerTurn: !prevState.isPlayerTurn
      }));
    }
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      playerBoard: placeShipsRandomly(prevState.playerBoard)
    }));
  }, []);

  const startGame = () => {
    const computerBoard = placeShipsRandomly(state.computerBoard);
    setState((prevState) => ({
      ...prevState,
      computerBoard,
      isPlayerTurn: true
    }));
  };

  const handleCellClick = (row, col) => {
    if (state.isPlayerTurn) {
      handleMove(row, col, state.computerBoard);
    }
  };

  return (
    <div className="container">
      <h1>Battleship</h1>
      {state.isGameOver && (
        <div className="message">
          {state.winner === "Player" && <h2>Congratulations! You won!</h2>}
          {state.winner === "Computer" && <h2>Game Over! Computer won!</h2>}
        </div>
      )}
      <div className="game">
        <div className="player-board">
          <h3>Your Board</h3>
          <div className="board">
            {state.playerBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell === 1 ? "ship" : ""}`}
                />
              ))
            )}
          </div>
        </div>
        <div className="computer-board">
          <h3>Computer's Board</h3>
          <div className="board">
            {state.computerBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                let cellClass = "";
                if (cell === 2) {
                  cellClass = "hit";
                } else if (cell === 3) {
                  cellClass = "miss";
                }
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell ${cellClass}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      {!state.isGameOver && !state.isPlayerTurn && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}
    </div>
  );
};

export default App;
