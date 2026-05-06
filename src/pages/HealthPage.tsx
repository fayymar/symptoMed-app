import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';

type SendStatus = 'idle' | 'waiting' | 'success' | 'error';

export const HealthPage: FC = () => {
  const navigate = useNavigate();
  const platform = (window as any).Telegram?.WebApp?.platform;
  const isIOS = platform === 'ios';
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const userId = useUserId();

  const handleSendMetrics = () => {
    if (!userId) {
      alert('Откройте приложение через бота');
      return;
    }

    window.open(`shortcuts://run-shortcut?name=СимптоМед%20-%20Здоровье&input=${userId}`);
    setSendStatus('waiting');

    setTimeout(() => {
      fetch(`https://telegram-doctor-bot.onrender.com/api/health/metrics/report/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setSendStatus('success');
        })
        .catch(() => setSendStatus('error'));
    }, 10000);
  };

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #000)',
            marginBottom: 8,
          }}>
            🩺 Здоровье
          </div>
          <div style={{
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Все показатели с Apple Watch и совместимых устройств
          </div>

          {!isIOS ? (
            <div style={{
              background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
              borderRadius: 12,
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <div style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--tg-theme-text-color, #000)',
                marginBottom: 8,
              }}>
                Функция доступна только на iPhone
              </div>
              <div style={{
                fontSize: 14,
                color: 'var(--tg-theme-hint-color, #999)',
                lineHeight: 1.5,
              }}>
                Для работы с Apple Watch и автоматической отправки показателей нужен iPhone с приложением Здоровье.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button
                size="l"
                stretched
                disabled={sendStatus === 'waiting'}
                onClick={handleSendMetrics}
              >
                📤 Отправить показатели сейчас
              </Button>

              {sendStatus === 'waiting' && (
                <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center' }}>
                  ⏳ Отправка...
                </div>
              )}
              {sendStatus === 'success' && (
                <div style={{ fontSize: 14, color: '#34C759', textAlign: 'center', fontWeight: 500 }}>
                  ✅ Отчёт отправлен в чат
                </div>
              )}
              {sendStatus === 'error' && (
                <div style={{ fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
                  Попробуйте ещё раз
                </div>
              )}

              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--tg-theme-hint-color, #999)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginTop: 8,
                paddingLeft: 4,
              }}>
                📊 История
              </div>

              <Button size="l" stretched mode="outline" onClick={() => navigate('/metrics/heartrate')}>
                ❤️ Пульс
              </Button>
              <Button size="l" stretched mode="outline" onClick={() => navigate('/metrics/blood-pressure')}>
                🩺 Давление
              </Button>
              <Button size="l" stretched mode="outline" onClick={() => navigate('/metrics/spo2')}>
                🫁 Сатурация (SpO2)
              </Button>
              <Button size="l" stretched mode="outline" onClick={() => navigate('/metrics/steps')}>
                👣 Шаги
              </Button>

              <Button size="l" stretched mode="outline" onClick={() => navigate('/pulse-setup')}
                style={{ marginTop: 8 }}>
                ⚙️ Настройка Shortcut
              </Button>
            </div>
          )}
        </div>

        <div style={{ paddingTop: 24 }}>
          <Button size="l" stretched mode="outline" onClick={() => navigate('/')}>
            Назад
          </Button>
        </div>
      </div>
    </Page>
  );
};
