import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

export const HomePage: FC = () => {
  const navigate = useNavigate();

  const handleSendPulse = () => {
    const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!userId) {
      alert('Откройте приложение через бота');
      return;
    }
    window.open(`shortcuts://run-shortcut?name=СимптоМед%20-%20Пульс&input=${userId}`);
  };

  const handleInstallShortcut = () => {
    window.open('https://www.icloud.com/shortcuts/33e4af7a107746b885145d00a6f5b58d');
  };

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>🩺</div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #000)',
            textAlign: 'center',
          }}>
            СимптоМед
          </div>
          <div style={{
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
            maxWidth: 260,
          }}>
            Медицинская консультация на основе ваших симптомов
          </div>
        </div>

        <div style={{ paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button
            size="l"
            stretched
            onClick={() => navigate('/symptoms')}
          >
            Начать консультацию
          </Button>
          <Button
            size="l"
            stretched
            mode="outline"
            onClick={() => {}}
          >
            История консультаций
          </Button>
          <Button
            size="l"
            stretched
            mode="outline"
            onClick={() => navigate('/heartrate')}
          >
            ❤️ История пульса
          </Button>
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
            onClick={handleInstallShortcut}
          >
            ⌚ Установить Shortcut
          </Button>
          <div style={{
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Если ещё не установлен на этом устройстве
          </div>
          <Button
            size="l"
            stretched
            mode="outline"
            onClick={() => navigate('/setup-shortcut')}
          >
            🔧 Настроить Shortcut
          </Button>
          <Button
            size="l"
            stretched
            mode="outline"
            onClick={() => navigate('/automation')}
          >
            ⚙️ Настроить автоматическую отправку
          </Button>
        </div>
      </div>
    </Page>
  );
};
