import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { startConsultation } from '@/api/consultation.ts';
import { useConsultation } from '@/contexts/ConsultationContext.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

export const SymptomsPage: FC = () => {
  useTelegramBackButton();
  const navigate = useNavigate();
  const { setSessionData, setSymptoms: saveSymptoms } = useConsultation();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsMetrics, setNeedsMetrics] = useState<string[]>([]);
  const [pendingNavigate, setPendingNavigate] = useState(false);
  const userId = useUserId();

  const proceed = () => {
    setNeedsMetrics([]);
    setPendingNavigate(false);
    navigate('/questions');
  };

  const handleNext = async () => {
    setLoading(true);
    setError('');
    console.log('POST /api/consultation/start', { user_id: userId, symptoms });
    try {
      const data = await startConsultation(userId ?? 0, symptoms);
      saveSymptoms(symptoms);
      setSessionData(
        data.session_id,
        data.questions ?? [],
        data.red_flag ?? null,
        data.needs_fresh_metrics ?? [],
      );

      if (data.red_flag?.text) {
        alert(`🚨 Срочно обратитесь к врачу\n\n${data.red_flag.text}`);
      }

      if (data.needs_fresh_metrics && data.needs_fresh_metrics.length > 0) {
        setNeedsMetrics(data.needs_fresh_metrics);
        setPendingNavigate(true);
      } else {
        navigate('/questions');
      }
    } catch (err) {
      const msg = 'Ошибка соединения. Попробуйте ещё раз.';
      console.error('startConsultation error:', err);
      alert(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMeasure = () => {
    if (!userId) return;
    window.open(`shortcuts://run-shortcut?name=Symed%20-%20Здоровье&input=${userId}`);
  };

  return (
    <Page back={false}>
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
          style={{ minHeight: '100px', maxHeight: '150px' }}
        />

        {error && (
          <div style={{ marginTop: 12, fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {pendingNavigate && needsMetrics.length > 0 && (
          <div style={{
            marginTop: 16,
            padding: 16,
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)' }}>
              💡 Для точного анализа измерьте:
            </div>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)' }}>
              {needsMetrics.join(', ')}
            </div>
            <Button size="m" stretched onClick={handleMeasure}>
              Измерить сейчас
            </Button>
            <Button size="m" stretched mode="outline" onClick={proceed}>
              Продолжить без измерений
            </Button>
          </div>
        )}

        {!pendingNavigate && (
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
        )}
      </div>
    </Page>
  );
};
