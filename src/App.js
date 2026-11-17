import './App.css';
import { useState } from 'react';

const WORD_LIST = ["CRANE", "APPLE", "BRAVE", "HOUSE", "PLANT", "SMART", "TRAIN", "WATER"];

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
}

function App() {
  // Use secretWord to check guesses
  const [secretWord] = useState(() => getRandomWord());
  
  // 6 rows, each containing 5 empty strings
  const [guesses, setGuesses] = useState(
    Array(6).fill("").map(() => Array(5).fill(""))
  );
  
  // Track colors for each tile: "green", "yellow", "gray", or ""
  const [colors, setColors] = useState(
    Array(6).fill("").map(() => Array(5).fill(""))
  );
  
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const handleChange = (e, row, col) => {
    if (row !== currentRow) return;

    const char = e.target.value.toUpperCase().slice(-1);
    const newGuesses = [...guesses.map(r => [...r])];
    newGuesses[row][col] = char;
    setGuesses(newGuesses);

    if (char && col < 4) {
      setCurrentCol(col + 1);
    }
  };

  const handleKeyDown = (e, row, col) => {
    if (row !== currentRow) return;

    const newGuesses = [...guesses.map(r => [...r])];

    if (e.key === "Backspace") {
      if (newGuesses[row][col] !== "") {
        newGuesses[row][col] = "";
        setGuesses(newGuesses);
      } else if (col > 0) {
        newGuesses[row][col - 1] = "";
        setGuesses(newGuesses);
        setCurrentCol(col - 1);
      }
    } else if (e.key === "Enter") {
      // Check if the row is full (5 letters)
      if (col === 4 && newGuesses[row][4] !== "") {
        const guessWord = newGuesses[row].join("");
        
        // Calculate colors (Green, Yellow, Gray)
        const newColors = [...colors.map(r => [...r])];
        const secretLetters = secretWord.split("");
        const guessLetters = guessWord.split("");
        
        // 1st pass: Greens
        for (let i = 0; i < 5; i++) {
          if (guessLetters[i] === secretLetters[i]) {
            newColors[row][i] = "green";
            secretLetters[i] = null;
            guessLetters[i] = null;
          }
        }

        // 2nd pass: Yellows and Grays
        for (let i = 0; i < 5; i++) {
          if (guessLetters[i] !== null) {
            const index = secretLetters.indexOf(guessLetters[i]);
            if (index !== -1) {
              newColors[row][i] = "yellow";
              secretLetters[index] = null;
            } else {
              newColors[row][i] = "gray";
            }
          }
        }
        setColors(newColors);

        // Win/Loss check
        if (guessWord === secretWord) {
          alert("🎉 You Win!");
          return;
        } else if (currentRow === 5) {
          alert(`Game Over! The word was ${secretWord}`);
          return;
        }

        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
    }
  };

  return (
    <div className="wordle-board">
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
                disabled={rowIndex !== currentRow}
                onChange={(e) => handleChange(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                ref={(node) => {
                  if (node && isCurrentFocus) {
                    node.focus();
                  }
                }}
              />
              
            );
          })}     
        </div>
      ))} 
    </div> 
    
  );
 
} 

export default App;