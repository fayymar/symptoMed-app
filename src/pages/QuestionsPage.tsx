import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { sendAnswers } from '@/api/consultation.ts';
import { useConsultation } from '@/contexts/ConsultationContext.tsx';

export const QuestionsPage: FC = () => {
  const navigate = useNavigate();
  const { sessionId, questions, answers, setAnswer } = useConsultation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId: number | undefined = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  if (questions.length === 0) {
    navigate('/');
    return null;
  }

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  const getAnswerValue = (): string => {
    const parts: string[] = [];
    if (selectedOptions.size > 0) parts.push(...Array.from(selectedOptions));
    if (customText.trim()) parts.push(customText.trim());
    return parts.join(', ');
  };

  const canProceed = selectedOptions.size > 0 || customText.trim().length > 0;

  const goNext = async (answerValue: string) => {
    setAnswer(currentIndex, answerValue);
    const isLast = currentIndex >= questions.length - 1;

    if (isLast) {
      setLoading(true);
      setError('');
      const finalAnswers = [...answers];
      finalAnswers[currentIndex] = answerValue;
      try {
        await sendAnswers(sessionId, userId ?? 0, finalAnswers);
      } catch {
        setError('Ошибка соединения. Попробуйте ещё раз.');
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/duration');
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptions(new Set());
      setShowCustomInput(false);
      setCustomText('');
    }
  };

  const handleNext = () => goNext(getAnswerValue());

  return (
    <Page back={true}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '0 16px 32px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          height: 4,
          background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
          borderRadius: 2,
          marginBottom: 32,
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--tg-theme-button-color, #007AFF)',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>

        <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 8 }}>
          Вопрос {currentIndex + 1} из {questions.length}
        </div>
        <div style={{
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #000)',
          marginBottom: 8,
          lineHeight: 1.4,
        }}>
          {current.text}
        </div>
        <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 16 }}>
          Можно выбрать несколько вариантов
        </div>

        {error && (
          <div style={{ marginBottom: 12, fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {current.options.map((option) => {
            const isSelected = selectedOptions.has(option);
            return (
              <Button
                key={option}
                size="m"
                stretched
                mode={isSelected ? 'filled' : 'outline'}
                disabled={loading}
                onClick={() => toggleOption(option)}
              >
                {isSelected ? `✓ ${option}` : option}
              </Button>
            );
          })}

          {showCustomInput ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <Textarea
                placeholder="Опишите своё..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>
          ) : (
            <Button
              size="m"
              stretched
              mode="plain"
              disabled={loading}
              onClick={() => setShowCustomInput(true)}
            >
              ✏️ Написать своё
            </Button>
          )}
        </div>

        <div style={{ paddingTop: 16 }}>
          <Button
            size="l"
            stretched
            disabled={!canProceed || loading}
            onClick={handleNext}
          >
            {loading ? 'Загрузка...' : 'Далее'}
          </Button>
        </div>
      </div>
    </Page>
  );
};
