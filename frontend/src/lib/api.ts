import type { Team } from '@/features/team';

// The backend address. Set EXPO_PUBLIC_API_URL in frontend/.env.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8082';

// Stop waiting after this long, so a dead connection shows an error instead of spinning forever.
const TIMEOUT_MS = 15000;

// Sends a request and returns the parsed response. Server errors arrive as plain text,
// so they're thrown with the server's own message.
async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    throw new Error(
      aborted
        ? `The server at ${BASE_URL} did not reply within 15 seconds. Check that the backend window is still running.`
        : `Could not reach the server at ${BASE_URL}. Check that the backend is running and the address in frontend/.env is correct.`,
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `The server at ${BASE_URL} returned a web page instead of data (status ${response.status}). ` +
        'The backend may be out of date. Restart it and try again.',
    );
  }
}

function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export type ServerTeam = {
  id: number;
  name: string;
  gender: 'men' | 'women';
  leagueId: string;
  city: string | null;
  homeVenue: string | null;
};

// Converts the server's team into the shape the app keeps in its session.
export function toAppTeam(team: ServerTeam): Team {
  return {
    id: String(team.id),
    name: team.name,
    gender: team.gender,
    leagueId: team.leagueId,
    city: team.city ?? '',
    homeVenue: team.homeVenue ?? '',
  };
}

export type SignInResult = {
  id: number;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  teamId: number | null;
  manager: boolean;
  gender: string | null;
  position: string | null;
  heightInches: number | null;
  height: string | null;
};

// identifier is an email address or a phone number.
export function signInOnServer(identifier: string, password: string) {
  return apiPost<SignInResult>('/api/auth/sign-in', { identifier, password });
}

export type ManagerInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  teamName: string;
  gender: string;
  leagueId: string;
  city: string;
  homeVenue: string;
};

export type ManagerResult = {
  userId: number;
  name: string;
  email: string;
  role: string;
  team: ServerTeam;
  code: string;
  expiresAt: string;
};

export function registerManagerOnServer(input: ManagerInput) {
  return apiPost<ManagerResult>('/api/onboarding/manager', input);
}

export type CodePreview = {
  valid: boolean;
  reason: string | null;
  teamName: string | null;
  gender: string | null;
  leagueId: string | null;
};

export function previewCodeOnServer(code: string) {
  return apiGet<CodePreview>(`/api/onboarding/invitations/${encodeURIComponent(code.trim().toUpperCase())}`);
}

export type JoinInput = {
  code: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  gender?: string;
  position?: string;
  heightInches?: number;
  dateOfBirth?: string;
};

export type JoinResult = {
  userId: number;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  team: ServerTeam;
};

export function joinWithCodeOnServer(input: JoinInput) {
  return apiPost<JoinResult>('/api/onboarding/join', input);
}

export function getTeamOnServer(teamId: number) {
  return apiGet<ServerTeam>(`/api/teams/${teamId}`);
}

export type ProfileResult = {
  id: number;
  name: string;
  gender: string;
  position: string;
  heightInches: number;
  height: string;
  dateOfBirth: string | null;
};

export function getProfileOnServer(userId: number) {
  return apiGet<ProfileResult>(`/api/users/${userId}`);
}

export type MemberResult = {
  userId: number;
  name: string;
  role: string;
  manager: boolean;
  gender: string | null;
  position: string | null;
  heightInches: number | null;
  height: string | null;
};

export function getTeamMembersOnServer(teamId: number) {
  return apiGet<MemberResult[]>(`/api/teams/${teamId}/members`);
}