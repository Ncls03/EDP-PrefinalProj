import React, { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setResult((prev) => prev + value);
  };

  const clear = () => {
    setResult('');
  };

  const calculate = () => {
    try {
      setResult(String(eval(result)));
    } catch (err) {
      setResult('Error');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1> CALCULATOR </h1>
        <h1 className="myDiv">{result}</h1>

        <table>
          <tbody>
            <tr>
              <td><button className="mydiv table" onClick={() => handleClick('9')}>9</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('8')}>8</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('7')}>7</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('/')}>/</button></td>
            </tr>

            <tr>
              <td><button className="mydiv table" onClick={() => handleClick('6')}>6</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('5')}>5</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('4')}>4</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('*')}>*</button></td>
            </tr>

            <tr>
              <td><button className="mydiv table" onClick={() => handleClick('3')}>3</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('2')}>2</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('1')}>1</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('+')}>+</button></td>
            </tr>

            <tr>
              <td><button className="mydiv table" onClick={() => handleClick('0')}>0</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('00')}>00</button></td>
              <td><button className="mydiv table" onClick={calculate}>=</button></td>
              <td><button className="mydiv table" onClick={() => handleClick('-')}>-</button></td>
            </tr>

            <tr>
              <td colSpan="4"><button className="mydiv table" onClick={clear}>C</button></td>
            </tr>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
