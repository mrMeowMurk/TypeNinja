import React from 'react';
import './App.css';
import TypingTest from './components/TypingTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <span className="logo-emoji" role="img" aria-label="ninja">🥷</span>
        <h1>Type Ninja</h1>
        <p className="subtitle">Тренируй скорость. Будь ниндзя клавиатуры.</p>
        <div className="header-extra">Погрузись в мир слепой печати! Развивай навык, который пригодится в учёбе, работе и жизни. Соревнуйся с собой и побеждай!</div>
      </header>
      <main>
        <TypingTest />
      </main>
    </div>
  );
}

export default App;
