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

// Signed-out people see the auth screens. Signed-in people see the tabs for their role.
function RootStack() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'Statistician'}>
        <Stack.Screen name="(statistician)" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'Player'}>
        <Stack.Screen name="(player)" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'Coach'}>
        <Stack.Screen name="(coach)" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'Medical'}>
        <Stack.Screen name="(medical)" />
      </Stack.Protected>
    </Stack>
  );
}