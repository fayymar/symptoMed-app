import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { sendDuration } from '@/api/consultation.ts';
import { useConsultation } from '@/contexts/ConsultationContext.tsx';

const DURATIONS = [
  'Сегодня',
  '2–3 дня',
  'Около недели',
  '2–4 недели',
  'Больше месяца',
];

type Step = 'duration' | 'anamnesis';

export const DurationPage: FC = () => {
  const navigate = useNavigate();
  const { sessionId, setDuration, setAnamnesisData, setAnamnesisAnswer, anamnesisAnswers } = useConsultation();
  const [step, setStep] = useState<Step>('duration');
  const [anamnesisQuestions, setLocalAnamnesisQuestions] = useState<{ text: string; options: string[] }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDuration = async (duration: string) => {
    setLoading(true);
    setError('');
    setDuration(duration);
    try {
      const data = await sendDuration(sessionId, duration);
      const questions = data.anamnesis_questions ?? [];
      setAnamnesisData(questions);
      setLocalAnamnesisQuestions(questions);
      if (questions.length > 0) {
        setStep('anamnesis');
        setCurrentIndex(0);
      } else {
        navigate('/loading');
      }
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnamnesisAnswer = (answer: string) => {
    setAnamnesisAnswer(currentIndex, answer);
    if (currentIndex < anamnesisQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/loading');
    }
  };

  if (step === 'anamnesis' && anamnesisQuestions.length > 0) {
    const current = anamnesisQuestions[currentIndex];
    const progress = ((currentIndex + 1) / anamnesisQuestions.length) * 100;

    return (
      <Page back={false}>
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
            Уточняющий вопрос {currentIndex + 1} из {anamnesisQuestions.length}
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
                onClick={() => handleAnamnesisAnswer(option)}
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
              onClick={() => handleAnamnesisAnswer('Другое')}
            >
              Написать своё
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page back={true}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--tg-theme-text-color, #000)',
          marginBottom: 8,
        }}>
          Как давно появились симптомы?
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--tg-theme-hint-color, #999)',
          marginBottom: 32,
        }}>
          Выберите наиболее подходящий вариант
        </div>

        {error && (
          <div style={{ marginBottom: 16, fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DURATIONS.map((duration) => (
            <Button
              key={duration}
              size="l"
              stretched
              mode="outline"
              disabled={loading}
              onClick={() => handleDuration(duration)}
            >
              {loading ? 'Загрузка...' : duration}
            </Button>
          ))}
        </div>
      </div>
    </Page>
  );
};
