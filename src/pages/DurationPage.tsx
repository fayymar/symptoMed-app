import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { sendDuration } from '@/api/consultation.ts';

const DURATIONS = [
  'Сегодня',
  '2–3 дня',
  'Около недели',
  '2–4 недели',
  'Больше месяца',
];

export const DurationPage: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDuration = async (duration: string) => {
    const sessionId = localStorage.getItem('symptoMed_sessionId') ?? '';
    setLoading(true);
    try {
      await sendDuration(sessionId, duration);
    } catch {
      // Continue navigation even if API fails
    } finally {
      setLoading(false);
    }
    navigate('/result');
  };

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
              {duration}
            </Button>
          ))}
        </div>
      </div>
    </Page>
  );
};
