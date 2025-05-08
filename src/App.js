import React from 'react';
import './App.css';
import TypingTest from './components/TypingTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <span className="logo-emoji" role="img" aria-label="ninja">🥷</span>
        <h1>TypeNinja</h1>
        <p className="subtitle">Тренируй скорость. Будь ниндзя клавиатуры.</p>
      </header>
      <main>
        <TypingTest />
      </main>
    </div>
  );
}

export default App;
