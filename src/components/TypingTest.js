import React, { useState, useEffect, useRef } from 'react';
import './TypingTest.css';
import Keyboard from './Keyboard';

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' или 'hard'
  const [pressedKey, setPressedKey] = useState('');
  const [bestResults, setBestResults] = useState(() => {
    const saved = localStorage.getItem('typingBestResults');
    return saved ? JSON.parse(saved) : { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } };
  });
  
  const timerRef = useRef(null);

  const sampleTexts = {
    easy: [
      "The quick brown fox jumps over the lazy dog",
      "Type faster, code better, live longer",
      "Practice makes perfect, especially in typing",
      "Speed and accuracy are your best friends",
      "React is a powerful JavaScript library",
      "Stay focused and keep typing",
      "Every day is a chance to improve",
      "Silent fingers, loud results",
      "Code. Type. Repeat.",
      "Never give up on your goals"
    ],
    hard: [
      "Programming is the art of telling another human what one wants the computer to do",
      "Touch typing is a skill that can save you hours of work and make you more productive in any field that requires a computer.",
      "Persistence and practice are the keys to mastering any skill, including fast and accurate typing. Keep going, even if you make mistakes.",
      "The journey of a thousand miles begins with a single step. Start typing, and soon you will see your progress.",
      "Learning to type without looking at the keyboard is like learning to ride a bicycle: at first it seems impossible, but with practice it becomes second nature.",
      "Great coders are not born, they are made through hours of practice and dedication. Your journey starts here, one keystroke at a time.",
      "Discipline is choosing between what you want now and what you want most. Stay focused and keep typing.",
      "The only way to do great work is to love what you do. Enjoy the process of learning and improving your typing skills.",
      "Typing quickly and accurately is a superpower in the digital age. Train your fingers, sharpen your mind, and become unstoppable."
    ]
  };

  useEffect(() => {
    setText(sampleTexts[difficulty][Math.floor(Math.random() * sampleTexts[difficulty].length)]);
  }, [difficulty]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      finishTest();
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    
    // Проверяем, побит ли рекорд
    if (wpm > bestResults[difficulty].wpm || 
       (wpm === bestResults[difficulty].wpm && accuracy > bestResults[difficulty].accuracy)) {
      const newBestResults = {
        ...bestResults,
        [difficulty]: { wpm, accuracy }
      };
      setBestResults(newBestResults);
      localStorage.setItem('typingBestResults', JSON.stringify(newBestResults));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (!isActive && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correct++;
      }
    }
    setAccuracy(value.length ? Math.round((correct / value.length) * 100) : 100);

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
      const words = value.length / 5; // assuming average word length is 5
      setWpm(timeElapsed > 0 ? Math.round(words / timeElapsed) : 0);
    }

    // Check if test is complete
    if (value.length === text.length) {
      finishTest();
    }
  };

  const handleKeyPress = (e) => {
    setPressedKey(e.key);
  };

  const handleKeyUp = () => {
    setPressedKey('');
  };

  const handleRestart = () => {
    setText(sampleTexts[difficulty][Math.floor(Math.random() * sampleTexts[difficulty].length)]);
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(60);
    setIsFinished(false);
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
      handleRestart();
    }
  };

  return (
    <div className="typing-test">
      <div className="typing-test-header">
        <div className="difficulty-selector">
          <button 
            className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('easy')}
          >
            Короткие тексты
          </button>
          <button 
            className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('hard')}
          >
            Длинные тексты
          </button>
        </div>
        <button className="restart-btn" onClick={handleRestart}>Начать заново</button>
        <div className="timer">{timeLeft} сек</div>
      </div>

      <div className="best-results">
        <div className="best-result">
          Рекорд в этом режиме: {bestResults[difficulty].wpm} WPM / {bestResults[difficulty].accuracy}% точности
        </div>
      </div>

      <div className="text-display">
        {text.split('').map((char, index) => {
          let className = 'char';
          if (index < userInput.length) {
            className += userInput[index] === char ? ' correct' : ' incorrect';
          }
          return <span key={index} className={className}>{char}</span>;
        })}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyUp}
        placeholder="Начните печатать..."
        disabled={!isActive && (userInput.length === text.length || isFinished || timeLeft === 0)}
        className="typing-input"
      />

      <div className="stats">
        <div className="stat">WPM: {wpm}</div>
        <div className="stat">Точность: {accuracy}%</div>
      </div>

      <Keyboard pressedKey={pressedKey} />

      {isFinished && (
        <div className="finish-message">
          Тест завершён! {wpm > bestResults[difficulty].wpm ? '🎉 Новый рекорд!' : ''} 
          Нажмите "Начать заново" для новой попытки.
        </div>
      )}
    </div>
  );
};

export default TypingTest; 