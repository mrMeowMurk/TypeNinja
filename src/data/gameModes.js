export const gameModes = {
  marathon: {
    id: 'marathon',
    nameRu: 'Марафон',
    nameEn: 'Marathon',
    descriptionRu: 'Печатайте без ограничения времени',
    descriptionEn: 'Type without time limits',
    config: {
      timeLimit: false,
      allowBackspace: true,
      progressiveText: false,
      botCompetition: false
    }
  },
  survival: {
    id: 'survival',
    nameRu: 'Выживание',
    nameEn: 'Survival',
    descriptionRu: 'Каждая ошибка уменьшает время',
    descriptionEn: 'Each mistake reduces time',
    config: {
      timeLimit: true,
      mistakePenalty: 5, // seconds
      allowBackspace: true,
      progressiveText: false,
      botCompetition: false
    }
  },
  words: {
    id: 'words',
    nameRu: 'Слова',
    nameEn: 'Words',
    descriptionRu: 'Тренировка на коротких словах',
    descriptionEn: 'Practice with short words',
    config: {
      timeLimit: false,
      allowBackspace: true,
      progressiveText: false,
      botCompetition: false,
      wordMode: true
    }
  },
  race: {
    id: 'race',
    nameRu: 'Гонка',
    nameEn: 'Race',
    descriptionRu: 'Соревнование с ботом',
    descriptionEn: 'Compete with a bot',
    config: {
      timeLimit: false,
      allowBackspace: true,
      progressiveText: false,
      botCompetition: true,
      botSpeed: {
        easy: 30,    // WPM
        medium: 50,  // WPM
        hard: 80     // WPM
      }
    }
  },
  dictation: {
    id: 'dictation',
    nameRu: 'Диктант',
    nameEn: 'Dictation',
    descriptionRu: 'Текст появляется постепенно',
    descriptionEn: 'Text appears gradually',
    config: {
      timeLimit: false,
      allowBackspace: true,
      progressiveText: true,
      botCompetition: false,
      textChunkSize: 50 // characters
    }
  },
  noBackspace: {
    id: 'noBackspace',
    nameRu: 'Без исправлений',
    nameEn: 'No Corrections',
    descriptionRu: 'Нельзя использовать backspace',
    descriptionEn: 'Cannot use backspace',
    config: {
      timeLimit: false,
      allowBackspace: false,
      progressiveText: false,
      botCompetition: false
    }
  }
}; 