// The backend address. Set EXPO_PUBLIC_API_URL in frontend/.env, for example:
// EXPO_PUBLIC_API_URL=http://172.16.35.133:8082
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8082';

// Sends a POST request with JSON and returns the parsed response.
// The backend sends errors as plain text, so those are passed on as the error message.
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return JSON.parse(text) as T;
}