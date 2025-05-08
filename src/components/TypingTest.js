import React, { useState, useEffect } from 'react';
import './TypingTest.css';

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog",
    "Programming is the art of telling another human what one wants the computer to do",
    "Type faster, code better, live longer",
    "Practice makes perfect, especially in typing"
  ];

  useEffect(() => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (!isActive) {
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
    setAccuracy(Math.round((correct / value.length) * 100));

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
      const words = value.length / 5; // assuming average word length is 5
      setWpm(Math.round(words / timeElapsed));
    }

    // Check if test is complete
    if (value.length === text.length) {
      setIsActive(false);
    }
  };

  return (
    <div className="typing-test">
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
        placeholder="Start typing..."
        disabled={!isActive && userInput.length === text.length}
        className="typing-input"
      />
      <div className="stats">
        <div className="stat">WPM: {wpm}</div>
        <div className="stat">Accuracy: {accuracy}%</div>
      </div>
    </div>
  );
};

export default TypingTest; 