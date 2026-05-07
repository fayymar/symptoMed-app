import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';

const SHORTCUT_URL = 'https://www.icloud.com/shortcuts/5803e08e3cf147908cae4e582fc45194';

const METRIC_LABELS: Record<string, string> = {
  heartrate: 'пульс',
  blood_pressure: 'давление',
  spo2: 'SpO2',
  steps: 'шаги',
};

export const PulseSetupPage: FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const [copied, setCopied] = useState(false);
  const [metrics, setMetrics] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('symptomed_metrics');
    if (stored) {
      try {
        setMetrics(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleCopy = () => {
    if (!userId) return;
    navigator.clipboard.writeText(String(userId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleTest = () => {
    if (!userId) return;
    window.open(`shortcuts://run-shortcut?name=СимптоМед%20—%20Здоровье&input=${userId}`);
  };

  const metricsLabel = metrics.length > 0
    ? 'Будем отслеживать: ' + metrics.map((m) => METRIC_LABELS[m] ?? m).join(', ')
    : 'Подключите устройства для отслеживания показателей здоровья';

  const blockStyle: React.CSSProperties = {
    background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
    borderRadius: 16,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const stepTitleStyle: React.CSSProperties = {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--tg-theme-text-color, #000)',
  };

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
        gap: 16,
      }}>
        {/* Header */}
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 6 }}>
            ⚙️ Подключите ваши устройства
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            {metricsLabel}
          </div>
        </div>

        {/* Step 1 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>1. Скопируйте ваш код</div>
          {userId ? (
            <>
              <div style={{
                background: 'var(--tg-theme-bg-color, #fff)',
                border: '2px solid var(--tg-theme-button-color, #2481cc)',
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--tg-theme-text-color, #000)',
                letterSpacing: 2,
              }}>
                {userId}
              </div>
              <Button size="l" stretched onClick={handleCopy}>
                {copied ? '✅ Скопировано' : 'Скопировать'}
              </Button>
              <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center' }}>
                Этот код нужен чтобы данные приходили именно вам
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center', lineHeight: 1.6 }}>
              Не удалось определить ID. Откройте бота и отправьте команду{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>/start</span> — бот ответит вашим ID.
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>2. Установите Shortcut</div>
          <Button size="l" stretched onClick={() => window.open(SHORTCUT_URL)}>
            Установить Shortcut
          </Button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 2 }}>После нажатия:</div>
            {[
              '➊ Нажмите «Добавить команду»',
              '➋ Вставьте ваш код когда появится поле',
              '➌ Нажмите «Добавить» ещё раз',
            ].map((step, i) => (
              <div key={i} style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.5 }}>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>3. Готово!</div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            Нажмите «Отправить показатели» — данные придут в бот автоматически
          </div>
          <Button size="l" stretched disabled={!userId} onClick={handleTest}>
            Проверить — отправить сейчас
          </Button>
        </div>

        {/* Change metrics */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/metrics-setup')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--tg-theme-hint-color, #999)',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Изменить набор показателей
          </button>
        </div>

        <Button size="l" stretched mode="outline" onClick={() => navigate('/health')}>
          Назад
        </Button>
      </div>
    </Page>
  );
};
