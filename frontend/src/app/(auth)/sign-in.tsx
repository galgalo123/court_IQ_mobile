import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field, PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { APP_ROLE } from '@/features/roles';
import { getTeamOnServer, signInOnServer, toAppTeam } from '@/lib/api';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!identifier.trim() || !password) return setError('Enter your email or phone number and password.');

    setError('');
    setSubmitting(true);
    try {
      const account = await signInOnServer(identifier.trim(), password);
      const team = toAppTeam(await getTeamOnServer(account.teamId ?? 0));
      signIn({
        name: account.name,
        email: account.email,
        role: APP_ROLE[account.role] ?? 'Player',
        serverId: account.id,
        team,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>CourtIQ</Text>
        <Text style={styles.title}>Sign in</Text>

        <Field
          label="Email or phone number"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="username"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={submitting ? 'Signing in...' : 'Sign in'} onPress={submit} disabled={submitting} />

        <Pressable onPress={() => router.push('/manager-account')}>
          <Text style={styles.link}>New team manager? Create a team</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/join-code')}>
          <Text style={styles.link}>Have a team code? Join a team</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16, justifyContent: 'center', flexGrow: 1 },
  brand: { color: palette.muted, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700', marginBottom: 8 },
  error: { color: palette.error, fontSize: 14 },
  link: { color: palette.text, fontSize: 14, textAlign: 'center', marginTop: 8 },
});