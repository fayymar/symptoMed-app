import { apiFetch, jsonHeaders } from './client';
import { CONSENT_VERSION, isConsentAcceptedHere } from './consent';

export interface Question {
  text: string;
  options: string[];
}

export interface Specialist {
  name: string;
  description: string;
  percent?: number;
  percentage?: number;
}

export interface StartResponse {
  session_id: string;
  questions: Question[];
  red_flag?: boolean;
  needs_fresh_metrics?: string[];
}

export interface DurationResponse {
  anamnesis_questions: Question[];
}

export interface ResultResponse {
  consultation_id?: number | null;
  urgency: string;
  recommendation: string;
  specialists: Specialist[];
  needs_fresh_metrics?: string[];
}

// Пользователь определяется бэкендом по токену (см. client.ts), user_id не передаём.
// Гость (без входа) подтверждает согласие в окне — тогда передаём его версию в запросе;
// у вошедшего пользователя бэкенд проверяет согласие по базе.
export async function startConsultation(symptoms: string): Promise<StartResponse> {
  const consent = isConsentAcceptedHere()
    ? { consent_version: CONSENT_VERSION, consent_source: 'miniapp' }
    : {};
  return apiFetch('/api/consultation/start', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ symptoms, ...consent }),
  });
}

export async function sendAnswers(sessionId: string, answers: string[]): Promise<void> {
  await apiFetch('/api/consultation/answer', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      session_id: sessionId,
      answers, // plain strings, not objects
    }),
  });
}

export async function sendDuration(
  sessionId: string,
  duration: string,
): Promise<DurationResponse> {
  return apiFetch('/api/consultation/duration', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ session_id: sessionId, duration }),
  });
}

export async function getResult(
  sessionId: string,
  anamnesisAnswers?: string[],
): Promise<ResultResponse> {
  return apiFetch('/api/consultation/result', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      session_id: sessionId,
      anamnesis_answers: anamnesisAnswers ?? [],
    }),
  });
}
