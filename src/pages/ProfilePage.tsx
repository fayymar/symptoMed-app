import { useState, useEffect, type FC } from 'react';
import { Button, Input } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { useUserId } from '../hooks/useUserId';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';

const BASE_URL = 'https://telegram-doctor-bot.onrender.com/api/profile';

function toDateInputValue(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw.slice(0, 10);
}

export const ProfilePage: FC = () => {
  useTelegramBackButton();
  const userId = useUserId();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [profileExists, setProfileExists] = useState(false);

  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${BASE_URL}/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        console.log('Profile data:', data);
        if (data.exists && data.profile) {
          const p = data.profile;
          setFullName(p.full_name || '');
          setPhone(p.phone || '');
          setBirthdate(toDateInputValue(p.birthdate));
          setGender(p.gender || '');
          setHeight(p.height ? String(p.height) : '');
          setWeight(p.weight ? String(p.weight) : '');
          setProfileExists(true);
        }
      })
      .catch((e) => console.error('Profile fetch error:', e))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/${userId ?? 0}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName || null,
          birthdate: birthdate || null,
          gender: gender || null,
          height: height ? Number(height) : null,
          weight: weight ? Number(weight) : null,
          phone: phone || null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProfileExists(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Ошибка сохранения. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  const fieldBlock: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: 'var(--tg-theme-hint-color, #999)',
    paddingLeft: 4,
  };

  const toggleBtnBase: React.CSSProperties = {
    flex: 1,
    padding: '10px 0',
    borderRadius: 10,
    border: '1.5px solid var(--tg-theme-button-color, #2481cc)',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    background: 'transparent',
  };

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
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 6 }}>
            👤 Профиль
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            Данные используются для более точной диагностики
          </div>
        </div>

        {profileExists && (
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #888)',
            lineHeight: 1.6,
          }}>
            ℹ️ Данные профиля используются AI при диагностике для более точных рекомендаций с учётом вашего возраста, пола и физических параметров.
          </div>
        )}

        <div style={fieldBlock}>
          <div style={labelStyle}>Имя</div>
          <Input
            type="text"
            placeholder="Ваше имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div style={fieldBlock}>
          <div style={labelStyle}>Дата рождения</div>
          <Input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <div style={fieldBlock}>
          <div style={labelStyle}>Пол</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                ...toggleBtnBase,
                background: gender === 'male' ? 'var(--tg-theme-button-color, #2481cc)' : 'transparent',
                color: gender === 'male' ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #2481cc)',
              }}
              onClick={() => setGender('male')}
            >
              Мужской
            </button>
            <button
              style={{
                ...toggleBtnBase,
                background: gender === 'female' ? 'var(--tg-theme-button-color, #2481cc)' : 'transparent',
                color: gender === 'female' ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #2481cc)',
              }}
              onClick={() => setGender('female')}
            >
              Женский
            </button>
          </div>
        </div>

        <div style={fieldBlock}>
          <div style={labelStyle}>Рост</div>
          <div style={{ position: 'relative' }}>
            <Input
              type="number"
              placeholder="см"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            {height && (
              <span style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', pointerEvents: 'none',
              }}>
                см
              </span>
            )}
          </div>
        </div>

        <div style={fieldBlock}>
          <div style={labelStyle}>Вес</div>
          <div style={{ position: 'relative' }}>
            <Input
              type="number"
              placeholder="кг"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            {weight && (
              <span style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', pointerEvents: 'none',
              }}>
                кг
              </span>
            )}
          </div>
        </div>

        <div style={fieldBlock}>
          <div style={labelStyle}>Телефон</div>
          <Input
            type="tel"
            placeholder="+998..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <Button size="l" stretched disabled={saving} onClick={handleSave}>
          {saved ? '✅ Сохранено' : saving ? 'Сохранение...' : '💾 Сохранить'}
        </Button>
      </div>
    </Page>
  );
};
