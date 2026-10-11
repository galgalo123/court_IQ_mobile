import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Role } from '@/features/roles';

export type User = { name: string; email: string; role: Role };

type AuthValue = {
  user: User | null;
  signIn: (user: User) => void;
  signUp: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

// In-memory session only. Replace with the backend sign-in and role-approval flow.
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      signIn: (next) => setUser(next),
      signUp: (next) => setUser(next),
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
