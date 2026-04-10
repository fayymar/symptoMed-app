import { useState, useEffect, type FC } from 'react';
import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import { useRawInitData } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';

interface HeartrateEntry {
  date: string;
  value: number;
}

function getColor(value: number): string {
  if (value < 50 || value > 120) return '#ec3942';
  if (value > 100) return '#FF9500';
  return '#34C759';
}

function getLabel(value: number): string {
  if (value < 50) return 'Низкий';
  if (value > 120) return 'Высокий';
  if (value > 100) return 'Повышен';
  return 'Норма';
}

export const HeartratePage: FC = () => {
  const rawInitData = useRawInitData();
  const userId = (() => {
    if (!rawInitData) return undefined;
    try {
      return JSON.parse(new URLSearchParams(rawInitData).get('user') ?? '')?.id;
    } catch {
      return undefined;
    }
  })();

  const [entries, setEntries] = useState<HeartrateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('Не удалось определить пользователя');
      setLoading(false);
      return;
    }
    fetch(`https://telegram-doctor-bot.onrender.com/api/health/heartrate/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HeartrateEntry[]) => setEntries(data))
      .catch(() => setError('Не удалось загрузить историю пульса'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Page back={true}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 0 32px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--tg-theme-text-color, #000)',
          padding: '0 16px',
          marginBottom: 4,
        }}>
          История пульса
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--tg-theme-hint-color, #999)',
          padding: '0 16px',
          marginBottom: 20,
        }}>
          Данные с Apple Watch
        </div>

        {loading && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
          }}>
            Загрузка...
          </div>
        )}

        {error && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            color: '#ec3942',
            padding: '0 16px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
            padding: '0 32px',
          }}>
            Нет данных. Подключите Apple Watch и запустите Shortcut.
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <List>
            <Section>
              {entries.map((entry, i) => (
                <Cell
                  key={i}
                  subtitle={new Date(entry.date).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  after={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 13,
                        color: getColor(entry.value),
                        fontWeight: 500,
                      }}>
                        {getLabel(entry.value)}
                      </span>
                      <span style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: getColor(entry.value),
                      }}>
                        {entry.value}
                      </span>
                      <span style={{
                        fontSize: 13,
                        color: 'var(--tg-theme-hint-color, #999)',
                      }}>
                        уд/мин
                      </span>
                    </div>
                  }
                >
                  ❤️ Пульс
                </Cell>
              ))}
            </Section>
          </List>
        )}
      </div>
    </Page>
  );
};
