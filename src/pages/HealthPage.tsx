import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { primaryButtonStyle } from '../styles/buttons';

type SendStatus = 'idle' | 'waiting' | 'success' | 'error';

// Design tokens
const accent = '#10A875';
const accentSoft = 'rgba(16,168,117,0.14)';
const okColor = '#34d399';
const okSoft = 'rgba(52, 211, 153, 0.14)';
const infoColor = '#60a5fa';
const infoSoft = 'rgba(96, 165, 250, 0.14)';
const dangerColor = '#f87171';
const dangerSoft = 'rgba(248, 113, 113, 0.14)';
const warnSoft = 'rgba(251, 191, 36, 0.14)';

interface MetricCard {
  id: string;
  icon: string;
  label: string;
  unit: string;
  plateBg: string;
  plateColor: string;
  path: string;
}

const METRIC_CARDS: MetricCard[] = [
  { id: 'heartrate', icon: '❤️', label: 'Пульс', unit: 'уд/мин', plateBg: dangerSoft, plateColor: dangerColor, path: '/metrics/heartrate' },
  { id: 'blood_pressure', icon: '🩺', label: 'Давление', unit: 'мм рт.ст.', plateBg: infoSoft, plateColor: infoColor, path: '/metrics/blood-pressure' },
  { id: 'spo2', icon: '🫁', label: 'SpO2', unit: '%', plateBg: okSoft, plateColor: okColor, path: '/metrics/spo2' },
  { id: 'steps', icon: '👣', label: 'Шаги', unit: 'шагов', plateBg: accentSoft, plateColor: accent, path: '/metrics/steps' },
];

export const HealthPage: FC = () => {
  useTelegramBackButton();
  const navigate = useNavigate();
  const platform = (window as any).Telegram?.WebApp?.platform;
  const isIOS = platform === 'ios';
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const userId = useUserId();

  const metrics: string[] = JSON.parse(
    localStorage.getItem('symptomed_metrics') || '["heartrate","blood_pressure","spo2","steps"]'
  );

  const handleSendMetrics = () => {
    if (!userId) {
      alert('Откройте приложение через бота');
      return;
    }
    window.open(`shortcuts://run-shortcut?name=Symed%20-%20Здоровье&input=${userId}`);
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

  const activeMetrics = METRIC_CARDS.filter((m) => metrics.includes(m.id));

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--tg-theme-bg-color)',
        fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px 8px',
          gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--tg-theme-text-color)',
            }}>
              📊 Показатели здоровья
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--tg-theme-hint-color)',
              marginTop: 2,
              letterSpacing: '-0.003em',
            }}>
              Apple Watch и совместимые устройства
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '8px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {!isIOS ? (
            /* Non-iOS warning */
            <div style={{
              background: 'var(--tg-theme-secondary-bg-color)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: warnSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
              }}>
                ⚠️
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--tg-theme-text-color)',
                letterSpacing: '-0.01em',
              }}>
                Только для iPhone
              </div>
              <div style={{
                fontSize: 13,
                color: 'var(--tg-theme-hint-color)',
                lineHeight: 1.5,
                maxWidth: 260,
              }}>
                Для работы с Apple Watch нужен iPhone с приложением «Здоровье».
              </div>
            </div>
          ) : (
            <>
              {/* Send metrics button */}
              <button
                disabled={sendStatus === 'waiting'}
                onClick={handleSendMetrics}
                style={{
                  ...primaryButtonStyle,
                  marginBottom: 0,
                  height: 56,
                  opacity: sendStatus === 'waiting' ? 0.6 : 1,
                }}
              >
                {sendStatus === 'idle' && '📤 Отправить показатели сейчас'}
                {sendStatus === 'waiting' && '⏳ Отправка...'}
                {sendStatus === 'success' && '✅ Отчёт отправлен'}
                {sendStatus === 'error' && '⚠️ Попробуйте ещё раз'}
              </button>

              {/* Section label */}
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--tg-theme-hint-color)',
                paddingLeft: 4,
                marginTop: 4,
              }}>
                История
              </div>

              {/* Metric cards grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}>
                {activeMetrics.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => navigate(m.path)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      padding: '14px 14px 14px',
                      borderRadius: 16,
                      background: 'var(--tg-theme-secondary-bg-color)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
                    onTouchStart={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onTouchEnd={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: m.plateBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}>
                      {m.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--tg-theme-text-color)',
                        letterSpacing: '-0.005em',
                      }}>
                        {m.label}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: 'var(--tg-theme-hint-color)',
                        marginTop: 2,
                      }}>
                        {m.unit}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Setup buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => navigate('/pulse-setup')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 16,
                    background: 'var(--tg-theme-secondary-bg-color)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    flexShrink: 0,
                  }}>
                    ⚙️
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--tg-theme-text-color)', letterSpacing: '-0.005em' }}>
                      Настройка Shortcut
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tg-theme-hint-color)', marginTop: 2 }}>
                      Подключение и конфигурация
                    </div>
                  </div>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={() => navigate('/metrics-setup')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 16,
                    background: 'var(--tg-theme-secondary-bg-color)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    flexShrink: 0,
                  }}>
                    📱
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--tg-theme-text-color)', letterSpacing: '-0.005em' }}>
                      Изменить устройства
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tg-theme-hint-color)', marginTop: 2 }}>
                      Управление источниками данных
                    </div>
                  </div>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Page>
  );
};
