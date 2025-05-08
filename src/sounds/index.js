// Импортируем звуковые файлы для механической клавиатуры
import mechKeyPress from './mechanical/key-press.mp3';
import mechKeySpace from './mechanical/key-space.mp3';
import mechKeyError from './mechanical/key-error.mp3';

// Импортируем звуковые файлы для пишущей машинки
import typeKeyPress from './typewriter/key-press.mp3';
import typeKeySpace from './typewriter/key-space.mp3';
import typeKeyError from './typewriter/key-error.mp3';

// Импортируем звуковые файлы для мембранной клавиатуры
import softKeyPress from './soft/key-press.mp3';
import softKeySpace from './soft/key-space.mp3';
import softKeyError from './soft/key-error.mp3';

// Определяем звуковые темы
export const SOUND_THEMES = {
  mechanical: {
    name: 'Механическая',
    sounds: {
      keyPress: mechKeyPress,
      keySpace: mechKeySpace,
      keyError: mechKeyError,
    }
  },
  typewriter: {
    name: 'Пишущая машинка',
    sounds: {
      keyPress: typeKeyPress,
      keySpace: typeKeySpace,
      keyError: typeKeyError,
    }
  },
  soft: {
    name: 'Мембранная',
    sounds: {
      keyPress: softKeyPress,
      keySpace: softKeySpace,
      keyError: softKeyError,
    }
  }
};

// Класс для управления звуками
class SoundManager {
  constructor() {
    this.sounds = {};
    this.currentTheme = null;
    this.isEnabled = localStorage.getItem('typingSoundEnabled') === 'true';
    this.volume = parseFloat(localStorage.getItem('typingSoundVolume')) || 0.5;
    this.loadTheme('mechanical'); // Загружаем тему по умолчанию
  }

  loadTheme(themeName) {
    if (!SOUND_THEMES[themeName]) return;
    
    this.currentTheme = themeName;
    const theme = SOUND_THEMES[themeName];

    // Создаем и настраиваем аудио элементы для каждого типа звука
    Object.entries(theme.sounds).forEach(([key, soundSrc]) => {
      const audio = new Audio(soundSrc);
      audio.volume = this.volume;
      this.sounds[key] = audio;
    });

    localStorage.setItem('typingSoundTheme', themeName);
  }

  play(soundType) {
    if (!this.isEnabled || !this.sounds[soundType]) return;

    // Клонируем звук для возможности одновременного воспроизведения
    const sound = this.sounds[soundType].cloneNode();
    sound.volume = this.volume;
    sound.play().catch(() => {}); // Игнорируем ошибки воспроизведения
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
    localStorage.setItem('typingSoundVolume', this.volume.toString());
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('typingSoundEnabled', this.isEnabled.toString());
    return this.isEnabled;
  }

  getState() {
    return {
      isEnabled: this.isEnabled,
      currentTheme: this.currentTheme,
      volume: this.volume
    };
  }
}

export const soundManager = new SoundManager(); 