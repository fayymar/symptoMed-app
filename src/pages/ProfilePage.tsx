import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

const BASE_URL = 'https://telegram-doctor-bot.onrender.com/api/profile';

interface ProfileData {
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | '';
  height: string;
  weight: string;
  phone: string;
}

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    birth_date: '',
    gender: '',
    height: '',
    weight: '',
    phone: '',
  });

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`${BASE_URL}/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProfile({
          name: data.name ?? '',
          birth_date: data.birth_date ?? '',
          gender: data.gender ?? '',
          height: data.height != null ? String(data.height) : '',
          weight: data.weight != null ? String(data.weight) : '',
          phone: data.phone ?? '',
        });
      })
      .catch(() => {})
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
          name: profile.name,
          birth_date: profile.birth_date,
          gender: profile.gender,
          height: profile.height ? Number(profile.height) : null,
          weight: profile.weight ? Number(profile.weight) : null,
          phone: profile.phone,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
        {/* Header */}
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 6 }}>
            👤 Профиль
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', lineHeight: 1.5 }}>
            Данные используются для более точной диагностики
          </div>
        </div>

        {/* Name */}
        <div style={fieldBlock}>
          <div style={labelStyle}>Имя</div>
          <Input
            type="text"
            placeholder="Ваше имя"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        {/* Birth date */}
        <div style={fieldBlock}>
          <div style={labelStyle}>Дата рождения</div>
          <Input
            type="date"
            value={profile.birth_date}
            onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
          />
        </div>

        {/* Gender */}
        <div style={fieldBlock}>
          <div style={labelStyle}>Пол</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                ...toggleBtnBase,
                background: profile.gender === 'male' ? 'var(--tg-theme-button-color, #2481cc)' : 'transparent',
                color: profile.gender === 'male' ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #2481cc)',
              }}
              onClick={() => setProfile({ ...profile, gender: 'male' })}
            >
              Мужской
            </button>
            <button
              style={{
                ...toggleBtnBase,
                background: profile.gender === 'female' ? 'var(--tg-theme-button-color, #2481cc)' : 'transparent',
                color: profile.gender === 'female' ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #2481cc)',
              }}
              onClick={() => setProfile({ ...profile, gender: 'female' })}
            >
              Женский
            </button>
          </div>
        </div>

        {/* Height */}
        <div style={fieldBlock}>
          <div style={labelStyle}>Рост</div>
          <div style={{ position: 'relative' }}>
            <Input
              type="number"
              placeholder="см"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: e.target.value })}
            />
            {profile.height && (
              <span style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', pointerEvents: 'none',
              }}>
                см
              </span>
            )}
          </div>
        </div>

        {/* Weight */}
        <div style={fieldBlock}>
          <div style={labelStyle}>Вес</div>
          <div style={{ position: 'relative' }}>
            <Input
              type="number"
              placeholder="кг"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
            />
            {profile.weight && (
              <span style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', pointerEvents: 'none',
              }}>
                кг
              </span>
            )}
          </div>
        </div>

        {/* Phone */}
        <div style={fieldBlock}>
          <div style={labelStyle}>Телефон</div>
          <Input
            type="tel"
            placeholder="+998..."
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{ fontSize: 14, color: '#ec3942', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Save button */}
        <Button
          size="l"
          stretched
          disabled={saving}
          onClick={handleSave}
        >
          {saved ? '✅ Сохранено' : saving ? 'Сохранение...' : '💾 Сохранить'}
        </Button>

        <Button
          size="l"
          stretched
          mode="outline"
          onClick={() => navigate('/')}
        >
          Назад
        </Button>
      </div>
    </Page>
  );
};
