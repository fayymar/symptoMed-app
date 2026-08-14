import { apiFetch, jsonHeaders } from './client';

export interface ProfileResponse {
  exists: boolean;
  profile?: Record<string, any>;
}

export function getProfile(userId: number): Promise<ProfileResponse> {
  return apiFetch(`/api/profile/${userId}`);
}

export function saveProfile(userId: number, data: object): Promise<any> {
  return apiFetch(`/api/profile/${userId}`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

export interface ConsultationRecord {
  id: string;
  created_at: string;
  symptoms: string;
  recommended_doctor?: string;
}

export function getConsultations(userId: number): Promise<{ records: ConsultationRecord[] }> {
  return apiFetch(`/api/consultations/${userId}`);
}
