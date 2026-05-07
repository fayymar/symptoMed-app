import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';

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
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('clinics');
  const [selectedSpec, setSelectedSpec] = useState('Все');
  const [search, setSearch] = useState('');

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
            🏥 Найти клиники
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-theme-hint-color, #999)' }}>
            Медицинские учреждения рядом с вами
          </div>
        </div>

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
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`)}
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

        <Button size="l" stretched mode="outline" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    </Page>
  );
};
