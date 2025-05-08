import React, { useState, useEffect, useRef } from 'react';
import './TypingTest.css';
import Keyboard from '../Keyboard/Keyboard';
import { soundManager } from '../../sounds';
import SoundControl from '../SoundControl/SoundControl';
import GameModeSelector from '../GameModeSelector/GameModeSelector';
import { gameModes } from '../../data/gameModes';
import { texts } from '../../data/texts';

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
  const [gameMode, setGameMode] = useState('marathon');
  const [botProgress, setBotProgress] = useState(0);
  const [textChunks, setTextChunks] = useState([]);
  const [visibleChunks, setVisibleChunks] = useState([]);
  const botRef = useRef(null);
  const [botDifficulty, setBotDifficulty] = useState('normal');

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

    const currentMode = gameModes[gameMode];
    
    // Проверяем, разрешено ли использование backspace
    if (e.key === 'Backspace' && !currentMode.config.allowBackspace) {
      e.preventDefault();
      return;
    }

    setPressedKey(e.key);
  };

  const handleKeyPress = (e) => {
    const currentMode = gameModes[gameMode];
    const currentChar = text[userInput.length];

    // Обработка режима "выживание"
    if (currentMode.id === 'survival' && e.key !== currentChar) {
      setTimeLeft(prev => Math.max(0, prev - currentMode.config.mistakePenalty));
    }

    // Обработка режима "диктант"
    if (currentMode.id === 'dictation') {
      const currentChunkIndex = Math.floor(userInput.length / currentMode.config.textChunkSize);
      if (currentChunkIndex >= 0 && currentChunkIndex < textChunks.length && 
          !visibleChunks.includes(textChunks[currentChunkIndex])) {
        setVisibleChunks(prev => [...prev, textChunks[currentChunkIndex]]);
      }
    }

    // Воспроизведение звуков при нажатии
    if (e.key === currentChar) {
      if (e.key === ' ') {
        soundManager.play('keySpace');
      } else {
        soundManager.play('keyPress');
      }
    } else {
      soundManager.play('keyError');
    }
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
    setText(getRandomText());
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setBotProgress(0);
    setTimeLeft(gameMode === 'marathon' ? Infinity : testDuration);
    setIsFinished(false);
    setVisibleChunks([]);
    setTextChunks([]);
    setCurrentCharIndex(0);
    setCorrectChars(0);
    setErrors(0);
  };

  const startTimer = () => {
    // Implementation of startTimer function
  };

  // Добавим useEffect для инициализации текста при смене режима
  useEffect(() => {
    initializeText();
  }, [gameMode, language, mode, difficulty]);

  // Обновляем функцию initializeText для работы со словами
  const initializeText = () => {
    const selectedText = getRandomText();
    setText(selectedText);
    
    if (gameMode === 'dictation') {
      // Разбиваем текст на слова
      const words = selectedText.split(/(\s+)/);
      setTextChunks(words);
      // Показываем первые 2-3 слова
      const initialWords = words.slice(0, 3);
      setVisibleChunks(initialWords);
    }

    // Сброс состояния при смене текста
    setUserInput('');
    setCurrentCharIndex(0);
    setBotProgress(0);
    setCorrectChars(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setIsActive(false);
    setStartTime(null);
  };

  // Обновляем useEffect для обработки прогресса в режиме диктанта
  useEffect(() => {
    if (gameMode === 'dictation' && isActive) {
      const words = text.split(/(\s+)/);
      const typedLength = userInput.length;
      let visibleLength = 0;
      let visibleWordsCount = 0;

      // Определяем, сколько слов нужно показать
      for (let i = 0; i < words.length; i++) {
        visibleLength += words[i].length;
        if (visibleLength > typedLength + 15) { // Показываем слова на 15 символов вперед
          visibleWordsCount = i + 1;
          break;
        }
        visibleWordsCount = i + 1;
      }

      // Обновляем видимые слова
      setVisibleChunks(words.slice(0, Math.min(visibleWordsCount + 2, words.length)));
    }
  }, [gameMode, userInput, text, isActive]);

  // Обновляем функцию getRandomText
  const getRandomText = () => {
    if (gameMode === 'words') {
      const wordsList = texts[language].words[difficulty];
      const selectedWords = [];
      for (let i = 0; i < 10; i++) {
        const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
        selectedWords.push(randomWord);
      }
      return selectedWords.join(' ');
    }
    
    // Определяем категорию текста в зависимости от режима
    let textCategory;
    switch (mode) {
      case 'numbers':
        textCategory = 'numbers';
        break;
      case 'code':
        textCategory = 'technical';
        break;
      case 'text':
      default:
        textCategory = Math.random() < 0.5 ? 'quotes' : 'literature';
        break;
    }
    
    const availableTexts = texts[language][textCategory]?.[difficulty] || [];
    if (availableTexts.length === 0) {
      // Если тексты для выбранной категории отсутствуют, возвращаем запасной вариант
      return mode === 'numbers' ? 
        "12345 67890 98765 43210" : 
        "Text not available for this mode and language";
    }
    return availableTexts[Math.floor(Math.random() * availableTexts.length)];
  };

  // Обработчик изменения режима игры
  const handleGameModeChange = (newMode) => {
    setGameMode(newMode);
    handleRestart();
    
    // Сброс специфичных для режимов состояний
    setBotProgress(0);
    setTextChunks([]);
    setVisibleChunks([]);
  };

  // Обновляем конфигурацию скорости бота
  const botSpeedConfig = {
    easy: {
      baseSpeed: 25,
      randomVariation: 5,
      mistakeChance: 0.1,
      pauseDuration: 800,
      pauseChance: 0.08
    },
    normal: {
      baseSpeed: 40,
      randomVariation: 7,
      mistakeChance: 0.07,
      pauseDuration: 600,
      pauseChance: 0.06
    },
    hard: {
      baseSpeed: 55,
      randomVariation: 8,
      mistakeChance: 0.05,
      pauseDuration: 400,
      pauseChance: 0.04
    },
    expert: {
      baseSpeed: 70,
      randomVariation: 10,
      mistakeChance: 0.03,
      pauseDuration: 300,
      pauseChance: 0.02
    }
  };

  // Обновляем useEffect для режима гонки
  useEffect(() => {
    let botInterval;
    let lastUpdateTime = Date.now();
    let isPaused = false;
    let pauseTimeout = null;
    
    if (gameMode === 'race' && isActive && !isFinished) {
      const config = botSpeedConfig[botDifficulty];
      
      botInterval = setInterval(() => {
        if (isPaused) return;

        // Проверяем, нужно ли сделать паузу
        if (Math.random() < config.pauseChance) {
          isPaused = true;
          pauseTimeout = setTimeout(() => {
            isPaused = false;
          }, config.pauseDuration);
          return;
        }

        const now = Date.now();
        const deltaTime = now - lastUpdateTime;
        lastUpdateTime = now;

        // Добавляем случайную вариацию к базовой скорости
        const randomSpeed = config.baseSpeed + (Math.random() * 2 - 1) * config.randomVariation;
        
        // Уменьшаем скорость, если бот "ошибается"
        const effectiveSpeed = Math.random() < config.mistakeChance ? 
          randomSpeed * 0.3 : // Замедление при ошибке
          randomSpeed;

        const charactersPerSecond = (effectiveSpeed * 5) / 60;
        const progressIncrement = (charactersPerSecond * deltaTime / 1000 / text.length) * 100;

        setBotProgress(prev => {
          const newProgress = Math.min(prev + progressIncrement, 100);
          if (newProgress >= 100) {
            clearInterval(botInterval);
            if (userInput.length < text.length) {
              setIsFinished(true);
              setIsActive(false);
              soundManager.play('keyError');
            }
          }
          return newProgress;
        });
      }, 50);
    }

    return () => {
      if (botInterval) clearInterval(botInterval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [gameMode, isActive, isFinished, botDifficulty, text.length, userInput.length]);

  // Обновляем селектор сложности бота
  const renderBotDifficultySelector = () => {
    if (gameMode !== 'race') return null;

    return (
      <div className="bot-difficulty-selector">
        <label className="control-label">
          {language === 'ru' ? 'Сложность бота:' : 'Bot Difficulty:'}
        </label>
        <select 
          value={botDifficulty}
          onChange={(e) => setBotDifficulty(e.target.value)}
          className="difficulty-select"
        >
          <option value="easy">{language === 'ru' ? 'Легкий' : 'Easy'} (15 WPM)</option>
          <option value="normal">{language === 'ru' ? 'Средний' : 'Normal'} (25 WPM)</option>
          <option value="hard">{language === 'ru' ? 'Сложный' : 'Hard'} (35 WPM)</option>
          <option value="expert">{language === 'ru' ? 'Эксперт' : 'Expert'} (50 WPM)</option>
        </select>
      </div>
    );
  };

  // Обновляем компонент для отображения времени
  const renderTimer = () => {
    if (gameMode === 'marathon') {
      return (
        <div className="timer">
          {language === 'ru' ? 'Без ограничений' : 'No limit'}
        </div>
      );
    }
    return <div className="timer">{timeLeft} {language === 'ru' ? 'сек' : 'sec'}</div>;
  };

  return (
    <div className="typing-test">
      <div className="typing-test-header">
        <GameModeSelector
          selectedMode={gameMode}
          onModeSelect={handleGameModeChange}
          language={language}
        />

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

          {renderBotDifficultySelector()}
        </div>

        <div className="test-controls">
          <button className="restart-btn" onClick={handleRestart}>
            {language === 'ru' ? 'Начать заново' : 'Restart'}
          </button>
          {renderTimer()}
        </div>
      </div>

      <SoundControl />

      <div className="best-results">
        <div className="best-result">
          {language === 'ru' ? 'Рекорд в этом режиме:' : 'Best result in this mode:'}{' '}
          {getBestResult(language, mode, difficulty).wpm} WPM / {getBestResult(language, mode, difficulty).accuracy}% 
          {language === 'ru' ? ' точности' : ' accuracy'}
        </div>
      </div>

      <div className="test-area">
        {gameMode === 'race' && (
          <div className="race-progress">
            <div className="user-progress" style={{ width: `${(userInput.length / text.length) * 100}%` }} />
            <div className="bot-progress" style={{ width: `${botProgress}%` }} />
          </div>
        )}

        <div className={`text-display ${gameMode === 'dictation' ? 'dictation-mode' : ''}`} 
             style={{ fontSize: `${fontSize}px` }}>
          {(gameMode === 'dictation' ? 
            textChunks.map((chunk, i) => (
              <span 
                key={i} 
                className={`word ${visibleChunks.includes(chunk) ? 'visible' : ''}`}
              >
                {chunk.split('').map((char, charIndex) => {
                  const globalIndex = textChunks.slice(0, i).join('').length + charIndex;
                  let className = 'char';
                  if (globalIndex < userInput.length) {
                    className += userInput[globalIndex] === char ? ' correct' : ' incorrect';
                  } else if (globalIndex === userInput.length) {
                    className += ' current';
                  }
                  return <span key={charIndex} className={className}>{char}</span>;
                })}
              </span>
            ))
            : 
            text.split('').map((char, index) => {
              let className = 'char';
              if (index < userInput.length) {
                className += userInput[index] === char ? ' correct' : ' incorrect';
              } else if (index === userInput.length) {
                className += ' current';
              }
              return <span key={index} className={className}>{char}</span>;
            })
          )}
        </div>

        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyPress}
          onKeyUp={handleKeyUp}
          placeholder={language === 'ru' ? 'Начните печатать...' : 'Start typing...'}
          disabled={!isActive && (userInput.length === text.length || isFinished || timeLeft === 0)}
          style={{ fontSize: `${fontSize}px` }}
          className="typing-input"
        />
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