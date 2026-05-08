import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';

// Design tokens from SymptoMed Redesign
const accent = '#f5b942';
const accentInk = '#1c1000';
const accentSoft = 'rgba(245, 185, 66, 0.14)';
const okColor = '#34d399';
const okSoft = 'rgba(52, 211, 153, 0.14)';
const infoColor = '#60a5fa';
const infoSoft = 'rgba(96, 165, 250, 0.14)';
const violetColor = '#c084fc';
const violetSoft = 'rgba(192, 132, 252, 0.14)';


interface MenuItem {
  icon: string;
  label: string;
  sub: string;
  path: string;
  plateBg: string;
  plateColor: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '📋', label: 'История консультаций', sub: 'Ваши прошлые консультации', path: '/history', plateBg: infoSoft, plateColor: infoColor },
  { icon: '📊', label: 'Показатели здоровья', sub: 'Apple Watch и умные часы', path: '/health', plateBg: okSoft, plateColor: okColor },
  { icon: '👤', label: 'Профиль', sub: 'Личные данные и анамнез', path: '/profile', plateBg: accentSoft, plateColor: accent },
  { icon: '🏥', label: 'Клиники и специалисты', sub: 'Медицинские учреждения', path: '/clinics', plateBg: violetSoft, plateColor: violetColor },
  { icon: '❓', label: 'F.A.Q.', sub: 'Частые вопросы', path: '/help', plateBg: 'rgba(255,255,255,0.06)', plateColor: 'var(--tg-theme-hint-color, #9ba3b5)' },
];

export const HomePage: FC = () => {
  const navigate = useNavigate();

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

        {/* Hero */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 40,
          paddingBottom: 28,
          gap: 14,
        }}>
          {/* Logo plate */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: accentSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}>
            🩺
          </div>

          <div style={{ textAlign: 'center', gap: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: accent,
            }}>
              СимптоМед
            </div>
            <div style={{
              fontSize: 14,
              color: 'var(--tg-theme-hint-color)',
              letterSpacing: '-0.005em',
              maxWidth: 220,
              lineHeight: 1.4,
              textAlign: 'center',
            }}>
              AI-диагностика на основе симптомов
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div style={{ padding: '0 16px', marginBottom: 8 }}>
          <button
            onClick={() => navigate('/symptoms')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 56,
              borderRadius: 16,
              background: accent,
              color: accentInk,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: `0 4px 20px rgba(245, 185, 66, 0.30)`,
              transition: 'transform 0.1s, opacity 0.15s',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
            onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Начать консультацию
          </button>
        </div>

        {/* Menu list */}
        <div style={{ flex: 1, padding: '8px 16px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
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
                transition: 'opacity 0.15s',
              }}
              onMouseDown={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
              onTouchStart={(e) => (e.currentTarget.style.opacity = '0.7')}
              onTouchEnd={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {/* Icon plate */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: item.plateBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}>
                {item.icon}
              </div>

              {/* Labels */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--tg-theme-text-color)',
                  letterSpacing: '-0.005em',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--tg-theme-hint-color)',
                  letterSpacing: '-0.003em',
                }}>
                  {item.sub}
                </div>
              </div>

              {/* Chevron */}
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
};
