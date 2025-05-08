import React from 'react';
import './Keyboard.css';

const Keyboard = ({ pressedKey }) => {
  const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl']
  ];

  const getKeyClass = (key) => {
    let className = 'key';
    
    // Добавляем специальные классы для широких клавиш
    if (['Backspace', 'Tab', 'Caps', 'Shift', 'Enter'].includes(key)) {
      className += ' key-wide';
    }
    if (key === 'Space') {
      className += ' key-space';
    }
    
    // Подсвечиваем нажатую клавишу
    if (pressedKey && pressedKey.toLowerCase() === key.toLowerCase()) {
      className += ' key-pressed';
    }
    
    return className;
  };

  return (
    <div className="keyboard">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <div
              key={`${rowIndex}-${keyIndex}`}
              className={getKeyClass(key)}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 