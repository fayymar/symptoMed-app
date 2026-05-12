import { useEffect, useRef, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { getResult } from '@/api/consultation.ts';
import { useConsultation } from '@/contexts/ConsultationContext.tsx';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

export const LoadingPage: FC = () => {
  useTelegramBackButton();
  const navigate = useNavigate();
  // Fix: also read anamnesisAnswers from context and pass to getResult
  const { sessionId, anamnesisAnswers, setResult } = useConsultation();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!sessionId) {
      navigate('/');
      return;
    }

    getResult(sessionId, anamnesisAnswers)
      .then((data) => {
        setResult({
          urgency: data.urgency,
          recommendation: data.recommendation,
          specialists: data.specialists ?? [],
          needs_fresh_metrics: data.needs_fresh_metrics ?? [],
        });
        navigate('/result');
      })
      .catch(() => {
        navigate('/result');
      });
  }, [sessionId, anamnesisAnswers, setResult, navigate]);

  return (
    <Page back={false}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 24,
      }}>
        <div style={{ animation: 'pulse 1.5s ease-in-out infinite', fontSize: 64 }}>
          🩺
        </div>
        <div style={{
          width: 48,
          height: 48,
          border: '4px solid var(--tg-theme-secondary-bg-color, #f0f0f0)',
          borderTopColor: 'var(--tg-theme-button-color, #007AFF)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          fontSize: 18,
          fontWeight: 500,
          color: 'var(--tg-theme-text-color, #000)',
        }}>
          Анализирую симптомы...
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--tg-theme-hint-color, #999)',
          textAlign: 'center',
          maxWidth: 240,
        }}>
          Подбираем подходящих специалистов
        </div>
      </div>
    </Page>
  );
};
