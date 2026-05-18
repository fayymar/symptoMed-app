import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

export const PulsePage: FC = () => {
  const navigate = useNavigate();
  const platform = (window as any).Telegram?.WebApp?.platform;
  const isIOS = platform === 'ios';

  const handleSendPulse = () => {
    const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!userId) {
      alert('Откройте приложение через бота');
      return;
    }
    window.open(`shortcuts://run-shortcut?name=Symed%20-%20Пульс&input=${userId}`);
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
            ❤️ Пульс с Apple Watch
          </div>
          <div style={{
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Отслеживайте показатели здоровья автоматически
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
                Эта функция доступна только на iPhone
              </div>
              <div style={{
                fontSize: 14,
                color: 'var(--tg-theme-hint-color, #999)',
                lineHeight: 1.5,
              }}>
                Для работы с Apple Watch и автоматической отправки пульса нужен iPhone с приложением Здоровье.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button
                size="l"
                stretched
                onClick={handleSendPulse}
              >
                ❤️ Отправить пульс
              </Button>
              <Button
                size="l"
                stretched
                mode="outline"
                onClick={() => navigate('/heartrate')}
              >
                📊 История пульса
              </Button>
              <Button
                size="l"
                stretched
                mode="outline"
                onClick={() => navigate('/pulse-setup')}
              >
                ⚙️ Настройка Shortcut
              </Button>
              <div style={{
                fontSize: 13,
                color: 'var(--tg-theme-hint-color, #999)',
                textAlign: 'center',
                lineHeight: 1.5,
                marginTop: -4,
              }}>
                Установка и настройка для первого запуска
              </div>
            </div>
          )}
        </div>

        <div style={{ paddingTop: 24 }}>
          <Button
            size="l"
            stretched
            mode="outline"
            onClick={() => navigate('/')}
          >
            Назад
          </Button>
        </div>
      </div>
    </Page>
  );
};
