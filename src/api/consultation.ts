const BASE_URL = 'https://telegram-doctor-bot.onrender.com/api/consultation';

export interface Question {
  text: string;
  options: string[];
}

export interface Specialist {
  name: string;
  description: string;
  percent: number;
}

export interface StartConsultationResponse {
  sessionId: string;
  questions: Question[];
}

export interface ResultResponse {
  specialists: Specialist[];
}

export async function startConsultation(
  userId: number,
  symptoms: string,
): Promise<StartConsultationResponse> {
  const response = await fetch(`${BASE_URL}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, symptoms }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function sendAnswer(
  sessionId: string,
  questionIndex: number,
  answer: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, questionIndex, answer }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

export async function sendDuration(
  sessionId: string,
  duration: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/duration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, duration }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

export async function getResult(sessionId: string): Promise<ResultResponse> {
  const response = await fetch(`${BASE_URL}/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
