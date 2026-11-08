import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { getProfile, saveProfile } from '../api/profile';

interface Option {
  value: string; // как сохраняет бот
  label: string; // как показываем здесь
}

// Значения совпадают с анкетой бота, чтобы данные из бота отмечались здесь
const CHRONIC_DISEASES: Option[] = [
  { value: 'Гипертония', label: '🩺 Гипертония (высокое давление)' },
  { value: 'Диабет 1 типа', label: '🩸 Диабет 1 типа' },
  { value: 'Диабет 2 типа', label: '🩸 Диабет 2 типа' },
  { value: 'Болезни сердца', label: '🫀 Болезни сердца (ишемическая болезнь и др.)' },
  { value: 'Астма', label: '🫁 Бронхиальная астма' },
  { value: 'ХОБЛ', label: '🫁 ХОБЛ' },
  { value: 'Гастрит/язва', label: '🔴 Гастрит или язва желудка' },
  { value: 'Болезни почек', label: '🫘 Заболевания почек' },
  { value: 'Щитовидная железа', label: '🦋 Заболевания щитовидной железы' },
  { value: 'Эпилепсия', label: '🧠 Эпилепсия' },
];

const HEREDITARY: Option[] = [
  { value: 'Болезни сердца', label: '🫀 Болезни сердца (инфаркт, сердечная недостаточность)' },
  { value: 'Инсульт', label: '🧠 Инсульт' },
  { value: 'Диабет', label: '🩸 Диабет' },
  { value: 'Онкология', label: '🎗 Онкологические заболевания' },
  { value: 'Гипертония', label: '📈 Гипертония' },
  { value: 'Альцгеймер', label: '🧠 Болезнь Альцгеймера или деменция' },
  { value: 'Психические расстройства', label: '🏥 Психические расстройства' },
];

const ALLERGIES: Option[] = [
  { value: 'Пенициллин/антибиотики', label: '💊 Пенициллин / антибиотики' },
  { value: 'Аспирин/НПВП', label: '💊 Аспирин / ибупрофен (НПВП)' },
  { value: 'Сульфаниламиды', label: '💊 Сульфаниламиды' },
  { value: 'Кодеин/опиоиды', label: '💊 Кодеин / опиоиды' },
  { value: 'Анестетики', label: '💊 Анестетики (новокаин, лидокаин)' },
];

const SMOKING: Option[] = [
  { value: 'no', label: 'Не курю' },
  { value: 'yes', label: 'Курю' },
  { value: 'quit', label: 'Бросил(а)' },
];

const ACTIVITY: Option[] = [
  { value: 'light', label: 'Низкая' },
  { value: 'moderate', label: 'Умеренная' },
  { value: 'active', label: 'Высокая' },
];

// Старые записи из Mini App хранили подписи кнопок вместо кодов
const LEGACY_CODES = new Map<string, string>([
  ['Не курю', 'no'], ['Курю', 'yes'], ['Бросил(а)', 'quit'],
  ['Низкая', 'light'], ['Умеренная', 'moderate'], ['Высокая', 'active'],
]);

function toCode(value: string | undefined): string {
  return value ? (LEGACY_CODES.get(value) ?? value) : '';
}

function toggleSet(prev: Set<string>, item: string): Set<string> {
  const next = new Set(prev);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return next;
}

