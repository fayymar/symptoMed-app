import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Cell, List, Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

interface BPRecord {
  value: number;
  recorded_at: string;
}

interface BPMeasurement {
  recorded_at: string;
  systolic: number;
  diastolic: number;
}

function getStatus(systolic: number, diastolic: number): { label: string; color: string } {
  if (systolic >= 140 || diastolic >= 90) return { label: 'Высокое', color: '#ec3942' };
  if ((systolic >= 130 && systolic < 140) || (diastolic >= 85 && diastolic < 90))
    return { label: 'Слегка повышенное', color: '#FF9500' };
  if (systolic < 90 || diastolic < 60) return { label: 'Пониженное', color: '#2481cc' };
  return { label: 'Норма', color: '#34C759' };
}

function formatDate(utcString: string): string {
  const date = new Date(utcString.endsWith('Z') ? utcString : utcString + 'Z');
  const now = new Date();
  const isToday = date.toLocaleDateString() === now.toLocaleDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toLocaleDateString() === yesterday.toLocaleDateString();

  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Сегодня ${time}`;
  if (isYesterday) return `Вчера ${time}`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ` ${time}`;
}

function mergeRecords(systolicRecords: BPRecord[], diastolicRecords: BPRecord[]): BPMeasurement[] {
  const map = new Map<string, Partial<BPMeasurement>>();

  for (const r of systolicRecords) {
    map.set(r.recorded_at, { recorded_at: r.recorded_at, systolic: r.value });
  }
  for (const r of diastolicRecords) {
    const existing = map.get(r.recorded_at);
    if (existing) {
      existing.diastolic = r.value;
    } else {
      map.set(r.recorded_at, { recorded_at: r.recorded_at, diastolic: r.value });
    }
  }

  return Array.from(map.values())
    .filter((m): m is BPMeasurement => m.systolic !== undefined && m.diastolic !== undefined)
    .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
}

export const BloodPressurePage: FC = () => {
  const navigate = useNavigate();
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [measurements, setMeasurements] = useState<BPMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('Не удалось определить пользователя');
      setLoading(false);
      return;
    }

    const base = `https://telegram-doctor-bot.onrender.com/api/health/metrics/${userId}`;
    Promise.all([
      fetch(`${base}?type=blood_pressure_systolic&limit=20`).then((r) => r.json()),
      fetch(`${base}?type=blood_pressure_diastolic&limit=20`).then((r) => r.json()),
    ])
      .then(([sysData, diaData]) => {
        console.log('systolic:', sysData);
        console.log('diastolic:', diaData);
        const merged = mergeRecords(sysData.records ?? [], diaData.records ?? []);
        setMeasurements(merged);
      })
      .catch(() => setError('Не удалось загрузить данные'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 0 32px',
        boxSizing: 'border-box',
      }}>
        <div style={{ padding: '0 16px' }}>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #000)',
            marginBottom: 4,
          }}>
            🩺 История давления
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 20,
          }}>
            Систолическое и диастолическое давление
          </div>
        </div>

        {loading && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: 'var(--tg-theme-hint-color, #999)',
          }}>
            Загрузка...
          </div>
        )}

        {error && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: '#ec3942', padding: '0 16px', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {!loading && !error && measurements.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center', padding: '0 32px',
          }}>
            Пока нет записей. Отправьте показатели через кнопку на предыдущем экране.
          </div>
        )}

        {!loading && !error && measurements.length > 0 && (
          <List style={{ flex: 1 }}>
            <Section>
              {measurements.map((m, i) => {
                const { label, color } = getStatus(m.systolic, m.diastolic);
                return (
                  <Cell
                    key={i}
                    subtitle={formatDate(m.recorded_at)}
                    before={
                      <div style={{
                        width: 12, height: 12, borderRadius: 6,
                        background: color, flexShrink: 0,
                      }} />
                    }
                    after={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, color, fontWeight: 500 }}>
                          {label}
                        </span>
                      </div>
                    }
                  >
                    <span style={{ fontWeight: 700, fontSize: 17 }}>
                      {m.systolic} / {m.diastolic}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', marginLeft: 4 }}>
                      мм рт.ст.
                    </span>
                  </Cell>
                );
              })}
            </Section>
          </List>
        )}

        <div style={{ padding: '16px 16px 0' }}>
          <Button size="l" stretched mode="outline" onClick={() => navigate('/health')}>
            Назад
          </Button>
        </div>
      </div>
    </Page>
  );
};
