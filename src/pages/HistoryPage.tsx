import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { primaryButtonStyle } from '../styles/buttons';
import { getConsultations, type ConsultationRecord } from '../api/profile';

interface Consultation extends ConsultationRecord {}

function formatDate(utcString: string): string {
  const date = new Date(utcString.endsWith('Z') ? utcString : utcString + 'Z');
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const HistoryPage: FC = () => {
  useTelegramBackButton();
  const navigate = useNavigate();
  const userId = useUserId();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    getConsultations(userId)
      .then((data) => {
        setConsultations(data.records ?? []);
      })
      .catch((e) => {
        console.error('History fetch error:', e);
        setError('Не удалось загрузить историю. Проверьте соединение.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const isEmpty = !loading && !error && consultations.length === 0;

  if (loading) {
    return (
      <Page back={false}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', fontSize: 15, color: 'var(--tg-theme-hint-color, #999)',
        }}>
          Загрузка...
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
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 8 }}>
          📋 История консультаций
        </div>

        {error && (
          <div style={{
            marginTop: 24, padding: '14px 16px', borderRadius: 12,
            background: 'rgba(236,57,66,0.08)', color: '#ec3942',
            fontSize: 14, textAlign: 'center', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {isEmpty && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16, padding: '0 16px',
          }}>
            <div style={{ fontSize: 48 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)', textAlign: 'center' }}>
              У вас пока нет консультаций
            </div>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', textAlign: 'center', lineHeight: 1.5 }}>
              Начните первую консультацию чтобы получить рекомендации врача.
            </div>
            <button style={primaryButtonStyle} onClick={() => navigate('/symptoms')}>
              Начать консультацию
            </button>
          </div>
        )}

        {consultations.length > 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {consultations.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--tg-theme-hint-color, #999)' }}>
                  {formatDate(c.created_at)}
                </div>
                <div style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.4 }}>
                  {c.symptoms.length > 80 ? c.symptoms.slice(0, 80) + '...' : c.symptoms}
                </div>
                {c.recommended_doctor && (
                  <div style={{ fontSize: 13, color: '#10A875', fontWeight: 500 }}>
                    → {c.recommended_doctor}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};
