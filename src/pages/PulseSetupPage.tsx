import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const SETUP_STEPS = [
  'Скопируйте ID кнопкой выше',
  'Откройте приложение Быстрые команды',
  'Найдите "СимптоМед — Пульс" и откройте на редактирование',
  'Нажмите на первое действие "Получить входные данные команды"',
  'В поле "Если нет входных данных" нажмите на текущее значение',
  'Удалите старое значение и вставьте свой ID',
  'Нажмите "Готово" вверху',
];

const AUTOMATION_STEPS = [
  'Откройте Быстрые команды',
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
];

function StepList({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            minWidth: 26,
            height: 26,
            borderRadius: 13,
            background: 'var(--tg-theme-button-color, #2481cc)',
            color: 'var(--tg-theme-button-text-color, #fff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {i + 1}
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--tg-theme-text-color, #000)',
            lineHeight: 1.5,
            paddingTop: 3,
          }}>
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--tg-theme-text-color, #000)',
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export const PulseSetupPage: FC = () => {
  const navigate = useNavigate();
  const platform = (window as any).Telegram?.WebApp?.platform;
  const isIOS = platform === 'ios';
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!userId) return;
    navigator.clipboard.writeText(String(userId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isIOS) {
    return (
      <Page back={false}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: '24px 16px 32px',
          boxSizing: 'border-box',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          </div>
          <Button size="l" stretched mode="outline" onClick={() => navigate('/pulse')}>
            Назад
          </Button>
        </div>
      </Page>
    );
  }

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
            ⚙️ Настройка Apple Watch
          </div>
          <div style={{
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 28,
            lineHeight: 1.5,
          }}>
            Настройте один раз — пульс будет отправляться автоматически каждый день
          </div>

          {/* Шаг 1 */}
          <SectionTitle>Шаг 1 — Установить Shortcut</SectionTitle>
          <div style={{
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 12,
            lineHeight: 1.5,
          }}>
            Скачайте быструю команду которая будет читать пульс из приложения Здоровье и отправлять его в бот.
          </div>
          <Button
            size="m"
            stretched
            onClick={() => window.open('https://www.icloud.com/shortcuts/33e4af7a107746b885145d00a6f5b58d')}
          >
            📥 Установить Shortcut
          </Button>
          <div style={{
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
            marginTop: 6,
            marginBottom: 28,
          }}>
            Нажмите "Добавить команду" в открывшемся окне
          </div>

          {/* Шаг 2 */}
          <SectionTitle>Шаг 2 — Привязать ваш Telegram</SectionTitle>
          <div style={{
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 16,
            lineHeight: 1.5,
          }}>
            Чтобы пульс отправлялся именно вам, нужно один раз указать ваш Telegram ID в Shortcut.
          </div>

          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            padding: '16px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)' }}>
              Ваш Telegram ID:
            </div>
            {userId ? (
              <>
                <div style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: 'var(--tg-theme-text-color, #000)',
                  letterSpacing: 1,
                }}>
                  {userId}
                </div>
                <Button size="m" mode={copied ? 'filled' : 'outline'} onClick={handleCopy}>
                  {copied ? '✅ Скопировано!' : '📋 Скопировать ID'}
                </Button>
              </>
            ) : (
              <div style={{ fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
                Откройте приложение через бота
              </div>
            )}
          </div>

          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #000)',
            marginBottom: 12,
          }}>
            Как вставить ID в Shortcut:
          </div>
          <StepList steps={SETUP_STEPS} />

          <Button
            size="m"
            stretched
            mode="outline"
            onClick={() => window.open('shortcuts://')}
            style={{ marginTop: 16, marginBottom: 28 }}
          >
            🔗 Открыть приложение Shortcuts
          </Button>

          {/* Шаг 3 */}
          <SectionTitle>Шаг 3 — Настроить автоматизацию (необязательно)</SectionTitle>
          <div style={{
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 16,
            lineHeight: 1.5,
          }}>
            Хотите чтобы пульс отправлялся автоматически каждый день в одно и то же время? Настройте автоматизацию.
          </div>
          <StepList steps={AUTOMATION_STEPS} />

          <div style={{
            marginTop: 20,
            marginBottom: 8,
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            lineHeight: 1.5,
            textAlign: 'center',
          }}>
            ✅ Готово! Теперь каждый день в установленное время ваш пульс будет автоматически отправляться в бот.
          </div>
        </div>

        <div style={{ paddingTop: 24 }}>
          <Button size="l" stretched mode="outline" onClick={() => navigate('/pulse')}>
            Назад
          </Button>
        </div>
      </div>
    </Page>
  );
};
