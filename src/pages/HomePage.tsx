import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!userId) return;

    fetch(`https://telegram-doctor-bot.onrender.com/api/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const incomplete =
          !data.exists ||
          !data.date_of_birth ||
          !data.sex ||
          data.height == null ||
          data.weight == null;
        setProfileIncomplete(incomplete);
      })
      .catch(() => {});
  }, []);

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
            onClick={() => navigate('/health')}
          >
            🩺 Здоровье с Apple Watch
          </Button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Button
              size="l"
              stretched
              mode="outline"
              onClick={() => navigate('/profile')}
            >
              👤 Профиль
            </Button>
            {profileIncomplete && (
              <div style={{
                fontSize: 12,
                color: '#ec3942',
                textAlign: 'center',
                paddingTop: 2,
              }}>
                Заполните для точной диагностики
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};
