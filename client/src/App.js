import React from 'react';
import logo from './logo.svg';
import './App.css';
import FetchApiTest from './components/FetchApiTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sol-Wars Game
        </a>
        <FetchApiTest />
      </header>
    </div>
  );
}

export default App;
