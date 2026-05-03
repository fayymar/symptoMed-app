import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const AUTOMATION_STEPS = [
  'Откройте Быстрые команды на iPhone',
  'Перейдите на вкладку "Автоматизация" внизу',
  'Нажмите "+" в правом верхнем углу',
  'Выберите "Создать персональную автоматизацию"',
  'Выберите триггер "Приложение"',
  'Нажмите "Выбрать" и найдите "Telegram"',
  'Оставьте галочку "Открыто"',
  'Нажмите "Далее"',
  'Нажмите "Добавить действие"',
  'В поиске введите "Запустить быструю команду"',
  'Выберите "СимптоМед — Здоровье"',
  'Нажмите "Далее"',
  'Выключите "Спрашивать перед запуском"',
  'Нажмите "Готово"',
];

export const PulseSetupPage: FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | undefined>(
    (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id,
  );
  const [copied, setCopied] = useState(false);
  const [automationOpen, setAutomationOpen] = useState(false);

  useEffect(() => {
    if (userId) return;
    let attempts = 0;
    const interval = setInterval(() => {
      const id = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (id) {
        setUserId(id);
        clearInterval(interval);
      } else {
        attempts++;
        if (attempts >= 10) clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [userId]);

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
            ⚙️ Настройка за 2 шага
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
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center', lineHeight: 1.6 }}>
              Не удалось определить ID автоматически. Чтобы узнать свой Telegram ID, отправьте боту <span style={{ fontWeight: 600, color: 'var(--tg-theme-text-color, #000)' }}>@medgg_bot</span> команду <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>/start</span> — бот ответит вашим ID.
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={blockStyle}>
          <div style={stepTitleStyle}>📥 Шаг 2: Установите Shortcut</div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            При установке iOS попросит ввести ваш Telegram ID — вставьте скопированный ID из шага 1.
          </div>
          <Button
            size="l"
            stretched
            onClick={() => window.open('https://www.icloud.com/shortcuts/5803e08e3cf147908cae4e582fc45194')}
          >
            Установить Shortcut
          </Button>
          <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center' }}>
            Нажмите "Добавить команду" и вставьте ID когда появится запрос
          </div>
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
                Теперь каждый раз когда вы открываете Telegram, ваши показатели здоровья будут автоматически отправляться в фоне.
              </div>
            </div>
          )}

          {/* Info block */}
          <div style={{
            background: 'var(--tg-theme-bg-color, #fff)',
            border: '1px solid var(--tg-theme-secondary-bg-color, #e0e0e0)',
            borderRadius: 12,
            padding: '14px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)' }}>
              ℹ️ Почему именно Telegram?
            </div>
            <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #888)', lineHeight: 1.6 }}>
              Автоматизация срабатывает при открытии Telegram — это значит что показатели отправляются каждый раз когда вы заходите в мессенджер. Это удобно потому что:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                'Вы открываете Telegram несколько раз в день — данные будут актуальными',
                'Не нужно помнить про отдельное время отправки',
                'Показатели отправляются незаметно в фоне',
              ].map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #888)', lineHeight: 1.5, paddingLeft: 4 }}>
                  — {item}
                </div>
              ))}
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--tg-theme-hint-color, #888)',
              lineHeight: 1.6,
              borderTop: '1px solid var(--tg-theme-secondary-bg-color, #e0e0e0)',
              paddingTop: 8,
              marginTop: 4,
            }}>
              ⚠️ Важно: автоматизация работает только при разблокированном экране. Если iPhone заблокирован — отправка не произойдёт. Но как только вы разблокируете телефон и откроете Telegram — показатели отправятся автоматически.
            </div>
          </div>
        </div>

        <Button size="l" stretched mode="outline" onClick={() => navigate('/health')}>
          Назад
        </Button>
      </div>
    </Page>
  );
};
