import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

const METRIC_LABELS: Record<string, string> = {
  heartrate: '❤️ Пульс',
  blood_pressure: '🩺 Давление',
  spo2: '🫁 SpO2',
  steps: '👣 Шаги',
};

const getShortcutUrl = (metrics: string[]): string => {
  const has = (m: string) => metrics.includes(m);
  const hr = has('heartrate');
  const bp = has('blood_pressure');
  const spo2 = has('spo2');
  const steps = has('steps');

  if (hr && bp && spo2 && steps) return 'https://www.icloud.com/shortcuts/570d2f3c5ac0448eb82f0ea083ca9d6f';
  if (hr && bp && steps && !spo2) return 'https://www.icloud.com/shortcuts/bfac837f21ac4ac696062fb6047558d1';
  if (hr && spo2 && steps && !bp) return 'https://www.icloud.com/shortcuts/8d69565ba0804dd2a8be8a340d73f7f7';
  if (bp && steps && !hr) return 'https://www.icloud.com/shortcuts/769d71fcf72a4fa185bcd3f2f9584f5d';
  if (hr && steps && !bp && !spo2) return 'https://www.icloud.com/shortcuts/d4342b95f70345fba9513100e7136f2f';
  if (steps && !hr && !bp && !spo2) return 'https://www.icloud.com/shortcuts/6dd942637b8245b6969277b6109d041f';
  return 'https://www.icloud.com/shortcuts/570d2f3c5ac0448eb82f0ea083ca9d6f';
};

export const PulseSetupPage: FC = () => {
  useTelegramBackButton();
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

  const shortcutUrl = getShortcutUrl(metrics);

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

        {/* Selected metrics block */}
        {metrics.length > 0 && (
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tg-theme-hint-color, #999)', marginBottom: 4 }}>
                Выбранные показатели
              </div>
              <div style={{ fontSize: 13, color: 'var(--tg-theme-text-color, #000)' }}>
                {metrics.map((m) => METRIC_LABELS[m] ?? m).join(', ')}
              </div>
            </div>
            <button
              onClick={() => navigate('/metrics-setup')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--tg-theme-button-color, #2481cc)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Изменить →
            </button>
          </div>
        )}

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
          <Button size="l" stretched onClick={() => window.open(shortcutUrl)}>
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


      </div>
    </Page>
  );
};
