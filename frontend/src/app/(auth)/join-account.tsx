import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Choice } from '@/components/options';
import { Field, PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { onboarding } from '@/features/onboarding';
import { isValidKenyanPhone, normalizePhone } from '@/features/phone';
import { APP_ROLE, ROLES, ROLE_COPY, SERVER_ROLE, type Role } from '@/features/roles';
import { joinWithCodeOnServer, toAppTeam } from '@/lib/api';

const POSITIONS = [
  { value: 'POINT_GUARD', label: 'Point guard' },
  { value: 'SHOOTING_GUARD', label: 'Shooting guard' },
  { value: 'SMALL_FORWARD', label: 'Small forward' },
  { value: 'POWER_FORWARD', label: 'Power forward' },
  { value: 'CENTRE', label: 'Centre' },
];

export default function JoinAccount() {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('Player');
  const [gender, setGender] = useState<'men' | 'women' | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function join() {
    const code = onboarding.join.code;
    if (!code) return setError('Enter the team code first, from the join screen.');
    if (!name.trim()) return setError('Enter your name.');
    if (!email.includes('@')) return setError('Enter a valid email address.');
    if (!isValidKenyanPhone(phone)) return setError('Enter a valid phone number, for example 0712 345 678.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    let heightInches: number | undefined;
    if (role === 'Player') {
      if (!gender) return setError('Choose men or women.');
      if (!position) return setError('Choose your position.');
      const ft = Number(feet);
      const inch = inches === '' ? 0 : Number(inches);
      if (!Number.isInteger(ft) || ft < 4 || ft > 8) return setError('Enter a height between 4 and 8 feet.');
      if (!Number.isInteger(inch) || inch < 0 || inch > 11) return setError('Inches must be between 0 and 11.');
      if (dob.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
        return setError('Date of birth must look like 2008-05-12.');
      }
      heightInches = ft * 12 + inch;
    }

    setError('');
    setSubmitting(true);
    try {
      const result = await joinWithCodeOnServer({
        code,
        name: name.trim(),
        email: email.trim(),
        phone: normalizePhone(phone),
        password,
        role: SERVER_ROLE[role],
        ...(role === 'Player'
          ? {
              gender: gender ?? undefined,
              position: position ?? undefined,
              heightInches,
              dateOfBirth: dob.trim() || undefined,
            }
          : {}),
      });

      onboarding.join = {};
      signIn({
        name: result.name,
        email: result.email,
        role: APP_ROLE[result.role] ?? 'Player',
        serverId: result.userId,
        team: toAppTeam(result.team),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not join the team.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>JOIN A TEAM · STEP 2 OF 2</Text>
        <Text style={styles.title}>Your details</Text>

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
          {ROLES.map((item) => (
            <Choice key={item} label={item} selected={role === item} onPress={() => setRole(item)} />
          ))}
        </View>
        <Text style={styles.body}>{ROLE_COPY[role]}</Text>

        {role === 'Player' ? (
          <>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.row}>
              {(['men', 'women'] as const).map((g) => (
                <Choice key={g} label={g === 'men' ? 'Men' : 'Women'} selected={gender === g} onPress={() => setGender(g)} />
              ))}
            </View>

            <Text style={styles.label}>Position</Text>
            <View style={styles.column}>
              {POSITIONS.map((p) => (
                <Choice key={p.value} label={p.label} selected={position === p.value} onPress={() => setPosition(p.value)} />
              ))}
            </View>

            <Text style={styles.label}>Height</Text>
            <View style={styles.row}>
              <View style={styles.half}>
                <Field label="Feet" value={feet} onChangeText={setFeet} keyboardType="number-pad" maxLength={1} />
              </View>
              <View style={styles.half}>
                <Field label="Inches" value={inches} onChangeText={setInches} keyboardType="number-pad" maxLength={2} />
              </View>
            </View>

            <Field label="Date of birth (optional)" value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />
          </>
        ) : (
          <Text style={styles.body}>
            Staff accounts need approval from the team manager. Preview access is open for now.
          </Text>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={submitting ? 'Joining...' : 'Join team'} onPress={join} disabled={submitting} />
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
  column: { gap: 8 },
  half: { flex: 1 },
  error: { color: palette.error, fontSize: 14 },
});