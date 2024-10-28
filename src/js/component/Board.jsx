import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const BOARD_SIZE = 10; // Disposición de tablero

const initialState = {
  playerBoard: Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  ),
  computerBoard: Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  ),
  selectedCellsPlayer: [],
  selectedEmptyCellsPlayer: [],
  selectedCellsComputer: [],
  selectedEmptyCellsComputer: [],
  isGameOver: false,
  winner: null,
  isPlayerTurn: true,
};

const shipTypes = [  // Composicion barcos
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

const getRandomPosition = () => Math.floor(Math.random() * BOARD_SIZE);  // Destinación automática barcos

const Board = () => {
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

  const handlePlayerMove = (row, col, board) => {  // Movimientos permitidos y manejo turnos
    if (state.isGameOver || board[row][col].hit) {
      return;
    }

    const updatedBoard = board.map((row) => [...row]);
    const cell = updatedBoard[row][col];

    if (cell !== null) {
      cell.hit = true;
        const quedan = updatedBoard.some((row) => {
            const b = row.some((cell) => !!cell && !cell.hit && !cell.miss);
            if(b){
                return true;
            }
        });

        const isGameOver = !quedan;

      setState((prevState) => ({
        ...prevState,
        computerBoard: updatedBoard,
        isGameOver,
        winner: isGameOver ? "Player" : null,
        isPlayerTurn: false,
      }));
    } else {
      const selectedCell = { row, col };
      setState((prevState) => ({
        ...prevState,
        selectedCellsPlayer: [...prevState.selectedCellsPlayer, selectedCell],
        isPlayerTurn: false,
      }));
    }
  };

  const handleComputerMove = () => { // Movimientos permitidos, manejo turnos y lógica CPU
    if (state.isGameOver || state.isPlayerTurn) {
      return;
    }

    const updatedPlayerBoard = state.playerBoard.map((row) => [...row]);

    let row, col;
    let isMoveValid = false;

    while (!isMoveValid) {
      row = getRandomPosition();
      col = getRandomPosition();



      if (updatedPlayerBoard[row][col] == null || (!!updatedPlayerBoard[row][col]) && !updatedPlayerBoard[row][col].hit && !updatedPlayerBoard[row][col].miss) {
        isMoveValid = true;
      }
    }

    let isNull = updatedPlayerBoard[row][col] === null;

      if(!isNull){
          updatedPlayerBoard[row][col].hit = true; // Si el disparo es válido, se marca como hit
      }
      if (isNull){
          updatedPlayerBoard[row][col] = { miss: true };
      }


      const quedan = updatedPlayerBoard.some((row) => {
          const b = row.some((cell) => !!cell && !cell.hit && !cell.miss);
          if(b){
              return true;
          }
      });

      const isGameOver = !quedan;

    setState((prevState) => ({
      ...prevState,
      playerBoard: updatedPlayerBoard,
      isGameOver,
      winner: isGameOver ? "Computer" : null,
      isPlayerTurn: true,
    }));
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      playerBoard: placeShipsRandomly(prevState.playerBoard),
      computerBoard: placeShipsRandomly(prevState.computerBoard),
    }));
  }, []);

  useEffect(() => {
    if (!state.isPlayerTurn) {
      const timer = setTimeout(() => {
        handleComputerMove();
      },1000);

      return () => clearTimeout(timer);
    }
  }, [state.isPlayerTurn]);

  const handleCellClick = (row, col) => { // 
    if (state.isPlayerTurn) {
      const clickedCell = state.computerBoard[row][col];
      const isEmptyCell = clickedCell === null;

      if (isEmptyCell) {
        const isSelectedEmptyCell = state.selectedEmptyCellsComputer.some(
          (selectedCell) => selectedCell.row === row && selectedCell.col === col
        );

        if (!isSelectedEmptyCell) {
          const updatedBoard = state.computerBoard.map((row) => [...row]);
          updatedBoard[row][col] = { miss: true };

          setState((prevState) => ({
            ...prevState,
            computerBoard: updatedBoard,
            isPlayerTurn: false,
            selectedEmptyCellsComputer: [
              ...prevState.selectedEmptyCellsComputer,
              { row, col },
            ],
          }));
        }
      } else if (!clickedCell.hit && !clickedCell.miss) {
        handlePlayerMove(row, col, state.computerBoard);
      }
    }
  };

  return (
    <div className="container"> 
      <h1>Battleship</h1> 
      {state.isGameOver && (  // Ganador
        <div className="message">  
          {state.winner === "Player" && <h2>Congratulations! You won!</h2>}
          {state.winner === "Computer" && <h2>Game Over! Computer won!</h2>}
        </div>
      )}
      
      <div className="game"> 
        <div className="player-board">
          <h3>Player</h3>
          <div className="player">
            {state.playerBoard.map((row, rowIndex) => {
                  return row.map((cell, colIndex) => {
                    let cellClass = "";

                    if (cell !== null) { // Renderizado player y cambio de estado celdas
                      if (cell.hit) {
                        cellClass = "hit";
                      }
                      if (cell.miss) {
                        cellClass = "miss";
                      }
                      if (!cell.hit && !cell.miss) {
                        cellClass = "ship";
                      }
                    } else if (
                        state.selectedCellsPlayer.some(
                            (selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex
                        )
                    ) {
                      cellClass = "computer-miss";
                    } else if (
                        state.selectedEmptyCellsPlayer.some(
                            (selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex
                        )
                    ) {
                      cellClass = "miss"; // Usar la clase "miss" para celdas vacías
                    }

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${cellClass}`}
                        />
                    );
                  });
                }
            )}
          </div>
        </div>
        <div className="computer-board">
          <h3>CPU</h3>
          <div className="cpu">
            {state.computerBoard.map((row, rowIndex) => { 
                  return row.map((cell, colIndex) => {
                    let cellClass = "";
                    if (cell !== null) {  // Renderizado CPU y cambio de estado celdas
                      if(cell.hit){
                        cellClass = "hit";
                      }
                      if(cell.miss){
                        cellClass = "miss";
                      }
                      if(!cell.hit && !cell.miss){
                         //cellClass = "ship";
                      }
                    } else if (
                        state.selectedCellsComputer.some(
                            (selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex
                        )
                    ) {
                      cellClass = "computer-miss";
                    } else if (
                        state.selectedEmptyCellsComputer.some(
                            (selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex
                        )
                    ) {
                      cellClass = "miss"; // Usar la clase "miss" para celdas vacías
                    }

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${cellClass}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        />
                    );
                  });
                }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
