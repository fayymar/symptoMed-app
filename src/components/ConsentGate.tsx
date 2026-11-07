import { useEffect, useState, type FC } from 'react';
import { Button } from '@telegram-apps/telegram-ui';

import { CONSENT_REQUIRED_EVENT } from '@/api/client.ts';
import {
  CONSENT_DISCLAIMER,
  CONSENT_INTRO,
  CONSENT_POINTS,
  CONSENT_WITHDRAW,
  PRIVACY_URL,
  acceptConsent,
  needsConsent,
} from '@/api/consent.ts';

function openPrivacy() {
  const tg = window.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(PRIVACY_URL);
  else window.open(PRIVACY_URL, '_blank', 'noopener,noreferrer');
}

function decline() {
  const tg = window.Telegram?.WebApp;
  if (tg?.close) tg.close();
}

/**
 * Окно согласия на обработку данных. Показывается при запуске, пока согласие на
 * текущую версию текста не дано, и при ответе бэкенда 403 consent_required.
 */
export const ConsentGate: FC = () => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    needsConsent()
      .then((need) => { if (!cancelled && need) setOpen(true); })
      .catch(() => { /* сеть недоступна — бэкенд всё равно не примет данные без согласия */ });
    const show = () => setOpen(true);
    window.addEventListener(CONSENT_REQUIRED_EVENT, show);
    return () => {
      cancelled = true;
      window.removeEventListener(CONSENT_REQUIRED_EVENT, show);
    };
  }, []);

  if (!open) return null;

  const accept = async () => {
    setSaving(true);
    setError('');
    try {
      await acceptConsent();
      setOpen(false);
    } catch {
      setError('Не удалось сохранить согласие. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  const text = 'var(--tg-theme-text-color, #000)';
  const hint = 'var(--tg-theme-hint-color, #999)';

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="consent-title" style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--tg-theme-bg-color, #fff)',
      overflowY: 'auto', padding: '24px 16px 32px', boxSizing: 'border-box',
      fontFamily: 'var(--tgui--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    }}>
      <div id="consent-title" style={{ fontSize: 22, fontWeight: 700, color: text, marginBottom: 14 }}>
        🔒 Согласие на обработку данных
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.5, color: text }}>
        <p style={{ margin: '0 0 12px' }}>{CONSENT_INTRO}</p>
        <p style={{ margin: '0 0 6px' }}>Нажимая «Согласен», вы соглашаетесь:</p>
        <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
          {CONSENT_POINTS.map((p) => <li key={p} style={{ marginBottom: 6 }}>{p}</li>)}
        </ul>
        <p style={{ margin: '0 0 12px', color: hint, fontSize: 14 }}>{CONSENT_WITHDRAW}</p>
        <p style={{ margin: 0, color: hint, fontSize: 14 }}>
          {CONSENT_DISCLAIMER}{' '}
          <a href={PRIVACY_URL} onClick={(e) => { e.preventDefault(); openPrivacy(); }}
            style={{ color: 'var(--tg-theme-link-color, #2481cc)', fontWeight: 600 }}>
            Подробнее
          </a>
        </p>
      </div>
      {error && <div style={{ marginTop: 12, fontSize: 14, color: '#ec3942' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <Button size="l" stretched disabled={saving} onClick={() => void accept()}>
          {saving ? 'Сохраняем...' : 'Согласен'}
        </Button>
        {window.Telegram?.WebApp?.close && (
          <Button size="m" stretched mode="plain" onClick={decline}>
            Не согласен — закрыть
          </Button>
        )}
      </div>
    </div>
  );
};
