import { apiFetch, jsonHeaders } from './client';

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
  urgency: string;
  recommendation: string;
  specialists: Specialist[];
  needs_fresh_metrics?: string[];
}

export async function startConsultation(
  userId: number,
  symptoms: string,
): Promise<StartResponse> {
  return apiFetch('/api/consultation/start', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ user_id: userId, symptoms }),
  });
}

export async function sendAnswers(
  sessionId: string,
  userId: number,
  answers: string[],
): Promise<void> {
  await apiFetch('/api/consultation/answer', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      session_id: sessionId,
      user_id: userId,
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
