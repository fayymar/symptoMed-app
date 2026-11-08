import { apiFetch, hasSession, jsonHeaders } from './client';

/**
 * Согласие на обработку персональных данных (включая данные о здоровье).
 *
 * Версия и текст ДОЛЖНЫ совпадать с бэкендом (telegram-doctor-bot,
 * services/consent.py) и сайтом (symed-web, src/lib/consent.ts). При изменении
 * текста повышайте версию во всех трёх местах.
 */
export const CONSENT_VERSION = '2026-11-08';

export const PRIVACY_URL = 'https://symed.uz/privacy';

export const CONSENT_INTRO =
  'Symed работает с данными о вашем здоровье: симптомами, анамнезом, показателями и историей консультаций. ' +
  'Без вашего согласия мы не можем их обрабатывать.';

export const CONSENT_POINTS = [
  'на обработку ваших персональных данных, включая данные о здоровье, чтобы подобрать вам врача-специалиста;',
  'на хранение данных на защищённых серверах в ЕС;',
  'на передачу симптомов, ответов на вопросы, возраста, пола и медицинского анамнеза — без имени и телефона — AI-сервисам в США для анализа.',
];

export const CONSENT_WITHDRAW =
  'Отозвать согласие и удалить все данные можно в любой момент командой /deletedata в Telegram-боте.';

export const CONSENT_DISCLAIMER = 'Symed не ставит диагноз и не заменяет врача.';

// Версия, подтверждённая в этом окне Mini App. Для вошедшего пользователя — лишь
// кэш (проверяет бэкенд); для гостя — основание передать согласие в консультацию.
const ACCEPTED_KEY = 'symed_consent_version';

export function isConsentAcceptedHere(): boolean {
  try { return sessionStorage.getItem(ACCEPTED_KEY) === CONSENT_VERSION; } catch { return false; }
}

function rememberAccepted(): void {
  try { sessionStorage.setItem(ACCEPTED_KEY, CONSENT_VERSION); } catch { /* storage недоступен */ }
}

/** Нужно ли показать окно согласия. */
export async function needsConsent(): Promise<boolean> {
  if (isConsentAcceptedHere()) return false;
  if (!(await hasSession())) return true; // гость: согласие даётся в этом окне
  const d = await apiFetch<{ accepted?: boolean }>('/api/consent');
  if (d?.accepted) rememberAccepted();
  return !d?.accepted;
}

/** Фиксирует согласие: на бэкенде (если есть сессия) и в этом окне. */
export async function acceptConsent(): Promise<void> {
  if (await hasSession()) {
    await apiFetch('/api/consent', {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ version: CONSENT_VERSION, source: 'miniapp' }),
    });
  }
  rememberAccepted();
}
