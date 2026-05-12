const BASE_URL = 'https://telegram-doctor-bot.onrender.com/api/consultation';

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
  red_flag?: { text: string } | null;
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
  const response = await fetch(`${BASE_URL}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, symptoms }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function sendAnswers(
  sessionId: string,
  userId: number,
  answers: string[],
): Promise<void> {
  // Fix: send plain string array, not objects
  const response = await fetch(`${BASE_URL}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      user_id: userId,
      answers: answers, // plain strings, not objects
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

export async function sendDuration(
  sessionId: string,
  duration: string,
): Promise<DurationResponse> {
  const response = await fetch(`${BASE_URL}/duration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, duration }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function getResult(
  sessionId: string,
  anamnesisAnswers?: string[],
): Promise<ResultResponse> {
  // Fix: send anamnesis_answers so backend can use them in AI prompt
  const response = await fetch(`${BASE_URL}/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      anamnesis_answers: anamnesisAnswers ?? [],
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
