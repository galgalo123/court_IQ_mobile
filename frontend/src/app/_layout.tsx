import { Stack } from 'expo-router';

import { palette } from '@/constants/palette';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}

// Order matters: sign in, then register a team, then the dashboard for the role.
function RootStack() {
  const { user } = useAuth();
  const role = user?.role;
  const hasTeam = !!user?.team;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!user && !hasTeam}>
        <Stack.Screen name="(team-setup)" />
      </Stack.Protected>
      <Stack.Protected guard={hasTeam && role === 'Statistician'}>
        <Stack.Screen name="(statistician)" />
      </Stack.Protected>
      <Stack.Protected guard={hasTeam && role === 'Player'}>
        <Stack.Screen name="(player)" />
      </Stack.Protected>
      <Stack.Protected guard={hasTeam && role === 'Coach'}>
        <Stack.Screen name="(coach)" />
      </Stack.Protected>
      <Stack.Protected guard={hasTeam && role === 'Medical'}>
        <Stack.Screen name="(medical)" />
      </Stack.Protected>
    </Stack>
  );
}
