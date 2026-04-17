import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  console.log('userId:', userId);

  const handleAppleWatch = () => {
    const link = `shortcuts://run-shortcut?name=СимптоМед%20Пульс&input=${userId}`;
    window.open(link);
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
            mode="outline"
            onClick={handleAppleWatch}
          >
            ⌚ Подключить Apple Watch
          </Button>
          <div style={{
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Нажмите чтобы установить Shortcut для Apple Watch. После установки запускайте его для отправки пульса.
          </div>
        </div>
      </div>
    </Page>
  );
};
