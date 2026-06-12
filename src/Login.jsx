import './App.css';

function App() {
  return (
    <div className="container">

      <div className="login-box">

        <h1>Login</h1>

        <input 
          type="text" 
          placeholder="Enter Username" 
        />

        <input 
          type="password" 
          placeholder="Enter Password" 
        />

        <button>Login</button>

      </div>

    </div>
  );
}

export default App;