/** Варианты плюс уже сохранённые значения не из списка (например, с сайта), чтобы их не потерять */
function withExtras(options: Option[], selected: Set<string>): Option[] {
  const known = new Set(options.map((o) => o.value));
  const extras = Array.from(selected).filter((v) => !known.has(v)).map((v) => ({ value: v, label: v }));
  return [...options, ...extras];
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
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Подставляем то, что уже заполнено (в боте, на сайте или здесь раньше):
  // иначе сохранение пустой формы стёрло бы эти данные
  useEffect(() => {
    // userId появляется не сразу (useUserId ждёт Telegram до ~5 секунд). Пока его
    // нет, держим «Загрузка…»: иначе форма успела бы показаться пустой
    if (!userId) {
      const timer = setTimeout(() => setLoading(false), 6000);
      return () => clearTimeout(timer);
    }
    setLoading(true);
    setLoadFailed(false);
    setError('');
    getProfile(userId)
      .then((res) => {
        const p = res.profile;
        if (!res.exists || !p) return;
        setChronic(new Set(p.chronic_diseases || []));
        setHereditary(new Set(p.hereditary || []));
        const knownAllergies = new Set(ALLERGIES.map((o) => o.value));
        const allergyItems = (p.drug_allergies || '').split(',').map((s) => s.trim()).filter(Boolean);
        setAllergies(new Set(allergyItems.filter((a) => knownAllergies.has(a))));
        setAllergiesOther(allergyItems.filter((a) => !knownAllergies.has(a)).join(', '));
        setSmoking(toCode(p.smoking));
        setActivity(toCode(p.physical_activity));
      })
      .catch(() => {
        setLoadFailed(true);
        setError('Не удалось загрузить сохранённые данные. Проверьте соединение и откройте экран заново.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    // Без загруженных данных сохранение пустой формы стёрло бы анамнез
    if (loading || loadFailed || !userId) {
      setError('Не удалось загрузить сохранённые данные. Проверьте соединение и откройте экран заново.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const other = allergiesOther.trim();
      await saveProfile(userId, {
        chronic_diseases: Array.from(chronic),
        hereditary: Array.from(hereditary),
        drug_allergies: [...Array.from(allergies), ...(other ? [other] : [])].join(', '),
        smoking: smoking || null,
        physical_activity: activity || null,
      });
      setSaved(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch {
      setError('Не удалось сохранить. Проверьте соединение и попробуйте ещё раз.');
    }
    finally {
      setSaving(false);
    }
  };

  const renderCard = (item: Option, selected: Set<string>, onToggle: () => void) => {
    const isSelected = selected.has(item.value);
    return (
      <div
        key={item.value}
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
        <span style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.4 }}>{item.label}</span>
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

  const rowButtons = (options: Option[], selected: string, onSelect: (v: string) => void) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          style={{
            flex: 1,
            padding: '10px 4px',
            borderRadius: 10,
            border: '1.5px solid #10A875',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: selected === opt.value ? 'var(--tg-theme-button-color, #10A875)' : 'transparent',
            color: selected === opt.value ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #10A875)',
            transition: 'background 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <Page back={false}>
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--tg-theme-hint-color, #999)' }}>
          Загрузка…
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
            {withExtras(CHRONIC_DISEASES, chronic).map((item) =>
              renderCard(item, chronic, () => setChronic((p) => toggleSet(p, item.value)))
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
            {withExtras(HEREDITARY, hereditary).map((item) =>
              renderCard(item, hereditary, () => setHereditary((p) => toggleSet(p, item.value)))
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
              renderCard(item, allergies, () => setAllergies((p) => toggleSet(p, item.value)))
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
              {rowButtons(SMOKING, smoking, setSmoking)}
            </div>

            {smoking && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tg-theme-text-color, #000)', marginBottom: 10 }}>
                  Физическая активность
                </div>
                {rowButtons(ACTIVITY, activity, setActivity)}
                <div style={{ fontSize: 12, color: 'var(--tg-theme-hint-color, #999)', marginTop: 8, lineHeight: 1.5 }}>
                  Низкая — менее 30 мин в день, Умеренная — 30-60 мин, Высокая — более 60 мин
                </div>
              </div>
            )}

            <div style={{ flex: 1 }} />

            {error && (
              <div style={{ fontSize: 14, color: '#ec3942', textAlign: 'center', padding: '8px 0' }}>
                {error}
              </div>
            )}

            {saved ? (
              <div style={{ fontSize: 16, fontWeight: 600, color: '#34C759', textAlign: 'center', padding: '16px 0' }}>
                ✅ Сохранено
              </div>
            ) : (
              <Button size="l" stretched disabled={saving} onClick={() => void handleSave()}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Page>
  );
};
