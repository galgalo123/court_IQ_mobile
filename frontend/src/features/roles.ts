export type Role = 'Statistician' | 'Player' | 'Coach' | 'Medical';

export const ROLES: Role[] = ['Statistician', 'Player', 'Coach', 'Medical'];

export const ROLE_COPY: Record<Role, string> = {
  Statistician: 'Record live games and keep match records accurate.',
  Player: 'Track your performance, games and availability.',
  Coach: 'Monitor team form, fixtures and player comparisons.',
  Medical: 'Maintain availability and authorised medical records.',
};
