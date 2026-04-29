import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const STEPS = [
  'Скопируйте ваш ID кнопкой выше',
  'Откройте приложение Быстрые команды на iPhone',
  'Найдите команду "СимптоМед — Пульс"',
  'Нажмите на неё чтобы открыть редактор',
  'Найдите первое действие "Получить входные данные команды"',
  'В поле "Если нет входных данных" нажмите на текущее значение',
  'Удалите старое значение и вставьте свой ID (длинное нажатие → Вставить)',
  'Нажмите "Готово" вверху',
];

export const SetupShortcutPage: FC = () => {
  const navigate = useNavigate();
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!userId) return;
    navigator.clipboard.writeText(String(userId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
            ⚙️ Настройка Shortcut
          </div>
          <div style={{
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Один раз настроите — пульс будет отправляться автоматически
          </div>

          {/* ID block */}
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            padding: '16px',
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              fontSize: 15,
              color: 'var(--tg-theme-hint-color, #999)',
            }}>
              Ваш Telegram ID:
            </div>

            {userId ? (
              <>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--tg-theme-text-color, #000)',
                  letterSpacing: 1,
                }}>
                  {userId}
                </div>
                <Button
                  size="m"
                  mode={copied ? 'filled' : 'outline'}
                  onClick={handleCopy}
                >
                  {copied ? '✅ Скопировано!' : '📋 Скопировать ID'}
                </Button>
              </>
            ) : (
              <div style={{
                fontSize: 15,
                color: '#ec3942',
                textAlign: 'center',
              }}>
                Откройте приложение через бота
              </div>
            )}
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {STEPS.map((step, i) => (
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
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            lineHeight: 1.5,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            ✅ Готово! Теперь Shortcut запоминает ваш ID. Можно настроить автоматический запуск каждый день.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button
            size="l"
            stretched
            onClick={() => navigate('/automation')}
          >
            ⚙️ Настроить автоматический запуск
          </Button>
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
