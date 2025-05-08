import React, { useState, useEffect } from 'react';
import { soundManager, SOUND_THEMES } from '../../sounds';
import './SoundControl.css';

const SoundControl = () => {
  const [soundState, setSoundState] = useState(soundManager.getState());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Обновляем состояние при монтировании компонента
    setSoundState(soundManager.getState());
  }, []);

  const handleToggleSound = () => {
    const isEnabled = soundManager.toggle();
    setSoundState(prev => ({ ...prev, isEnabled }));
  };

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    soundManager.setVolume(volume);
    setSoundState(prev => ({ ...prev, volume }));
  };

  const handleThemeChange = (theme) => {
    soundManager.loadTheme(theme);
    setSoundState(prev => ({ ...prev, currentTheme: theme }));
    // Проигрываем тестовый звук
    soundManager.play('keyPress');
    // Закрываем панель после выбора темы
    setIsExpanded(false);
  };

  return (
    <div className={`sound-control ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sound-control__header">
        <button 
          className={`sound-toggle ${soundState.isEnabled ? 'active' : ''}`}
          onClick={handleToggleSound}
          aria-label="Включить/выключить звук"
        >
          {soundState.isEnabled ? '🔊' : '🔇'}
        </button>
        {soundState.isEnabled && (
          <>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundState.volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Громкость"
            />
            <button 
              className="expand-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          </>
        )}
      </div>
      
      {soundState.isEnabled && isExpanded && (
        <div className="sound-themes">
          {Object.entries(SOUND_THEMES).map(([themeKey, theme]) => (
            <button
              key={themeKey}
              className={`theme-button ${soundState.currentTheme === themeKey ? 'active' : ''}`}
              onClick={() => handleThemeChange(themeKey)}
            >
              {theme.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoundControl; 