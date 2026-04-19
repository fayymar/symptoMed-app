import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

export const AutomationPage: FC = () => {
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
        <div style={{ flex: 1, paddingTop: 24, paddingBottom: 24 }}>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #000)',
            marginBottom: 12,
          }}>
            ⚙️ Автоматическая отправка пульса
          </div>
          <div style={{
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Настройте один раз чтобы пульс отправлялся сам каждое утро или по расписанию.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Откройте приложение Быстрые команды на iPhone',
              'Перейдите на вкладку "Автоматизация" внизу',
              'Нажмите "+" в правом верхнем углу',
              'Выберите "Создать персональную автоматизацию"',
              'Выберите триггер "Время суток"',
              'Установите удобное время (например 9:00) и "Ежедневно"',
              'Нажмите "Далее"',
              'Нажмите "Добавить действие"',
              'В поиске введите "Запустить быструю команду"',
              'Выберите "СимптоМед — Пульс"',
              'Выключите "Спрашивать перед запуском"',
              'Нажмите "Готово"',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: 14,
                  background: 'var(--tg-theme-button-color, #2481cc)',
                  color: 'var(--tg-theme-button-text-color, #fff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{
                  fontSize: 15,
                  color: 'var(--tg-theme-text-color, #000)',
                  lineHeight: 1.5,
                  paddingTop: 4,
                }}>
                  {step}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24,
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            lineHeight: 1.5,
            textAlign: 'center',
          }}>
            Теперь каждый день в установленное время ваш пульс будет автоматически отправляться в бот.
          </div>
        </div>

        <div style={{ paddingBottom: 32 }}>
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
