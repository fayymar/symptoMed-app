export const API_BASE = 'https://telegram-doctor-bot.onrender.com';

/**
 * Centralized fetch wrapper — every request to the Symed backend should go
 * through this so the base URL and error handling live in exactly one place.
 */
export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = (await res.json()) as { message?: string; error?: string };
      msg = j.message || j.error || msg;
    } catch {
      // response wasn't JSON — keep the generic HTTP status message
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}
