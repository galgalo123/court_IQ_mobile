import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SampleBanner } from '@/components/sample-banner';
import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { findLeague } from '@/features/league';
import { SAMPLE_FIXTURES, SAMPLE_RESULTS, SHOW_SAMPLE_DATA } from '@/features/sample';

export default function PlayerGames() {
  const { user } = useAuth();
  const league = findLeague(user?.team?.leagueId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>GAMES</Text>
        <Text style={styles.title}>Fixtures and results</Text>
        <SampleBanner />

        <View style={styles.card}>
          <Text style={styles.label}>{league?.name ?? 'YOUR LEAGUE'}</Text>
          <Text style={styles.big}>{user?.team?.name ?? 'No team yet'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>UPCOMING</Text>
          {SHOW_SAMPLE_DATA ? (
            SAMPLE_FIXTURES.map((f) => (
              <View key={f.opponent} style={styles.item}>
                <Text style={styles.big}>vs {f.opponent}</Text>
                <Text style={styles.body}>{f.when}</Text>
                <Text style={styles.body}>{f.venue}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>No fixtures scheduled yet.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>RESULTS</Text>
          {SHOW_SAMPLE_DATA ? (
            SAMPLE_RESULTS.map((r) => (
              <View key={r.opponent} style={styles.item}>
                <Text style={styles.big}>{r.opponent}</Text>
                <Text style={styles.body}>
                  {r.result} · you scored {r.points}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>Results appear here after each game is recorded.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 10 },
  label: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  big: { color: palette.text, fontSize: 18, fontWeight: '700' },
  body: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  item: { gap: 4 },
});