import { useState, useEffect, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Section, Cell, List, Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';

interface MetricRecord {
  value: number;
  recorded_at: string;
  source: string;
}

interface MetricStatus {
  label: string;
  color: string;
}

interface MetricConfig {
  title: string;
  subtitle: string;
  unit: string;
  icon: string;
  apiType: string;
  getStatus: (value: number) => MetricStatus;
}

const COLOR_MAP: Record<string, string> = {
  red: '#ec3942',
  orange: '#FF9500',
  green: '#34C759',
  blue: '#2481cc',
};

const METRICS_CONFIG: Record<string, MetricConfig> = {
  heartrate: {
    title: '❤️ История пульса',
    subtitle: 'Данные с Apple Watch',
    unit: 'уд/мин',
    icon: '❤️',
    apiType: 'heartrate',
    getStatus: (value) => {
      if (value < 50 || value > 120) return { label: 'Критично', color: 'red' };
      if (value < 60 || value > 100) return { label: 'Отклонение', color: 'orange' };
      return { label: 'Норма', color: 'green' };
    },
  },
  spo2: {
    title: '🫁 История SpO2',
    subtitle: 'Уровень кислорода в крови',
    unit: '%',
    icon: '🫁',
    apiType: 'spo2',
    getStatus: (value) => {
      if (value < 90) return { label: 'Критично', color: 'red' };
      if (value < 95) return { label: 'Понижено', color: 'orange' };
      return { label: 'Норма', color: 'green' };
    },
  },
  steps: {
    title: '👣 История шагов',
    subtitle: 'Активность за день',
    unit: 'шагов',
    icon: '👣',
    apiType: 'steps',
    getStatus: (value) => {
      if (value < 5000) return { label: 'Мало', color: 'orange' };
      if (value < 10000) return { label: 'Средне', color: 'blue' };
      return { label: 'Отлично', color: 'green' };
    },
  },
};

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

export const MetricHistoryPage: FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const config = type ? METRICS_CONFIG[type] : undefined;

  const userId = useUserId();
  const [records, setRecords] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!config) {
      setError('Неизвестный тип метрики');
      setLoading(false);
      return;
    }
    if (!userId) {
      setError('Не удалось определить пользователя');
      setLoading(false);
      return;
    }
    fetch(`https://telegram-doctor-bot.onrender.com/api/health/metrics/${userId}?type=${config.apiType}&limit=20`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setRecords(data.records ?? []);
      })
      .catch(() => setError('Не удалось загрузить данные'))
      .finally(() => setLoading(false));
  }, [userId, config?.apiType]);

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
            {config?.title ?? 'История метрики'}
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #999)',
            marginBottom: 20,
          }}>
            {config?.subtitle}
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

        {!loading && !error && records.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center', padding: '0 32px',
          }}>
            Пока нет записей. Отправьте показатели через кнопку на предыдущем экране.
          </div>
        )}

        {!loading && !error && records.length > 0 && config && (
          <List style={{ flex: 1 }}>
            <Section>
              {records.map((record, i) => {
                const status = config.getStatus(record.value);
                const color = COLOR_MAP[status.color] ?? '#999';
                return (
                  <Cell
                    key={i}
                    subtitle={formatDate(record.recorded_at)}
                    before={
                      <div style={{
                        width: 12, height: 12, borderRadius: 6,
                        background: color, flexShrink: 0,
                      }} />
                    }
                    after={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, color, fontWeight: 500 }}>
                          {status.label}
                        </span>
                        <span style={{ fontSize: 20, fontWeight: 700, color }}>
                          {record.value}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)' }}>
                          {config.unit}
                        </span>
                      </div>
                    }
                  >
                    {config.icon} Показатель
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
