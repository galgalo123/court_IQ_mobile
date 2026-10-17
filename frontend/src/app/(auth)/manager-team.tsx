import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field, PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { onboarding } from '@/features/onboarding';
import { APP_ROLE, SERVER_ROLE } from '@/features/roles';
import { registerManagerOnServer, toAppTeam } from '@/lib/api';

export default function ManagerTeam() {
  const [teamName, setTeamName] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function create() {
    const draft = onboarding.manager;
    if (!draft.name || !draft.email || !draft.phone || !draft.password || !draft.role || !draft.gender || !draft.leagueId) {
      return setError('Some details are missing. Start again from Create a team.');
    }
    if (!teamName.trim()) return setError("Enter your team's name.");

    setError('');
    setSubmitting(true);
    try {
      const result = await registerManagerOnServer({
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        password: draft.password,
        role: SERVER_ROLE[draft.role],
        teamName: teamName.trim(),
        gender: draft.gender,
        leagueId: draft.leagueId,
        city: city.trim(),
        homeVenue: venue.trim(),
      });

      // The session starts only after the manager has seen the code, so the invite screen stays visible.
      onboarding.pending = {
        code: result.code,
        user: {
          name: result.name,
          email: result.email,
          role: APP_ROLE[result.role] ?? 'Statistician',
          serverId: result.userId,
          team: toAppTeam(result.team),
        },
      };
      onboarding.manager = {};
      router.push('/manager-invite');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the team.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>STEP 4 OF 4 · TEAM DETAILS</Text>
        <Text style={styles.title}>Team details</Text>

        <Field label="Team name *" value={teamName} onChangeText={setTeamName} placeholder="e.g. USIU Tigers" />
        <Field label="City or county" value={city} onChangeText={setCity} placeholder="e.g. Nairobi" />
        <Field label="Home venue" value={venue} onChangeText={setVenue} placeholder="e.g. Nyayo National Stadium Gymnasium" />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={submitting ? 'Creating team...' : 'Create team'} onPress={create} disabled={submitting} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  step: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 30, fontWeight: '700' },
  error: { color: palette.error, fontSize: 14 },
});