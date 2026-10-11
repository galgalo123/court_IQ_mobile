import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { leaguesFor, type TeamGender } from '@/features/league';

export default function LeagueStep() {
  const params = useLocalSearchParams<{ gender?: string }>();
  const gender: TeamGender = params.gender === 'women' ? 'women' : 'men';
  const options = leaguesFor(gender);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.step}>STEP 2 OF 3</Text>
        <Text style={styles.title}>Choose your league</Text>
        <Text style={styles.body}>{gender === 'men' ? "Men's" : "Women's"} leagues. Pick the one your team plays in this season.</Text>

        {options.map((league) => (
          <Pressable
            key={league.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/details', params: { gender, leagueId: league.id } })}
          >
            <Text style={styles.cardTitle}>{league.name}</Text>
            <Text style={styles.cardBody}>{league.tier}</Text>
          </Pressable>
        ))}

        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 14 },
  step: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  body: { color: palette.muted, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 6 },
  cardTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  cardBody: { color: palette.muted, fontSize: 13, lineHeight: 18 },
  back: { color: palette.muted, fontSize: 14, textAlign: 'center', marginTop: 8 },
});
