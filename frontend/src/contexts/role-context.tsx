import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export type Role = 'Statistician' | 'Player' | 'Coach' | 'Doctor';

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  isCaptain: boolean;
  setIsCaptain: (isCaptain: boolean) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<Role>('Player');
  const [isCaptain, setIsCaptain] = useState(false);

  return <RoleContext.Provider value={{ role, setRole, isCaptain, setIsCaptain }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }

  return context;
}