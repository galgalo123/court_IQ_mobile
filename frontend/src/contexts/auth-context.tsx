import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Role } from '@/features/roles';
import type { Team } from '@/features/team';

export type Account = { name: string; email: string; role: Role };
export type User = Account & { team: Team | null };

type AuthValue = {
  user: User | null;
  signIn: (account: Account) => void;
  signUp: (account: Account) => void;
  createTeam: (team: Team) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

// In-memory session only. Replace with the backend sign-in and team approval flow.
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      signIn: (account) => setUser({ ...account, team: null }),
      signUp: (account) => setUser({ ...account, team: null }),
      createTeam: (team) => setUser((current) => (current ? { ...current, team } : current)),
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
