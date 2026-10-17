import type { User } from '@/contexts/auth-context';
import type { Role } from '@/features/roles';

export const onboarding: {
  manager: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: Role;
    gender?: 'men' | 'women';
    leagueId?: string;
  };
  join: { code?: string };
  pending: { code: string; user: User } | null;
} = { manager: {}, join: {}, pending: null };