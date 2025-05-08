import React from 'react';
import TypingTest from './components/TypingTest';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <div className="App">
      <ThemeToggle />
      <header className="App-header">
        <span className="logo-emoji" role="img" aria-label="ninja">🥷</span>
        <h1>TypeNinja</h1>
        <p className="subtitle">Тренируй скорость. Будь ниндзя клавиатуры.</p>
      </header>
      <main>
        <TypingTest />
      </main>
      <footer className="app-footer">
        <p>Создано с ❤️ для быстрой печати</p>
      </footer>
    </div>
  );
}

export default App;
