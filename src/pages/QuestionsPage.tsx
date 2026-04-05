import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { sendAnswer, type Question } from '@/api/consultation.ts';

export const QuestionsPage: FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('symptoMed_questions');
    if (stored) {
      setQuestions(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (questions.length === 0) return null;

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = async (answer: string) => {
    const sessionId = localStorage.getItem('symptoMed_sessionId') ?? '';
    setLoading(true);
    try {
      await sendAnswer(sessionId, currentIndex, answer);
    } catch {
      // Continue navigation even if API fails
    } finally {
      setLoading(false);
    }
    if (currentIndex < questions.length - 1) {
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
          Вопрос {currentIndex + 1} из {questions.length}
        </div>
        <div style={{
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #000)',
          marginBottom: 24,
          lineHeight: 1.4,
        }}>
          {current.text}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {current.options.map((option) => (
            <Button
              key={option}
              size="m"
              stretched
              mode="outline"
              disabled={loading}
              onClick={() => handleAnswer(option)}
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
            disabled={loading}
            onClick={() => handleAnswer('Другое')}
          >
            Написать своё
          </Button>
        </div>
      </div>
    </Page>
  );
};
