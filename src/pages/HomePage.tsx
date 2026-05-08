import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  fontSize: '16px',
  borderRadius: '12px',
  marginBottom: '10px',
  textAlign: 'center',
};

export const HomePage: FC = () => {
  const navigate = useNavigate();

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

        <div style={{ paddingBottom: 32 }}>
          <Button size="l" stretched style={btnStyle} onClick={() => navigate('/symptoms')}>
            Начать консультацию
          </Button>
          <Button size="l" stretched mode="outline" style={btnStyle} onClick={() => navigate('/history')}>
            История консультаций
          </Button>
          <Button size="l" stretched mode="outline" style={btnStyle} onClick={() => navigate('/health')}>
            📊 Показатели здоровья
          </Button>
          <Button size="l" stretched mode="outline" style={btnStyle} onClick={() => navigate('/profile')}>
            👤 Профиль
          </Button>
          <Button size="l" stretched mode="outline" style={btnStyle} onClick={() => navigate('/clinics')}>
            🏥 Клиники и специалисты
          </Button>
          <Button size="l" stretched mode="outline" style={btnStyle} onClick={() => navigate('/help')}>
            ❓ F.A.Q.
          </Button>
        </div>
      </div>
    </Page>
  );
};
