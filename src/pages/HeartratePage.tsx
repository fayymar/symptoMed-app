import { useState, useEffect, type FC } from 'react';
import { Section, Cell, List } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

interface HeartrateRecord {
  value: number;
  recorded_at: string;
  source: string;
}

interface HeartrateResponse {
  records: HeartrateRecord[];
  has_data: boolean;
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Сегодня ${time}`;

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' ' + time;
}

export const HeartratePage: FC = () => {
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [records, setRecords] = useState<HeartrateRecord[]>([]);
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
      .then((data: HeartrateResponse) => {
        console.log(data);
        setRecords(data.records ?? []);
      })
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

        {!loading && !error && records.length === 0 && (
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
            Пока нет записей. Отправьте первый пульс!
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <List>
            <Section>
              {records.map((record, i) => (
                <Cell
                  key={i}
                  subtitle={formatDate(record.recorded_at)}
                  before={
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: getColor(record.value),
                      flexShrink: 0,
                    }} />
                  }
                  after={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 13,
                        color: getColor(record.value),
                        fontWeight: 500,
                      }}>
                        {getLabel(record.value)}
                      </span>
                      <span style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: getColor(record.value),
                      }}>
                        {record.value}
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
