import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

const CHRONIC_DISEASES = [
  '🩺 Гипертония (высокое давление)',
  '🩸 Диабет 1 типа',
  '🩸 Диабет 2 типа',
  '🫀 Ишемическая болезнь сердца',
  '🫁 Бронхиальная астма',
  '🫁 ХОБЛ',
  '🔴 Гастрит или язва желудка',
  '🫘 Заболевания почек',
  '🦋 Заболевания щитовидной железы',
  '🧠 Эпилепсия',
];

const HEREDITARY = [
  '🫀 Болезни сердца (инфаркт, сердечная недостаточность)',
  '🧠 Инсульт',
  '🩸 Диабет',
  '🎗 Онкологические заболевания',
  '📈 Гипертония',
  '🧠 Болезнь Альцгеймера или деменция',
  '🏥 Психические расстройства',
];

const ALLERGIES = [
  '💊 Пенициллин / антибиотики',
  '💊 Аспирин / ибупрофен (НПВП)',
  '💊 Сульфаниламиды',
  '💊 Кодеин / опиоиды',
  '💊 Анестетики (новокаин, лидокаин)',
];

function toggleSet(prev: Set<string>, item: string): Set<string> {
  const next = new Set(prev);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return next;
}

export const MedicalHistoryPage: FC = () => {
  useTelegramBackButton();
  const navigate = useNavigate();
  const userId = useUserId();

  const [step, setStep] = useState(1);
  const [chronic, setChronic] = useState<Set<string>>(new Set());
  const [hereditary, setHereditary] = useState<Set<string>>(new Set());
  const [allergies, setAllergies] = useState<Set<string>>(new Set());
  const [allergiesOther, setAllergiesOther] = useState('');
  const [smoking, setSmoking] = useState('');
  const [activity, setActivity] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`https://telegram-doctor-bot.onrender.com/api/profile/${userId ?? 0}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chronic_diseases: Array.from(chronic),
          hereditary: Array.from(hereditary),
          allergies: Array.from(allergies),
          allergies_other: allergiesOther || null,
          smoking: smoking || null,
          physical_activity: activity || null,
        }),
      });
      setSaved(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch {}
    finally {
      setSaving(false);
    }
  };

  const renderCard = (item: string, selected: Set<string>, onToggle: () => void) => {
    const isSelected = selected.has(item);
    return (
      <div
        key={item}
        onClick={onToggle}
        style={{
          padding: '12px 14px',
          borderRadius: 10,
          border: `1.5px solid ${isSelected ? 'var(--tg-theme-button-color, #10A875)' : 'var(--tg-theme-secondary-bg-color, #e0e0e0)'}`,
          background: isSelected ? 'rgba(36, 129, 204, 0.07)' : 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
          transition: 'border-color 0.15s',
        }}
      >
        <span style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.4 }}>{item}</span>
        {isSelected && (
          <span style={{ color: 'var(--tg-theme-button-color, #10A875)', fontWeight: 700, marginLeft: 8, flexShrink: 0 }}>✓</span>
        )}
      </div>
    );
  };

  const noneBtn = (label: string, onClear: () => void) => (
    <button
      onClick={onClear}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--tg-theme-hint-color, #999)',
        fontSize: 14,
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '4px 0',
        alignSelf: 'center',
      }}
    >
      {label}
    </button>
  );

  const rowButtons = (options: string[], selected: string, onSelect: (v: string) => void) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          style={{
            flex: 1,
            padding: '10px 4px',
            borderRadius: 10,
            border: '1.5px solid #10A875',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: selected === opt ? 'var(--tg-theme-button-color, #10A875)' : 'transparent',
            color: selected === opt ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #10A875)',
            transition: 'background 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
      }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 8 }}>
            Шаг {step} из 4
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)', borderRadius: 2 }}>
            <div style={{
              width: `${(step / 4) * 100}%`,
              height: '100%',
              background: 'var(--tg-theme-button-color, #007AFF)',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Step 1: Chronic diseases */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 2 }}>
              Есть ли у вас хронические заболевания?
            </div>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 8 }}>
              Выберите все подходящие
            </div>
            {CHRONIC_DISEASES.map((item) =>
              renderCard(item, chronic, () => setChronic((p) => toggleSet(p, item)))
            )}
            {noneBtn('Ничего из перечисленного', () => setChronic(new Set()))}
            <Button size="l" stretched onClick={() => setStep(2)} style={{ marginTop: 8 }}>
              Далее
            </Button>
          </div>
        )}

        {/* Step 2: Hereditary */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 2 }}>
              Есть ли у ваших близких родственников...
            </div>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 8 }}>
              Родители, братья, сёстры, дедушки, бабушки
            </div>
            {HEREDITARY.map((item) =>
              renderCard(item, hereditary, () => setHereditary((p) => toggleSet(p, item)))
            )}
            {noneBtn('Ничего из перечисленного', () => setHereditary(new Set()))}
            <Button size="l" stretched onClick={() => setStep(3)} style={{ marginTop: 8 }}>
              Далее
            </Button>
          </div>
        )}

        {/* Step 3: Allergies */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 2 }}>
              Есть ли у вас аллергия на лекарства?
            </div>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 8 }}>
              Это поможет избежать небезопасных рекомендаций
            </div>
            {ALLERGIES.map((item) =>
              renderCard(item, allergies, () => setAllergies((p) => toggleSet(p, item)))
            )}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', marginBottom: 6 }}>
                Другие аллергии
              </div>
              <Textarea
                placeholder="Например: сульфаниламиды, латекс"
                value={allergiesOther}
                onChange={(e) => setAllergiesOther(e.target.value)}
                style={{ minHeight: 72 }}
              />
            </div>
            {noneBtn('Аллергий нет', () => { setAllergies(new Set()); setAllergiesOther(''); })}
            <Button size="l" stretched onClick={() => setStep(4)} style={{ marginTop: 8 }}>
              Далее
            </Button>
          </div>
        )}

        {/* Step 4: Lifestyle */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)' }}>
              Несколько вопросов об образе жизни
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)', marginBottom: 10 }}>
                Вы курите?
              </div>
              {rowButtons(['Не курю', 'Курю', 'Бросил(а)'], smoking, setSmoking)}
            </div>

            {smoking && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)', marginBottom: 10 }}>
                  Физическая активность
                </div>
                {rowButtons(['Низкая', 'Умеренная', 'Высокая'], activity, setActivity)}
                <div style={{ fontSize: 12, color: 'var(--tg-theme-hint-color, #999)', marginTop: 8, lineHeight: 1.5 }}>
                  Низкая — менее 30 мин в день, Умеренная — 30-60 мин, Высокая — более 60 мин
                </div>
              </div>
            )}

            <div style={{ flex: 1 }} />

            {saved ? (
              <div style={{ fontSize: 16, fontWeight: 600, color: '#34C759', textAlign: 'center', padding: '16px 0' }}>
                ✅ Сохранено
              </div>
            ) : (
              <Button size="l" stretched disabled={saving} onClick={handleSave}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Page>
  );
};
