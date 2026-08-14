import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Section, Cell, List } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useConsultation } from '@/contexts/ConsultationContext.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

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
  useTelegramBackButton();
  const navigate = useNavigate();
  const { result, reset } = useConsultation();

  const userId = useUserId();

  const handleNewConsultation = () => {
    reset();
    navigate('/');
  };

  const handleMeasure = () => {
    if (!userId) return;
    window.open(`shortcuts://run-shortcut?name=Symed%20-%20Здоровье&input=${userId}`);
  };

  if (!result) {
    return (
      <Page back={false}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px 16px',
        }}>
          <div style={{ fontSize: 15, color: '#ec3942', textAlign: 'center', marginBottom: 24 }}>
            Не удалось загрузить результаты
          </div>
          <Button size="l" stretched mode="outline" onClick={handleNewConsultation}>
            Новая консультация
          </Button>
        </div>
      </Page>
    );
  }

  const isEmergency = result.urgency === 'emergency';

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 0 0',
        boxSizing: 'border-box',
      }}>

        {/* Emergency block */}
        {isEmergency && (
          <div style={{
            margin: '0 16px 20px',
            padding: 16,
            background: '#ffebec',
            borderRadius: 12,
            border: '1px solid #ec3942',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#ec3942', marginBottom: 6 }}>
              🚨 Срочно вызовите скорую
            </div>
            <div style={{ fontSize: 14, color: '#ec3942', lineHeight: 1.5 }}>
              Ваши симптомы требуют немедленной медицинской помощи. Позвоните 103.
            </div>
          </div>
        )}

        {/* Recommendation */}
        {result.recommendation && (
          <div style={{ padding: '0 16px', marginBottom: 20 }}>
            <div style={{
              fontSize: 15,
              color: 'var(--tg-theme-text-color, #000)',
              lineHeight: 1.6,
              background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
              borderRadius: 12,
              padding: 16,
            }}>
              {result.recommendation}
            </div>
          </div>
        )}

        {/* Needs fresh metrics */}
        {result.needs_fresh_metrics && result.needs_fresh_metrics.length > 0 && (
          <div style={{
            margin: '0 16px 20px',
            padding: 16,
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)' }}>
              💡 Рекомендуем измерить:
            </div>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)' }}>
              {result.needs_fresh_metrics.join(', ')}
            </div>
            <Button size="m" stretched onClick={handleMeasure}>
              Измерить сейчас
            </Button>
          </div>
        )}

        {/* Specialists */}
        {result.specialists && result.specialists.length > 0 && (
          <>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--tg-theme-text-color, #000)',
              padding: '0 16px',
              marginBottom: 8,
            }}>
              Рекомендуемые специалисты
            </div>
            <List>
              <Section>
                {result.specialists.map((spec) => {
                  const pct = spec.percentage ?? spec.percent ?? 0;
                  return (
                    <Cell
                      key={spec.name}
                      before={<span style={{ fontSize: 32 }}>{getEmoji(spec.name)}</span>}
                      subtitle={spec.description}
                      after={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: pct >= 70 ? '#34C759' : pct >= 50 ? '#FF9500' : 'var(--tg-theme-hint-color, #999)',
                          }}>
                            {pct}%
                          </span>
                          <div style={{
                            width: 60, height: 4,
                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                            borderRadius: 2, overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${pct}%`, height: '100%',
                              background: pct >= 70 ? '#34C759' : pct >= 50 ? '#FF9500' : '#999',
                              borderRadius: 2,
                            }} />
                          </div>
                        </div>
                      }
                    >
                      {spec.name}
                    </Cell>
                  );
                })}
              </Section>
            </List>
          </>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button size="l" stretched mode="outline" onClick={handleNewConsultation}>
            Новая консультация
          </Button>
        </div>
      </div>
    </Page>
  );
};
