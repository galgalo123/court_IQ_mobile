import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { Field, PrimaryButton } from '@/components/ui';
import { ROLES, ROLE_COPY, type Role } from '@/features/roles';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('Player');
  const [error, setError] = useState('');

  function submit() {
    if (!name.trim()) return setError('Enter your name.');
    if (!email.includes('@')) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setError('');
    signUp({ name: name.trim(), email: email.trim(), role });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create account</Text>

        <Field label="Full name" value={name} onChangeText={setName} autoComplete="name" />
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" />
        <Field label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry autoComplete="new-password" />

        <Text style={styles.label}>I am a</Text>
        <View style={styles.roles}>
          {ROLES.map((item) => (
            <Pressable key={item} onPress={() => setRole(item)} style={[styles.roleCard, role === item && styles.roleCardOn]}>
              <Text style={[styles.roleName, role === item && styles.roleNameOn]}>{item}</Text>
              <Text style={[styles.roleCopy, role === item && styles.roleCopyOn]}>{ROLE_COPY[item]}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.note}>
          Statistician, Coach and Medical accounts will need approval from the team manager once the backend is connected.
          Preview access is open for now.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Create account" onPress={submit} />

        <Pressable onPress={() => router.replace('/sign-in')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  label: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  roles: { gap: 10 },
  roleCard: { borderColor: palette.border, borderWidth: 1, borderRadius: 14, padding: 14, gap: 4, backgroundColor: palette.surface },
  roleCardOn: { borderColor: palette.text, backgroundColor: palette.raised },
  roleName: { color: palette.text, fontSize: 15, fontWeight: '700' },
  roleNameOn: { color: palette.text },
  roleCopy: { color: palette.muted, fontSize: 13, lineHeight: 18 },
  roleCopyOn: { color: palette.text },
  note: { color: palette.muted, fontSize: 12, lineHeight: 17 },
  error: { color: palette.error, fontSize: 14 },
  link: { color: palette.text, fontSize: 14, textAlign: 'center' },
});
