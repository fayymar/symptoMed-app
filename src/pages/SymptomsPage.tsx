import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { startConsultation } from '@/api/consultation.ts';

export const SymptomsPage: FC = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await startConsultation(1, symptoms);
      localStorage.setItem('symptoMed_sessionId', data.sessionId);
      localStorage.setItem('symptoMed_questions', JSON.stringify(data.questions));
      navigate('/questions');
    } catch {
      setError('Ошибка соединения. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page back={true}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--tg-theme-text-color, #000)',
          marginBottom: 8,
        }}>
          Опишите симптомы
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--tg-theme-hint-color, #999)',
          marginBottom: 24,
        }}>
          Расскажите, что вас беспокоит, как можно подробнее
        </div>

        <Textarea
          placeholder="Например: болит голова, температура 37.5, слабость..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{ flex: 1, minHeight: 180 }}
        />

        {error && (
          <div style={{
            marginTop: 12,
            fontSize: 14,
            color: '#ec3942',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <div style={{ paddingTop: 24, paddingBottom: 32 }}>
          <Button
            size="l"
            stretched
            disabled={symptoms.trim().length === 0 || loading}
            onClick={handleNext}
          >
            {loading ? 'Загрузка...' : 'Далее'}
          </Button>
        </div>
      </div>
    </Page>
  );
};
