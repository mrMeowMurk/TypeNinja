import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Проверяем системные настройки
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Устанавливаем атрибут на html элемент
    document.documentElement.setAttribute('data-theme', theme);
    // Сохраняем выбор пользователя
    localStorage.setItem('theme', theme);
    // Добавляем/удаляем класс для body
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle; 