import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { sendAnswers } from '@/api/consultation.ts';
import { useConsultation } from '@/contexts/ConsultationContext.tsx';

export const QuestionsPage: FC = () => {
  const navigate = useNavigate();
  const { sessionId, questions, answers, setAnswer } = useConsultation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId: number | undefined = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  if (questions.length === 0) {
    navigate('/');
    return null;
  }

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = async (answer: string) => {
    setAnswer(currentIndex, answer);

    const isLast = currentIndex >= questions.length - 1;

    if (isLast) {
      setLoading(true);
      setError('');
      const finalAnswers = [...answers];
      finalAnswers[currentIndex] = answer;
      try {
        await sendAnswers(sessionId, userId ?? 0, finalAnswers);
      } catch {
        setError('Ошибка соединения. Попробуйте ещё раз.');
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/duration');
    } else {
      setCurrentIndex(currentIndex + 1);
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

        <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 8 }}>
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

        {error && (
          <div style={{ marginBottom: 12, fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
            {error}
          </div>
        )}

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
