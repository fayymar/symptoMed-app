import { apiFetch, jsonHeaders } from './client';

export function getHealthMetrics(userId: number, type?: string, limit?: number): Promise<unknown> {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (limit) params.set('limit', String(limit));
  const qs = params.toString();
  return apiFetch(`/api/health/metrics/${userId}${qs ? `?${qs}` : ''}`);
}

export function postHealthMetric(userId: number, data: object): Promise<{ ok: boolean }> {
  return apiFetch(`/api/health/metrics/${userId}`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

export function getHealthMetricsReport(userId: number, body?: object): Promise<unknown> {
  return apiFetch(`/api/health/metrics/report/${userId}`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function getHeartrate(userId: number): Promise<unknown> {
  return apiFetch(`/api/health/heartrate/${userId}`);
}
