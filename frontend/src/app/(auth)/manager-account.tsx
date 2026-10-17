import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Choice } from '@/components/options';
import { Field, PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { isValidKenyanPhone } from '@/features/phone';
import { onboarding } from '@/features/onboarding';
import { ROLE_COPY, STAFF_ROLES, type Role } from '@/features/roles';

export default function ManagerAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('Statistician');
  const [error, setError] = useState('');

  function next() {
    if (!name.trim()) return setError('Enter your name.');
    if (!email.includes('@')) return setError('Enter a valid email address.');
    if (!isValidKenyanPhone(phone)) return setError('Enter a valid phone number, for example 0712 345 678.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setError('');
    onboarding.manager = {
      ...onboarding.manager,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role,
    };
    router.push('/manager-gender');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>STEP 1 OF 4 · YOUR ACCOUNT</Text>
        <Text style={styles.title}>Create a team</Text>
        <Text style={styles.body}>
          You'll be the team manager. You can be a statistician, coach or medical staff member.
        </Text>

        <Field label="Full name" value={name} onChangeText={setName} autoComplete="name" />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
        />
        <Field
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="0712 345 678"
          autoComplete="tel"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
        />
        <Field
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
        />

        <Text style={styles.label}>I am a</Text>
        <View style={styles.row}>
          {STAFF_ROLES.map((item) => (
            <Choice key={item} label={item} selected={role === item} onPress={() => setRole(item)} />
          ))}
        </View>
        <Text style={styles.body}>{ROLE_COPY[role]}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Next" onPress={next} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  step: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 30, fontWeight: '700' },
  body: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  label: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  error: { color: palette.error, fontSize: 14 },
});