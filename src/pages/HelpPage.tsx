import { useState, type FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { primaryButtonStyle } from '../styles/buttons';

const FAQ = [
  {
    q: 'Как начать консультацию?',
    a: 'Нажмите «Начать консультацию» → опишите симптомы → ответьте на уточняющие вопросы → получите рекомендацию специалиста.',
  },
  {
    q: 'Как подключить Apple Watch?',
    a: 'Перейдите в раздел «Показатели здоровья» → выберите ваши устройства → установите Shortcut → нажмите «Отправить показатели».',
  },
  {
    q: 'Какие устройства поддерживаются?',
    a: '• Apple Watch — пульс, SpO2, шаги\n• Тонометры Omron (через приложение Omron Connect + Apple Health) — давление\n• iPhone — шаги',
  },
  {
    q: 'Почему бот рекомендует именно этих специалистов?',
    a: 'Система анализирует ваши симптомы, давность, анамнез и показатели здоровья. Рекомендация — это предварительная оценка, не замена визиту к врачу.',
  },
  {
    q: 'Безопасны ли мои данные?',
    a: 'Данные хранятся в защищённой базе данных. Показатели здоровья не передаются третьим лицам.',
  },
  {
    q: 'Как обновить профиль?',
    a: 'Нажмите «Профиль» на главном экране → измените данные → нажмите «Сохранить».',
  },
];

export const HelpPage: FC = () => {
  useTelegramBackButton();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 4 }}>
          ❓ F.A.Q.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {FAQ.map((item, i) => (
            <div
              key={i}
              style={{
                background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)', flex: 1 }}>
                  {item.q}
                </span>
                <span style={{ fontSize: 20, color: 'var(--tg-theme-hint-color, #999)', marginLeft: 8, flexShrink: 0, lineHeight: 1 }}>
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <div style={{
                  padding: '0 16px 14px',
                  fontSize: 14,
                  color: 'var(--tg-theme-hint-color, #555)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <button style={primaryButtonStyle} onClick={() => window.open('https://t.me/medgg_bot', '_blank')}>
          Написать в поддержку
        </button>
      </div>
    </Page>
  );
};
