export const API_BASE = 'https://telegram-doctor-bot.onrender.com';

/**
 * Авторизация Mini App.
 * Бэкенд больше не доверяет user_id из запроса: Mini App отправляет подписанную
 * Telegram строку initData на /api/auth/telegram-webapp и получает токен сессии,
 * который добавляется ко всем запросам (Authorization: Bearer).
 */
const TOKEN_KEY = 'symptomed_token';
let tokenPromise: Promise<string | null> | null = null;

function readStoredToken(): string | null {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function storeToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage недоступен — токен живёт только в памяти
  }
}

async function login(): Promise<string | null> {
  const initData = window.Telegram?.WebApp?.initData;
  if (!initData) return null; // открыто не из Telegram — работаем как гость
  const res = await fetch(`${API_BASE}/api/auth/telegram-webapp`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ init_data: initData }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { token?: string };
  storeToken(data.token ?? null);
  return data.token ?? null;
}

async function getToken(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh) {
    const stored = readStoredToken();
    if (stored) return stored;
  }
  if (!tokenPromise || forceRefresh) {
    tokenPromise = login().catch(() => null).finally(() => { tokenPromise = null; });
  }
  return tokenPromise;
}

/** Есть ли сессия пользователя (открыто из Telegram и вход по initData удался). Без неё — гостевой режим. */
export async function hasSession(): Promise<boolean> {
  return (await getToken()) !== null;
}

/** Событие, по которому показывается окно согласия (бэкенд ответил 403 consent_required). */
export const CONSENT_REQUIRED_EVENT = 'symed:consent-required';

async function doFetch(path: string, options: RequestInit | undefined, token: string | null) {
  const headers = new Headers(options?.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

/**
 * Centralized fetch wrapper — every request to the Symed backend should go
 * through this so the base URL, auth and error handling live in exactly one place.
 */
export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  let res = await doFetch(path, options, token);
  if (res.status === 401 && token) {
    // Токен истёк — входим заново по initData и повторяем запрос один раз
    storeToken(null);
    res = await doFetch(path, options, await getToken(true));
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = (await res.json()) as { message?: string; error?: string };
      msg = j.message || j.error || msg;
    } catch {
      // response wasn't JSON — keep the generic HTTP status message
    }
    if (res.status === 403 && msg === 'consent_required') {
      window.dispatchEvent(new Event(CONSENT_REQUIRED_EVENT));
      msg = 'Нужно согласие на обработку данных';
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}
