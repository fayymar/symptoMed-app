import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

const METRICS = [
  { id: 'heartrate', icon: '❤️', name: 'Пульс', sub: 'Apple Watch или другие умные часы' },
  { id: 'blood_pressure', icon: '🩺', name: 'Давление', sub: 'Тонометр Omron (синхронизируется с Apple Health)' },
  { id: 'spo2', icon: '🫁', name: 'Сатурация (SpO2)', sub: 'Apple Watch Series 6+ или Ultra' },
  { id: 'steps', icon: '👣', name: 'Шаги', sub: 'iPhone или любые умные часы' },
];

export const MetricsSetupPage: FC = () => {
  useTelegramBackButton();
  const navigate = useNavigate();
  const userId = useUserId();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinue = async () => {
    const metrics = Array.from(selected);
    localStorage.setItem('symptomed_metrics', JSON.stringify(metrics));
    localStorage.setItem('symptomed_metrics_setup_done', 'true');
    if (userId) {
      try {
        await fetch(`https://telegram-doctor-bot.onrender.com/api/profile/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ available_metrics: metrics }),
        });
      } catch {}
    }
    navigate('/pulse-setup');
  };

  const handleSkip = () => {
    localStorage.setItem('symptomed_metrics', '[]');
    navigate('/health');
  };

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 8 }}>
            Какие данные вы можете отслеживать?
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            Выберите всё что есть — мы подберём подходящий Shortcut
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {METRICS.map((m) => {
            const isSelected = selected.has(m.id);
            return (
              <div
                key={m.id}
                onClick={() => toggle(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px',
                  borderRadius: 12,
                  border: `2px solid ${isSelected ? 'var(--tg-theme-button-color, #10A875)' : 'var(--tg-theme-secondary-bg-color, #e0e0e0)'}`,
                  background: isSelected ? 'rgba(36, 129, 204, 0.07)' : 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <div style={{ fontSize: 36, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tg-theme-hint-color, #999)', marginTop: 2 }}>
                    {m.sub}
                  </div>
                </div>
                {isSelected && (
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    background: 'var(--tg-theme-button-color, #10A875)',
                    color: 'var(--tg-theme-button-text-color, #fff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button size="l" stretched disabled={selected.size === 0} onClick={handleContinue}>
          Продолжить
        </Button>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 14,
              color: 'var(--tg-theme-hint-color, #999)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Пропустить
          </button>
        </div>
      </div>
    </Page>
  );
};
