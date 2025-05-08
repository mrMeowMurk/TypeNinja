import React, { useState } from 'react';
import './CustomTextModal.css';

const CustomTextModal = ({ isOpen, onClose, onSave, language }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && title.trim()) {
      onSave({ title, text });
      setText('');
      setTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{language === 'ru' ? 'Добавить свой текст' : 'Add custom text'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              {language === 'ru' ? 'Название' : 'Title'}:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ru' ? 'Введите название' : 'Enter title'}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="text">
              {language === 'ru' ? 'Текст' : 'Text'}:
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={language === 'ru' ? 'Введите текст для тренировки' : 'Enter practice text'}
              required
              rows="6"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary">
              {language === 'ru' ? 'Сохранить' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomTextModal; 