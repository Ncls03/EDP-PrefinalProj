import './App.css';
import {useState} from 'react';
function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const buttonClick = ()=> {
    
    if(username === actualusername && password === actualpassword){
      alert("logged in successfully")
    }

    if(username !== actualusername){
      console.log(username, password)
    }
    if(password !== actualpassword){
      console.log(username, password)
    }
  }

  const actualusername = "admin123"
  const actualpassword = "mir123"
  
  return (
    <div className="App">
      <div className="App-header">
        <h1 className='mydiv'>Login Screen</h1>
        <div className="logindiv">
          <label>Username</label>
          <input type="text" onChange={(e)=>{setUsername(e.target.value)}}/>
          <label>Password</label>
          <input type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
          <button onClick={buttonClick}>Login</button>
        </div>
      </div>
    </div>
  );
}
export default App;
