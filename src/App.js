import './App.css';
import { useState } from 'react';
import words from 'an-array-of-english-words';

const SPRITES = ["head-0-0", "head-0-1", "head-0-2", "head-0-4", "head-1-1", "head-1-2", "head-1-3", "head-2-0", "head-2-4", "head-2-5", "head-2-6", "head-2-7", "paw-3-4", "paw-3-5", "paw-4-4", "paw-4-5", "paw-5-4", "paw-5-6"];
const FALLING_CATS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  sprite: SPRITES[(i * 7 + Math.floor(i / 4)) % SPRITES.length],
  left: `${[4, 19, 30, 72, 88, 94, 12, 26, 79, 98, 5, 86, 21, 92, 14, 81, 36, 65, 7, 94, 24, 76, 2, 88, 16, 95, 31, 69, 8, 83][i]}%`,
  delay: `${-(i * 3.41 % 28)}s`,
  duration: `${17 + (i * 5.3 % 13)}s`,
  size: `${i % 3 === 0 ? 77 : i % 3 === 1 ? 61 : 46}px`,
  drift: `${((i % 2) ? -1 : 1) * (18 + (i * 11) % 50)}px`,
  rotate: `${((i % 2) ? -1 : 1) * (5 + i % 11)}deg`,
}));

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

const VALID_WORDS = new Set(
  words.filter((word) => word.length === 5).map((word) => word.toUpperCase())
);
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
  const [showCats, setShowCats] = useState(true);

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
        if (!VALID_WORDS.has(guessWord)) {
          alert("Not in word list!");
          return;
        }
        
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
    <div className="game-page">
      <label className="cat-toggle">
        <span>Animated Cats</span>
        <input
          type="checkbox"
          checked={showCats}
          onChange={(event) => setShowCats(event.target.checked)}
          aria-label="Show animated falling cats"
        />
        <span className="cat-toggle-track" aria-hidden="true" />
      </label>

      {showCats && (
        <div className="cat-rain" aria-hidden="true">
          {FALLING_CATS.map((cat) => (
            <img
              key={cat.id}
              src={`/pixel-cats/${cat.sprite}.png`}
              alt=""
              draggable="false"
              className="falling-cat"
              style={{
                left: cat.left,
                animationDelay: cat.delay,
                animationDuration: cat.duration,
                width: cat.size,
                '--drift': cat.drift,
                '--rotate': cat.rotate,
              }}
            />
          ))}
        </div>
      )}
      <main className="wordle-board">
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

      <button className="new-game-btn" onClick={resetGame}>
        New Game
      </button>
      </main>
    </div>
  );
} 

export default App;