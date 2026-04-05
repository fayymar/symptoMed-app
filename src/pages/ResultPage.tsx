import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Section, Cell, List } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { getResult, type Specialist } from '@/api/consultation.ts';

const SPECIALIST_EMOJI: Record<string, string> = {
  'Терапевт': '👨‍⚕️',
  'Невролог': '🧠',
  'Кардиолог': '❤️',
  'Гастроэнтеролог': '🫀',
  'Хирург': '🔬',
  'Дерматолог': '🩺',
  'Отоларинголог': '👂',
  'Офтальмолог': '👁️',
  'Ортопед': '🦴',
  'Эндокринолог': '⚗️',
};

function getEmoji(name: string): string {
  return SPECIALIST_EMOJI[name] ?? '👨‍⚕️';
}

export const ResultPage: FC = () => {
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = localStorage.getItem('symptoMed_sessionId') ?? '';
    getResult(sessionId)
      .then((data) => setSpecialists(data.specialists))
      .catch(() => setError('Не удалось загрузить результаты'))
      .finally(() => setLoading(false));
  }, []);

  const handleNewConsultation = () => {
    localStorage.removeItem('symptoMed_sessionId');
    localStorage.removeItem('symptoMed_questions');
    navigate('/');
  };

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 0 0',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--tg-theme-text-color, #000)',
          padding: '0 16px',
          marginBottom: 4,
        }}>
          Рекомендуемые специалисты
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--tg-theme-hint-color, #999)',
          padding: '0 16px',
          marginBottom: 20,
        }}>
          На основе ваших симптомов
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
            Анализирую результаты...
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

        {!loading && !error && specialists.length > 0 && (
          <List>
            <Section>
              {specialists.map((spec) => (
                <Cell
                  key={spec.name}
                  before={<span style={{ fontSize: 32 }}>{getEmoji(spec.name)}</span>}
                  subtitle={spec.description}
                  after={
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 4,
                    }}>
                      <span style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: spec.percent >= 70
                          ? '#34C759'
                          : spec.percent >= 50
                            ? '#FF9500'
                            : 'var(--tg-theme-hint-color, #999)',
                      }}>
                        {spec.percent}%
                      </span>
                      <div style={{
                        width: 60,
                        height: 4,
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${spec.percent}%`,
                          height: '100%',
                          background: spec.percent >= 70
                            ? '#34C759'
                            : spec.percent >= 50
                              ? '#FF9500'
                              : '#999',
                          borderRadius: 2,
                        }} />
                      </div>
                    </div>
                  }
                >
                  {spec.name}
                </Cell>
              ))}
            </Section>
          </List>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button size="l" stretched onClick={() => {}}>
            Записаться к врачу
          </Button>
          <Button size="l" stretched mode="outline" onClick={handleNewConsultation}>
            Новая консультация
          </Button>
        </div>
      </div>
    </Page>
  );
};
