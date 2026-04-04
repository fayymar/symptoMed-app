import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const MOCK_QUESTIONS = [
  {
    question: 'Как бы вы описали боль?',
    options: ['Острая, резкая', 'Тупая, ноющая', 'Пульсирующая', 'Жжение', 'Давящая'],
  },
  {
    question: 'Боль усиливается при движении?',
    options: ['Да, значительно', 'Немного', 'Нет', 'Затрудняюсь ответить'],
  },
  {
    question: 'Есть ли сопутствующие симптомы?',
    options: ['Тошнота', 'Головокружение', 'Слабость', 'Температура', 'Нет'],
  },
];

export const QuestionsPage: FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = MOCK_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / MOCK_QUESTIONS.length) * 100;

  const handleAnswer = () => {
    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/duration');
    }
  };

  return (
    <Page back={true}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '0 16px 32px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          height: 4,
          background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
          borderRadius: 2,
          marginBottom: 32,
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--tg-theme-button-color, #007AFF)',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>

        <div style={{
          fontSize: 13,
          color: 'var(--tg-theme-hint-color, #999)',
          marginBottom: 8,
        }}>
          Вопрос {currentIndex + 1} из {MOCK_QUESTIONS.length}
        </div>
        <div style={{
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #000)',
          marginBottom: 24,
          lineHeight: 1.4,
        }}>
          {current.question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {current.options.map((option) => (
            <Button
              key={option}
              size="m"
              stretched
              mode="outline"
              onClick={handleAnswer}
            >
              {option}
            </Button>
          ))}
        </div>

        <div style={{ paddingTop: 16 }}>
          <Button
            size="m"
            stretched
            mode="plain"
            onClick={handleAnswer}
          >
            Написать своё
          </Button>
        </div>
      </div>
    </Page>
  );
};
