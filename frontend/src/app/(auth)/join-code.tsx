import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field, PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { findLeague } from '@/features/league';
import { onboarding } from '@/features/onboarding';
import { previewCodeOnServer, type CodePreview } from '@/lib/api';

export default function JoinCode() {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<CodePreview | null>(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function check() {
    if (!code.trim()) return setError('Enter the team code from your manager.');

    setError('');
    setPreview(null);
    setChecking(true);
    try {
      const result = await previewCodeOnServer(code);
      if (!result.valid) return setError(result.reason ?? 'This code is not valid.');
      setPreview(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not check the code.');
    } finally {
      setChecking(false);
    }
  }

  function continueJoin() {
    onboarding.join = { code: code.trim().toUpperCase() };
    router.push('/join-account');
  }

  const league = findLeague(preview?.leagueId ?? undefined);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>JOIN A TEAM · STEP 1 OF 2</Text>
        <Text style={styles.title}>Enter your team code</Text>
        <Text style={styles.body}>The code your team manager shared with you.</Text>

        <Field
          label="Team code"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="e.g. K7QF2M9T"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={checking ? 'Checking...' : 'Check code'} onPress={check} disabled={checking} />

        {preview ? (
          <View style={styles.card}>
            <Text style={styles.label}>YOU'RE JOINING</Text>
            <Text style={styles.teamName}>{preview.teamName}</Text>
            <Text style={styles.body}>
              {preview.gender === 'men' ? "Men's team" : "Women's team"}
              {league ? ` · ${league.name}` : ''}
            </Text>
            <PrimaryButton label="Continue" onPress={continueJoin} />
          </View>
        ) : null}

        <Text style={styles.back} onPress={() => router.back()}>
          Back to sign in
        </Text>
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
  label: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  teamName: { color: palette.text, fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 10 },
  error: { color: palette.error, fontSize: 14 },
  back: { color: palette.muted, fontSize: 14, textAlign: 'center', marginTop: 8 },
});