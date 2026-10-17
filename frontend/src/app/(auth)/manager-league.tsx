import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OptionCard } from '@/components/options';
import { palette } from '@/constants/palette';
import { leaguesFor } from '@/features/league';
import { onboarding } from '@/features/onboarding';

export default function ManagerLeague() {
  const gender = onboarding.manager.gender ?? 'men';

  function choose(leagueId: string) {
    onboarding.manager = { ...onboarding.manager, leagueId };
    router.push('/manager-team');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.step}>STEP 3 OF 4 · YOUR TEAM</Text>
        <Text style={styles.title}>Choose your league</Text>
        <Text style={styles.body}>{gender === 'men' ? "Men's" : "Women's"} leagues this season.</Text>

        {leaguesFor(gender).map((league) => (
          <OptionCard key={league.id} title={league.name} body={league.tier} onPress={() => choose(league.id)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 14 },
  step: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 30, fontWeight: '700' },
  body: { color: palette.muted, fontSize: 15, lineHeight: 22, marginBottom: 8 },
});