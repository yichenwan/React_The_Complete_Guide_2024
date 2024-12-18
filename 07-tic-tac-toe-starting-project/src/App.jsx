import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  
  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({
    'X': 'Player 1',
    'O': 'Player 2',
  });
  const [gameTurns, setGameTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState('X');
  
  const activePlayer = deriveActivePlayer(gameTurns);
  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
      
      gameBoard[row][col] = player;
  };

  let winner = null;

  for (const conbination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[conbination[0].row][conbination[0].column];
    const secondSquareSymbol = gameBoard[conbination[1].row][conbination[1].column];
    const thirdSquareSymbol = gameBoard[conbination[2].row][conbination[2].column];
    if (firstSquareSymbol 
      && firstSquareSymbol == secondSquareSymbol
      && firstSquareSymbol == thirdSquareSymbol) {
        winner = players[firstSquareSymbol];
      }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [{ square: {row:rowIndex, col: colIndex}, player:currentPlayer}, 
          ...prevTurns];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  return (<main>
    <div id="game-container">
      <ol id="players" className='highlight-player'>
        <Player initialName="Player1" symbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange}/>
        <Player initialName="Player2" symbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange}/>
      </ol>
      {(winner || hasDraw ) && <GameOver winner={winner} onRestart={handleRestart}/>}
      <GameBoard 
      onSelectSqaure={handleSelectSquare} 
      board={gameBoard}/>      
    </div>
    <Log turns={gameTurns}/>    
  </main>
  )
}

export default App
