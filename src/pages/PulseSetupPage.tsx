import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

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
  'Выберите "СимптоМед — Здоровье"',
  'Выключите "Спрашивать перед запуском"',
  'Нажмите "Готово"',
];

export const PulseSetupPage: FC = () => {
  const navigate = useNavigate();
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const [copied, setCopied] = useState(false);
  const [automationOpen, setAutomationOpen] = useState(false);

  const handleCopy = () => {
    if (!userId) return;
    navigator.clipboard.writeText(String(userId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const blockStyle: React.CSSProperties = {
    background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
    borderRadius: 16,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const stepTitleStyle: React.CSSProperties = {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--tg-theme-text-color, #000)',
  };

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

        {/* Header */}
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 6 }}>
            ⚙️ Настройка за 3 шага
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            После настройки пульс, давление, SpO2 и шаги будут отправляться автоматически
          </div>
        </div>

        {/* Step 1 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>📋 Шаг 1: Скопируйте ваш ID</div>
          {userId ? (
            <>
              <div style={{
                background: 'var(--tg-theme-bg-color, #fff)',
                border: '2px solid var(--tg-theme-button-color, #2481cc)',
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--tg-theme-text-color, #000)',
                letterSpacing: 2,
              }}>
                {userId}
              </div>
              <Button size="l" stretched onClick={handleCopy}>
                {copied ? '✅ Скопировано! Откройте Shortcuts' : 'Скопировать ID'}
              </Button>
            </>
          ) : (
            <div style={{ fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
              Откройте через бота
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>📥 Шаг 2: Установите Shortcut</div>
          <Button
            size="l"
            stretched
            onClick={() => window.open('https://www.icloud.com/shortcuts/d3f37fa9392d4465a20b454582c1f0a1')}
          >
            Установить Shortcut
          </Button>
          <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center' }}>
            В открывшемся окне нажмите "Добавить команду"
          </div>
        </div>

        {/* Step 3 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>🔧 Шаг 3: Вставьте свой ID в Shortcut</div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            После установки Shortcut откроется автоматически. Найдите первое действие "Получить входные данные команды" и:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Нажмите на поле "Если нет входных данных"',
              'Выберите "Использовать"',
              'Долгое нажатие на текстовое поле → "Вставить"',
              'Нажмите "Готово" вверху',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: 24, height: 24, borderRadius: 12,
                  background: 'var(--tg-theme-button-color, #2481cc)',
                  color: 'var(--tg-theme-button-text-color, #fff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.5, paddingTop: 3 }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
          <Button size="m" stretched mode="outline" onClick={() => window.open('shortcuts://')}>
            Открыть приложение Shortcuts
          </Button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)' }} />

        {/* Optional: Automation */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>🔄 Опционально: Автоматическая отправка</div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            Хотите чтобы данные отправлялись сами каждый день?
          </div>
          <Button
            size="m"
            stretched
            mode="outline"
            onClick={() => setAutomationOpen((v) => !v)}
          >
            {automationOpen ? 'Скрыть инструкцию' : 'Показать инструкцию'}
          </Button>

          {automationOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {AUTOMATION_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 24, height: 24, borderRadius: 12,
                    background: 'var(--tg-theme-button-color, #2481cc)',
                    color: 'var(--tg-theme-button-text-color, #fff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.5, paddingTop: 3 }}>
                    {step}
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 8,
                fontSize: 14,
                color: 'var(--tg-theme-hint-color, #999)',
                lineHeight: 1.5,
                textAlign: 'center',
              }}>
                ✅ Готово! Теперь все ваши показатели здоровья отправляются автоматически.
              </div>
            </div>
          )}
        </div>

        <Button size="l" stretched mode="outline" onClick={() => navigate('/health')}>
          Назад
        </Button>
      </div>
    </Page>
  );
};
