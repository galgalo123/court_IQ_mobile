import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { Field, PrimaryButton } from '@/components/ui';
import { ROLES, type Role } from '@/features/roles';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [devRole, setDevRole] = useState<Role>('Statistician');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.brand}>CourtIQ</Text>
        <Text style={styles.title}>Sign in</Text>

        <Field label="Email or username" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="username" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" />

        <PrimaryButton
          label="Sign in"
          onPress={() => signIn({ name: email.split('@')[0] || 'User', email, role: devRole })}
        />

        <View style={styles.devBox}>
          <Text style={styles.devTitle}>Development only</Text>
          <Text style={styles.devBody}>No server check yet. Pick a role to preview its screens.</Text>
          <View style={styles.roleRow}>
            {ROLES.map((role) => (
              <Pressable key={role} onPress={() => setDevRole(role)} style={[styles.roleChip, devRole === role && styles.roleChipOn]}>
                <Text style={[styles.roleText, devRole === role && styles.roleTextOn]}>{role}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={() => router.push('/sign-up')}>
          <Text style={styles.link}>New here? Create an account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  wrap: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  brand: { color: palette.muted, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700', marginBottom: 8 },
  devBox: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 12, padding: 14, gap: 8, marginTop: 8 },
  devTitle: { color: palette.warning, fontSize: 13, fontWeight: '700' },
  devBody: { color: palette.muted, fontSize: 13, lineHeight: 18 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  roleChip: { borderColor: palette.border, borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  roleChipOn: { backgroundColor: palette.text, borderColor: palette.text },
  roleText: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  roleTextOn: { color: palette.inverse },
  link: { color: palette.text, fontSize: 14, textAlign: 'center', marginTop: 8 },
});
