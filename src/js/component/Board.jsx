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
  selectedCells: [], 
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

const getRandomPosition = () => Math.floor(Math.random() * BOARD_SIZE);

const App = () => {
  const [state, setState] = useState(initialState);

  const placeShipsRandomly = (board) => {
    const updatedBoard = board.map((row) => [...row]);

    shipTypes.forEach((shipType) => {
      const { name, size } = shipType;
      const ship = Array.from({ length: size }, () => ({ hit: false, name }));

      let isPlacementValid = false;
      while (!isPlacementValid) {
        const isVertical = Math.random() < 0.5;
        const startRow = getRandomPosition();
        const startCol = getRandomPosition();

        let isValid = true;
        for (let i = 0; i < size; i++) {
          const row = isVertical ? startRow + i : startRow;
          const col = isVertical ? startCol : startCol + i;
          if (row >= BOARD_SIZE || col >= BOARD_SIZE || updatedBoard[row][col] !== null) {
            isValid = false;
            break;
          }
        }

        if (isValid) {
          for (let i = 0; i < size; i++) {
            const row = isVertical ? startRow + i : startRow;
            const col = isVertical ? startCol : startCol + i;
            updatedBoard[row][col] = ship[i];
          }
          isPlacementValid = true;
        }
      }
    });

    return updatedBoard;
  };

  const handleMove = (row, col, board) => {
    if (state.isGameOver || board[row][col].hit) {
      return;
    }

    const updatedBoard = board.map((row) => [...row]);
    const cell = updatedBoard[row][col];

    if (cell !== null) {
      cell.hit = true;

      const isGameOver = updatedBoard.every((row) =>
        row.every((cell) => cell === null || cell.hit)
      );

      setState((prevState) => ({
        ...prevState,
        computerBoard: updatedBoard,
        isGameOver,
        winner: isGameOver ? "Player" : null,
        isPlayerTurn: false 
      }));
    } else {
      const selectedCell = { row, col };
      setState((prevState) => ({
        ...prevState,
        selectedCells: [...prevState.selectedCells, selectedCell],
        isPlayerTurn: false 
      }));
    }
  };

  const handleComputerMove = () => {
    if (state.isGameOver || state.isPlayerTurn) {
      return;
    }

    const updatedPlayerBoard = state.playerBoard.map((row) => [...row]);

    let row, col;
    let isMoveValid = false;

    while (!isMoveValid) {
      row = getRandomPosition();
      col = getRandomPosition();
      if (updatedPlayerBoard[row][col] !== null && !updatedPlayerBoard[row][col].hit) {
        isMoveValid = true;
      }
    }

    const cell = updatedPlayerBoard[row][col];
    cell.hit = true;

    const isGameOver = updatedPlayerBoard.every((row) =>
      row.every((cell) => cell === null || cell.hit)
    );

    setState((prevState) => ({
      ...prevState,
      playerBoard: updatedPlayerBoard,
      isGameOver,
      winner: isGameOver ? "Computer" : null,
      isPlayerTurn: true 
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
      const timer = setTimeout(() => {
        handleComputerMove();
      },); 

      return () => clearTimeout(timer);
    }
  }, [state.isPlayerTurn]);

  const handleCellClick = (row, col) => {
    if (state.isPlayerTurn) {
      if (state.computerBoard[row][col] !== null && !state.computerBoard[row][col].hit) {
        handleMove(row, col, state.computerBoard);
      } else {
        const selectedCell = { row, col };
        setState((prevState) => ({
          ...prevState,
          selectedCells: [...prevState.selectedCells, selectedCell]
        }));
      }
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
              row.map((cell, colIndex) => {
                let cellClass = "";
                if (cell !== null) {
                  if (cell.hit) {
                    cellClass = "hit";
                  } else {
                    cellClass = "ship";
                  }
                }
                if (
                  state.selectedCells.some(
                    (selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex
                  )
                ) {
                  cellClass;
                }
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell ${cellClass}`}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="computer-board">
          <h3>CPU</h3>
          <div className="board">
            {state.computerBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                let cellClass = "";
                if (cell !== null) {
                  if (cell.hit) {
                    cellClass = "hit";
                  } else {
                    cellClass = "ship";
                  }
                } else {
                  if (
                    state.selectedCells.some(
                      (selectedCell) =>
                        selectedCell.row === rowIndex && selectedCell.col === colIndex
                    )
                  ) {
                    cellClass; 
                  }
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
