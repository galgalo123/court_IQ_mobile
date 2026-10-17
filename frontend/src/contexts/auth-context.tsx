import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Role } from '@/features/roles';
import type { Team } from '@/features/team';

export type Account = { name: string; email: string; role: Role; serverId: number };
export type User = Account & { team: Team };

type AuthValue = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

// The session lives in memory for now. Login tokens replace this later.
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      signIn: (next) => setUser(next),
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