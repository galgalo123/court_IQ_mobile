import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field, PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { findLeague, type TeamGender } from '@/features/league';

export default function DetailsStep() {
  const { createTeam } = useAuth();
  const params = useLocalSearchParams<{ gender?: string; leagueId?: string }>();
  const gender: TeamGender = params.gender === 'women' ? 'women' : 'men';
  const league = findLeague(params.leagueId);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (!name.trim()) return setError("Enter your team's name.");
    if (!league) return setError('Go back and choose a league.');
    setError('');
    // Saving the team updates the session, and the root layout opens the dashboard for the role.
    createTeam({
      id: `team-${Date.now()}`,
      name: name.trim(),
      gender,
      leagueId: league.id,
      city: city.trim(),
      homeVenue: venue.trim(),
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>STEP 3 OF 3</Text>
        <Text style={styles.title}>Team details</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>{gender === 'men' ? "Men's team" : "Women's team"}</Text>
          <Text style={styles.summaryText}>{league?.name ?? 'No league chosen'}</Text>
        </View>

        <Field label="Team name *" value={name} onChangeText={setName} placeholder="e.g. Nairobi City Thunder" />
        <Field label="City or county" value={city} onChangeText={setCity} placeholder="e.g. Nairobi" />
        <Field label="Home venue" value={venue} onChangeText={setVenue} placeholder="e.g. Nyayo National Stadium Gymnasium" />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Create team" onPress={submit} />

        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  step: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  summary: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 14, padding: 14, gap: 4 },
  summaryText: { color: palette.text, fontSize: 14 },
  error: { color: palette.error, fontSize: 14 },
  back: { color: palette.muted, fontSize: 14, textAlign: 'center' },
});
