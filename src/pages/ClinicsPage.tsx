import { useState, useEffect, type FC } from 'react';
import { Page } from '@/components/Page.tsx';
import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { primaryButtonStyle } from '../styles/buttons';

interface Clinic {
  name: string;
  address: string;
  phone: string;
  specializations: string[];
}

const CLINICS: Clinic[] = [
  {
    name: 'Республиканский специализированный научно-практический медицинский центр терапии',
    address: 'ул. Осиё, 1, Ташкент',
    phone: '+998712647777',
    specializations: ['Терапевт', 'Кардиолог'],
  },
  {
    name: 'Клиника Akfa Medline',
    address: 'ул. Янги Шахар, 2А, Ташкент',
    phone: '+998712070101',
    specializations: ['Все'],
  },
  {
    name: 'Международная клиника Чиланзар',
    address: 'ул. Чиланзар, 2, Ташкент',
    phone: '+998712750303',
    specializations: ['Терапевт', 'Невролог', 'Хирург'],
  },
  {
    name: 'Клиника Eurolab',
    address: 'пр. Амира Темура, 16, Ташкент',
    phone: '+998711204040',
    specializations: ['Все'],
  },
  {
    name: 'Central Clinic',
    address: 'ул. Мирабад, 12, Ташкент',
    phone: '+998712522222',
    specializations: ['Все'],
  },
];

const SPECIALIZATIONS = ['Все', 'Терапевт', 'Кардиолог', 'Невролог', 'Хирург', 'Гинеколог', 'Офтальмолог', 'Стоматолог'];

type Tab = 'clinics' | 'specialists';

export const ClinicsPage: FC = () => {
  useTelegramBackButton();
  const [tab, setTab] = useState<Tab>('clinics');
  const [selectedSpec, setSelectedSpec] = useState('Все');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const tryBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationDenied(true),
        { timeout: 10000 },
      );
    } else {
      setLocationDenied(true);
    }
  };

  const requestLocation = () => {
    setLocationDenied(false);
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.requestLocation) {
      tg.requestLocation((locationData: any) => {
        if (locationData) {
          setUserLocation({ lat: locationData.latitude, lng: locationData.longitude });
        } else {
          tryBrowserLocation();
        }
      });
    } else {
      tryBrowserLocation();
    }
  };

  useEffect(() => { requestLocation(); }, []);

  const filtered = CLINICS.filter((c) => {
    const matchSpec =
      selectedSpec === 'Все' ||
      c.specializations.includes('Все') ||
      c.specializations.includes(selectedSpec);
    const query = search.toLowerCase();
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query);
    return matchSpec && matchSearch;
  });

  const btnBase: React.CSSProperties = {
    flex: 1,
    padding: '8px 0',
    borderRadius: 8,
    border: '1.5px solid var(--tg-theme-button-color, #2481cc)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--tg-theme-button-color, #2481cc)',
  };

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', marginBottom: 4 }}>
            🏥 Клиники и специалисты
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)' }}>
            Медицинские учреждения рядом с вами
          </div>
        </div>

        {/* Geolocation banner */}
        {locationDenied && (
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #888)', flex: 1 }}>
              📍 Разрешите доступ к геолокации чтобы найти ближайшие клиники
            </div>
            <button
              onClick={requestLocation}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #fff)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Разрешить
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
          borderRadius: 10,
          padding: 3,
        }}>
          {(['clinics', 'specialists'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                background: tab === t ? 'var(--tg-theme-bg-color, #fff)' : 'transparent',
                color: tab === t ? 'var(--tg-theme-text-color, #000)' : 'var(--tg-theme-hint-color, #999)',
                transition: 'background 0.15s',
              }}
            >
              {t === 'clinics' ? 'Клиники' : 'Специалисты'}
            </button>
          ))}
        </div>

        {tab === 'clinics' && (
          <>
            {/* Geolocation sort button */}
            {userLocation && (
              <button
                style={{ ...primaryButtonStyle, marginBottom: 0 }}
                onClick={() => alert('Сортировка по расстоянию: функция в разработке')}
              >
                📍 Рядом со мной
              </button>
            )}

            {/* Specialization filter */}
            <div style={{ overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: '1.5px solid var(--tg-theme-button-color, #2481cc)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: selectedSpec === spec ? 'var(--tg-theme-button-color, #2481cc)' : 'transparent',
                    color: selectedSpec === spec ? 'var(--tg-theme-button-text-color, #fff)' : 'var(--tg-theme-button-color, #2481cc)',
                    transition: 'background 0.15s',
                  }}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Поиск по названию или адресу"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--tg-theme-secondary-bg-color, #e0e0e0)',
                fontSize: 14,
                boxSizing: 'border-box',
                background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
                color: 'var(--tg-theme-text-color, #000)',
                outline: 'none',
              }}
            />

            {/* Clinic list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--tg-theme-hint-color, #999)', paddingTop: 24 }}>
                  Ничего не найдено
                </div>
              ) : (
                filtered.map((clinic, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tg-theme-text-color, #000)', lineHeight: 1.3 }}>
                      {clinic.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)' }}>
                      {clinic.address}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={btnBase} onClick={() => window.open(`tel:${clinic.phone}`)}>
                        Позвонить
                      </button>
                      <button
                        style={btnBase}
                        onClick={() => window.open(`https://maps.yandex.ru/?text=${encodeURIComponent(clinic.address)}`, '_blank')}
                      >
                        На карте
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === 'specialists' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40 }}>👨‍⚕️</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Раздел в разработке</div>
            <div style={{ fontSize: 13 }}>Скоро здесь появится список специалистов</div>
          </div>
        )}
      </div>
    </Page>
  );
};
