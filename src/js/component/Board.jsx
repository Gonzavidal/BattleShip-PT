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
  isPlayerTurn: true
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

    shipTypes.forEach((shipType, index) => {
      const { size } = shipType;
      const ship = Array.from({ length: size }, () => 1);

      const isVertical = index % 2 === 0;
      let startRow, startCol;

      if (isVertical) {
        startRow = Math.floor(Math.random() * (BOARD_SIZE - size + 1));
        startCol = Math.floor(Math.random() * BOARD_SIZE);
      } else {
        startRow = Math.floor(Math.random() * BOARD_SIZE);
        startCol = Math.floor(Math.random() * (BOARD_SIZE - size + 1));
      }

      for (let i = 0; i < size; i++) {
        if (isVertical) {
          updatedBoard[startRow + i][startCol] = ship[i];
        } else {
          updatedBoard[startRow][startCol + i] = ship[i];
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
    }
  };

  const handleComputerMove = () => {
    if (state.isGameOver) {
      return;
    }

    const updatedPlayerBoard = state.playerBoard.map((row) => [...row]);

    let row = -1,
      col = -1;
    let isMoveValid = false;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (updatedPlayerBoard[i][j] === 1) {
          row = i;
          col = j;
          isMoveValid = true;
          break;
        }
      }
      if (isMoveValid) {
        break;
      }
    }

    if (row !== -1 && col !== -1) {
      updatedPlayerBoard[row][col] = 2;

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
      setState((prevState) => ({
        ...prevState,
        isGameOver: true,
        winner: "Computer"
      }));
    }

    const updatedComputerBoard = state.computerBoard.map((row) => [...row]);
    updatedComputerBoard[row][col] = updatedPlayerBoard[row][col];
    setState((prevState) => ({
      ...prevState,
      computerBoard: updatedComputerBoard
    }));
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      playerBoard: placeShipsRandomly(prevState.playerBoard),
      computerBoard: placeShipsRandomly(prevState.computerBoard)
    }));
  }, []);

  useEffect(() => {
    if (!state.isPlayerTurn) {
      setTimeout(() => {
        handleComputerMove();
      }, 1000);
    }
  }, [state.isPlayerTurn]);

  const handleCellClick = (row, col) => {
    if (
      state.isPlayerTurn &&
      state.computerBoard[row][col] !== 2 &&
      state.computerBoard[row][col] !== 3
    ) {
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
          <h3>Player</h3>
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
          <h3>CPU</h3>
          <div className="board">
            {state.computerBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                let cellClass = "";
                if (cell === 2) {
                  cellClass = "hit";
                } else if (cell === 3) {
                  cellClass = "miss";
                } else if (cell === 1) {
                  cellClass = "ship";
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
    </div>
  );
};

export default App;
