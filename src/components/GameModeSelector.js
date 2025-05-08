import React from 'react';
import { gameModes } from '../data/gameModes';
import './GameModeSelector.css';

const GameModeSelector = ({ selectedMode, onModeSelect, language }) => {
  return (
    <div className="game-mode-selector">
      <h2>{language === 'ru' ? 'Выберите режим' : 'Select Mode'}</h2>
      <div className="mode-grid">
        {Object.values(gameModes).map((mode) => (
          <button
            key={mode.id}
            className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
            onClick={() => onModeSelect(mode.id)}
          >
            <h3>{language === 'ru' ? mode.nameRu : mode.nameEn}</h3>
            <p>{language === 'ru' ? mode.descriptionRu : mode.descriptionEn}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameModeSelector; 