import './App.css';
import { useState } from 'react';

const WORD_LIST = ["CRANE", "BLUSH", "BRAVE", "FLAME", "DRIED", "SPINE", "TRAIN", "SLIME", "PRIDE", "GREED", "DREAD"];

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

function App() {
  const [secretWord, setSecretWord] = useState(() => getRandomWord());
  
  const [guesses, setGuesses] = useState(
    Array(6).fill("").map(() => Array(5).fill(""))
  );
  
  const [colors, setColors] = useState(
    Array(6).fill("").map(() => Array(5).fill(""))
  );
  
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Function to reset everything for a new game
  const resetGame = () => {
    setSecretWord(getRandomWord());
    setGuesses(Array(6).fill("").map(() => Array(5).fill("")));
    setColors(Array(6).fill("").map(() => Array(5).fill("")));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
  };

  const getLetterStatuses = () => {
    const statuses = {};
    for (let r = 0; r <= currentRow; r++) {
      for (let c = 0; c < 5; c++) {
        const letter = guesses[r][c];
        const color = colors[r][c];
        if (!letter) continue;

        if (color === 'green') {
          statuses[letter] = 'green';
        } else if (color === 'yellow' && statuses[letter] !== 'green') {
          statuses[letter] = 'yellow';
        } else if (color === 'gray' && !statuses[letter]) {
          statuses[letter] = 'gray';
        }
      }
    }
    return statuses;
  };

  const letterStatuses = getLetterStatuses();

  const handleKeyInput = (key) => {
    if (gameOver) return;

    const newGuesses = [...guesses.map(r => [...r])];

    if (key === "BACKSPACE") {
      if (newGuesses[currentRow][currentCol] !== "") {
        newGuesses[currentRow][currentCol] = "";
        setGuesses(newGuesses);
      } else if (currentCol > 0) {
        newGuesses[currentRow][currentCol - 1] = "";
        setGuesses(newGuesses);
        setCurrentCol(currentCol - 1);
      }
    } else if (key === "ENTER") {
      if (currentCol === 4 && newGuesses[currentRow][4] !== "") {
        const guessWord = newGuesses[currentRow].join("");
        
        const newColors = [...colors.map(r => [...r])];
        const secretLetters = secretWord.split("");
        const guessLetters = guessWord.split("");
        
        for (let i = 0; i < 5; i++) {
          if (guessLetters[i] === secretLetters[i]) {
            newColors[currentRow][i] = "green";
            secretLetters[i] = null;
            guessLetters[i] = null;
          }
        }

        for (let i = 0; i < 5; i++) {
          if (guessLetters[i] !== null) {
            const index = secretLetters.indexOf(guessLetters[i]);
            if (index !== -1) {
              newColors[currentRow][i] = "yellow";
              secretLetters[index] = null;
            } else {
              newColors[currentRow][i] = "gray";
            }
          }
        }
        setColors(newColors);

        if (guessWord === secretWord) {
          alert("You guessed the word!");
          setGameOver(true);
          return;
        } else if (currentRow === 5) {
          alert(`Game Over! The word was ${secretWord}`);
          setGameOver(true);
          return;
        }

        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
    } else {
      if (currentCol < 5 && newGuesses[currentRow][currentCol] === "") {
        newGuesses[currentRow][currentCol] = key;
        setGuesses(newGuesses);
        if (currentCol < 4) {
          setCurrentCol(currentCol + 1);
        }
      } else if (currentCol === 4 && newGuesses[currentRow][4] !== "") {
        newGuesses[currentRow][4] = key;
        setGuesses(newGuesses);
      }
    }
  };

  const handleChange = (e, row, col) => {
    if (row !== currentRow || gameOver) return;
    const char = e.target.value.toUpperCase().slice(-1);
    if (char) {
      handleKeyInput(char);
    }
  };

  const handleKeyDown = (e, row, col) => {
    if (row !== currentRow || gameOver) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      handleKeyInput("BACKSPACE");
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleKeyInput("ENTER");
    }
  };

  return (
    <div className="wordle-board">
      <h1>Wordle Game</h1>
      {guesses.map((rowValues, rowIndex) => (
        <div className="wordle-row" key={rowIndex}>
          {rowValues.map((letter, colIndex) => {
            const isCurrentFocus = rowIndex === currentRow && colIndex === currentCol;
            const tileColor = colors[rowIndex][colIndex];
            
            return (
              <input
                key={colIndex}
                type="text"
                maxLength="1"
                className={`tile ${tileColor}`}
                value={letter}
                disabled={rowIndex !== currentRow || gameOver}
                onChange={(e) => handleChange(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                ref={(node) => {
                  if (node && isCurrentFocus && !gameOver) {
                    node.focus();
                  }
                }}
              />
            );
          })}    
        </div>
      ))} 

      <div className="keyboard">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => {
              const status = letterStatuses[key] || '';
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';

              return (
                <button
                  key={key}
                  className={`key ${status} ${isSpecial ? 'special-key' : ''}`}
                  onClick={() => handleKeyInput(key)}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* New Game Button */}
      <button className="new-game-btn" onClick={resetGame}>
        New Game
      </button>
    </div> 
  );
} 

export default App;