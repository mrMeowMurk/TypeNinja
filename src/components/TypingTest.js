import React, { useState, useEffect, useRef } from 'react';
import './TypingTest.css';
import Keyboard from './Keyboard';
import { soundManager } from '../sounds';
import SoundControl from './SoundControl';

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [language, setLanguage] = useState('ru');
  const [mode, setMode] = useState('text'); // 'text', 'code', 'numbers'
  const [pressedKey, setPressedKey] = useState('');
  const [showHints, setShowHints] = useState(true);
  const [testDuration, setTestDuration] = useState(60);
  const [fontSize, setFontSize] = useState(16);
  const [isStarted, setIsStarted] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [currentChar, setCurrentChar] = useState('');

  const defaultBestResults = {
    ru: { 
      text: { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } },
      code: { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } },
      numbers: { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } }
    },
    en: {
      text: { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } },
      code: { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } },
      numbers: { easy: { wpm: 0, accuracy: 0 }, hard: { wpm: 0, accuracy: 0 } }
    }
  };

  const [bestResults, setBestResults] = useState(() => {
    try {
      const saved = localStorage.getItem('typingBestResults');
      if (!saved) return defaultBestResults;

      const parsed = JSON.parse(saved);
      
      // Проверяем структуру и при необходимости обновляем её
      const updated = {
        ru: {
          text: {
            easy: parsed.ru?.text?.easy || { wpm: 0, accuracy: 0 },
            hard: parsed.ru?.text?.hard || { wpm: 0, accuracy: 0 }
          },
          code: {
            easy: parsed.ru?.code?.easy || { wpm: 0, accuracy: 0 },
            hard: parsed.ru?.code?.hard || { wpm: 0, accuracy: 0 }
          },
          numbers: {
            easy: parsed.ru?.numbers?.easy || { wpm: 0, accuracy: 0 },
            hard: parsed.ru?.numbers?.hard || { wpm: 0, accuracy: 0 }
          }
        },
        en: {
          text: {
            easy: parsed.en?.text?.easy || { wpm: 0, accuracy: 0 },
            hard: parsed.en?.text?.hard || { wpm: 0, accuracy: 0 }
          },
          code: {
            easy: parsed.en?.code?.easy || { wpm: 0, accuracy: 0 },
            hard: parsed.en?.code?.hard || { wpm: 0, accuracy: 0 }
          },
          numbers: {
            easy: parsed.en?.numbers?.easy || { wpm: 0, accuracy: 0 },
            hard: parsed.en?.numbers?.hard || { wpm: 0, accuracy: 0 }
          }
        }
      };

      // Сохраняем обновленную структуру
      localStorage.setItem('typingBestResults', JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error loading best results:', error);
      return defaultBestResults;
    }
  });

  const timerRef = useRef(null);

  const sampleTexts = {
    en: {
      text: {
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
          "The only way to do great work is to love what you do. Enjoy the process of learning and improving your typing skills."
        ]
      },
      code: {
        easy: [
          "function hello() { console.log('Hello, World!'); }",
          "const sum = (a, b) => a + b;",
          "if (condition) { return true; } else { return false; }",
          "import React from 'react';",
          "const [state, setState] = useState(null);"
        ],
        hard: [
          "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.filter((x, i) => i > 0 && x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}",
          "class Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n  }\n}"
        ]
      },
      numbers: {
        easy: [
          "12345 67890",
          "!@#$ %^&* ()",
          "9876 5432 1000",
          "+1-234-567-8900"
        ],
        hard: [
          "1234-5678-9012-3456 CVV: 123",
          "192.168.0.1 255.255.255.0",
          "(123) 456-7890 #123"
        ]
      }
    },
    ru: {
      text: {
        easy: [
          "Быстрая рыжая лиса прыгает через ленивую собаку",
          "Печатай быстрее, кодируй лучше, живи дольше",
          "Практика ведет к совершенству, особенно в печати",
          "Скорость и точность - твои лучшие друзья",
          "Реакт - мощная библиотека JavaScript",
          "Оставайся сосредоточенным и продолжай печатать",
          "Каждый день - это шанс стать лучше",
          "Тихие пальцы, громкие результаты",
          "Пиши код. Печатай. Повторяй.",
          "Никогда не сдавайся на пути к цели"
        ],
        hard: [
          "Программирование - это искусство объяснить другому человеку, что ты хочешь от компьютера",
          "Слепая печать - это навык, который может сэкономить часы работы и сделать вас более продуктивным в любой сфере, требующей работы с компьютером.",
          "Упорство и практика - ключи к освоению любого навыка, включая быструю и точную печать. Продолжайте, даже если допускаете ошибки.",
          "Путешествие в тысячу миль начинается с первого шага. Начните печатать, и вскоре вы увидите свой прогресс.",
          "Учиться печатать вслепую - как учиться кататься на велосипеде: сначала кажется невозможным, но с практикой становится второй натурой.",
          "Великие программисты не рождаются, они создаются часами практики и преданности делу. Ваше путешествие начинается здесь, одно нажатие клавиши за другим."
        ]
      },
      code: {
        easy: [
          "function hello() { console.log('Hello, World!'); }",
          "const sum = (a, b) => a + b;",
          "if (condition) { return true; } else { return false; }",
          "import React from 'react';",
          "const [state, setState] = useState(null);"
        ],
        hard: [
          "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.filter((x, i) => i > 0 && x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}",
          "class Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n  }\n}"        ]
      },
      numbers: {
        easy: [
          "12345 67890",
          "!@#$ %^&* ()",
          "8-800-555-3535"
        ],
        hard: [
          "4276 1234 5678 9100",
          "192.168.1.1 255.255.255.0",
          "+7 (999) 123-45-67"
        ]
      }
    }
  };

  const fingerHints = {
    left: {
      pinky: ['1', '!', 'q', 'a', 'z'],
      ring: ['2', '@', 'w', 's', 'x'],
      middle: ['3', '#', 'e', 'd', 'c'],
      index: ['4', '$', '5', '%', 'r', 't', 'f', 'g', 'v', 'b']
    },
    right: {
      index: ['6', '^', '7', '&', 'y', 'u', 'h', 'j', 'n', 'm'],
      middle: ['8', '*', 'i', 'k', ','],
      ring: ['9', '(', 'o', 'l', '.'],
      pinky: ['0', ')', 'p', ';', '/', '[', ']', '{', '}']
    }
  };

  const getFingerForKey = (key) => {
    key = key.toLowerCase();
    for (const [hand, fingers] of Object.entries(fingerHints)) {
      for (const [finger, keys] of Object.entries(fingers)) {
        if (keys.includes(key)) {
          return `${hand} ${finger}`;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    setText(sampleTexts[language][mode][difficulty][Math.floor(Math.random() * sampleTexts[language][mode][difficulty].length)]);
    setTimeLeft(testDuration);
  }, [difficulty, language, mode, testDuration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      finishTest();
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const getBestResult = (lang, mode, diff) => {
    try {
      return bestResults?.[lang]?.[mode]?.[diff] || { wpm: 0, accuracy: 0 };
    } catch (error) {
      console.error('Error getting best result:', error);
      return { wpm: 0, accuracy: 0 };
    }
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    
    try {
      const currentBest = getBestResult(language, mode, difficulty);
      
      // Проверяем, побит ли рекорд
      if (wpm > currentBest.wpm || 
         (wpm === currentBest.wpm && accuracy > currentBest.accuracy)) {
        const newBestResults = {
          ...bestResults,
          [language]: {
            ...bestResults[language],
            [mode]: {
              ...bestResults[language][mode],
              [difficulty]: { wpm, accuracy }
            }
          }
        };
        setBestResults(newBestResults);
        localStorage.setItem('typingBestResults', JSON.stringify(newBestResults));
      }
    } catch (error) {
      console.error('Error updating best results:', error);
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

  const handleKeyDown = (e) => {
    if (!isStarted && !isFinished) {
      setIsStarted(true);
      startTimer();
    }

    const currentChar = text[userInput.length];
    if (e.key === currentChar) {
      // Правильная клавиша
      if (e.key === ' ') {
        soundManager.play('keySpace');
      } else {
        soundManager.play('keyPress');
      }
      setCorrectChars(prev => prev + 1);
      setCurrentCharIndex(prev => prev + 1);
    } else {
      // Ошибка при печати
      soundManager.play('keyError');
      setErrors(prev => prev + 1);
    }
  };

  const handleKeyPress = (e) => {
    setPressedKey(e.key);
  };

  const handleKeyUp = () => {
    setPressedKey('');
  };

  const handleLanguageChange = (newLanguage) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      handleRestart();
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
      handleRestart();
    }
  };

  const handleModeChange = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      handleRestart();
    }
  };

  const handleRestart = () => {
    setText(sampleTexts[language][mode][difficulty][Math.floor(Math.random() * sampleTexts[language][mode][difficulty].length)]);
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(testDuration);
    setIsFinished(false);
  };

  const startTimer = () => {
    // Implementation of startTimer function
  };

  return (
    <div className="typing-test">
      <SoundControl />
      <div className="typing-test-header">
        <div className="controls-group">
          <div className="settings-row">
            <div className="language-selector">
              <button 
                className={`control-btn ${language === 'ru' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('ru')}
              >
                🇷🇺 Русский
              </button>
              <button 
                className={`control-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                🇬🇧 English
              </button>
            </div>

            <div className="mode-selector">
              <button 
                className={`control-btn ${mode === 'text' ? 'active' : ''}`}
                onClick={() => handleModeChange('text')}
              >
                {language === 'ru' ? 'Текст' : 'Text'}
              </button>
              <button 
                className={`control-btn ${mode === 'code' ? 'active' : ''}`}
                onClick={() => handleModeChange('code')}
              >
                {language === 'ru' ? 'Код' : 'Code'}
              </button>
              <button 
                className={`control-btn ${mode === 'numbers' ? 'active' : ''}`}
                onClick={() => handleModeChange('numbers')}
              >
                {language === 'ru' ? 'Цифры' : 'Numbers'}
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="difficulty-selector">
              <button 
                className={`control-btn ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => handleDifficultyChange('easy')}
              >
                {language === 'ru' ? 'Короткие' : 'Short'}
              </button>
              <button 
                className={`control-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => handleDifficultyChange('hard')}
              >
                {language === 'ru' ? 'Длинные' : 'Long'}
              </button>
            </div>

            <div className="test-settings">
              <select 
                value={testDuration} 
                onChange={(e) => setTestDuration(Number(e.target.value))}
                className="duration-select"
              >
                <option value="30">30 {language === 'ru' ? 'сек' : 'sec'}</option>
                <option value="60">60 {language === 'ru' ? 'сек' : 'sec'}</option>
                <option value="120">120 {language === 'ru' ? 'сек' : 'sec'}</option>
                <option value="300">5 {language === 'ru' ? 'мин' : 'min'}</option>
              </select>

              <div className="font-size-controls">
                <button 
                  className="control-btn"
                  onClick={() => setFontSize(size => Math.max(12, size - 2))}
                >
                  A-
                </button>
                <button 
                  className="control-btn"
                  onClick={() => setFontSize(size => Math.min(24, size + 2))}
                >
                  A+
                </button>
              </div>

              <button 
                className={`control-btn ${showHints ? 'active' : ''}`}
                onClick={() => setShowHints(!showHints)}
              >
                {language === 'ru' ? 'Подсказки' : 'Hints'}
              </button>
            </div>
          </div>
        </div>

        <div className="test-controls">
          <button className="restart-btn" onClick={handleRestart}>
            {language === 'ru' ? 'Начать заново' : 'Restart'}
          </button>
          <div className="timer">{timeLeft} {language === 'ru' ? 'сек' : 'sec'}</div>
        </div>
      </div>

      <div className="best-results">
        <div className="best-result">
          {language === 'ru' ? 'Рекорд в этом режиме:' : 'Best result in this mode:'}{' '}
          {getBestResult(language, mode, difficulty).wpm} WPM / {getBestResult(language, mode, difficulty).accuracy}% 
          {language === 'ru' ? ' точности' : ' accuracy'}
        </div>
      </div>

      <div className="text-display" style={{ fontSize: `${fontSize}px` }}>
        {text.split('').map((char, index) => {
          let className = 'char';
          if (index < userInput.length) {
            className += userInput[index] === char ? ' correct' : ' incorrect';
          }
          if (showHints && index === userInput.length) {
            const fingerHint = getFingerForKey(char);
            if (fingerHint) {
              className += ' next-char';
            }
          }
          return <span key={index} className={className}>{char}</span>;
        })}
      </div>

      {showHints && (
        <div className="finger-hint">
          {userInput.length < text.length && (
            <div className="hint-text">
              {language === 'ru' ? 'Используйте ' : 'Use '} 
              <strong>{getFingerForKey(text[userInput.length])}</strong>
            </div>
          )}
        </div>
      )}

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder={language === 'ru' ? 'Начните печатать...' : 'Start typing...'}
        disabled={!isActive && (userInput.length === text.length || isFinished || timeLeft === 0)}
        className="typing-input"
      />

      <div className="stats">
        <div className="stat">WPM: {wpm}</div>
        <div className="stat">{language === 'ru' ? 'Точность' : 'Accuracy'}: {accuracy}%</div>
      </div>

      <Keyboard pressedKey={pressedKey} />

      {isFinished && (
        <div className="finish-message">
          {language === 'ru' ? 'Тест завершён!' : 'Test completed!'} 
          {wpm > getBestResult(language, mode, difficulty).wpm ? '🎉 ' + (language === 'ru' ? 'Новый рекорд!' : 'New record!') : ''} 
          {language === 'ru' ? 'Нажмите "Начать заново" для новой попытки.' : 'Click "Restart" for a new attempt.'}
        </div>
      )}
    </div>
  );
};

export default TypingTest; 