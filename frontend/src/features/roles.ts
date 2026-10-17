export type Role = 'Statistician' | 'Player' | 'Coach' | 'Medical';

export const ROLES: Role[] = ['Statistician', 'Player', 'Coach', 'Medical'];

// Roles a team manager can be. Players can't manage a team.
export const STAFF_ROLES: Role[] = ['Statistician', 'Coach', 'Medical'];

export const ROLE_COPY: Record<Role, string> = {
  Statistician: 'Record live games and keep match records accurate.',
  Player: 'Track your performance, games and availability.',
  Coach: 'Monitor team form, fixtures and player comparisons.',
  Medical: 'Maintain availability and authorised medical records.',
};

// The names the server uses, and the reverse mapping.
export const SERVER_ROLE: Record<Role, string> = {
  Statistician: 'STATISTICIAN',
  Player: 'PLAYER',
  Coach: 'COACH',
  Medical: 'MEDICAL',
};

export const APP_ROLE: Record<string, Role> = {
  STATISTICIAN: 'Statistician',
  PLAYER: 'Player',
  COACH: 'Coach',
  MEDICAL: 'Medical',
};