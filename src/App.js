import React from 'react';
import './App.css';
import TypingTest from './components/TypingTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Type Ninja</h1>
        <p>Улучшите свои навыки слепой печати</p>
      </header>
      <main>
        <TypingTest />
      </main>
    </div>
  );
}

export default App;
