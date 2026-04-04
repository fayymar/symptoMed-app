import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Section, Cell, List } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const MOCK_SPECIALISTS = [
  { name: 'Терапевт', description: 'Общее обследование и лечение', percent: 87, emoji: '👨‍⚕️' },
  { name: 'Невролог', description: 'Нарушения нервной системы', percent: 65, emoji: '🧠' },
  { name: 'Кардиолог', description: 'Заболевания сердца и сосудов', percent: 42, emoji: '❤️' },
];

export const ResultPage: FC = () => {
  const navigate = useNavigate();

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

        <List>
          <Section>
            {MOCK_SPECIALISTS.map((spec) => (
              <Cell
                key={spec.name}
                before={<span style={{ fontSize: 32 }}>{spec.emoji}</span>}
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

        <div style={{ flex: 1 }} />

        <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button size="l" stretched onClick={() => {}}>
            Записаться к врачу
          </Button>
          <Button size="l" stretched mode="outline" onClick={() => navigate('/')}>
            Новая консультация
          </Button>
        </div>
      </div>
    </Page>
  );
};
