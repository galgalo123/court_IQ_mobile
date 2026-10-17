import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SampleBanner } from '@/components/sample-banner';
import { palette } from '@/constants/palette';
import { SAMPLE_LAST_FIVE, SAMPLE_SEASON, SHOW_SAMPLE_DATA } from '@/features/sample';

const TILES = [
  { short: 'PPG', long: 'Points per game', value: SAMPLE_SEASON.ppg },
  { short: 'RPG', long: 'Rebounds per game', value: SAMPLE_SEASON.rpg },
  { short: 'APG', long: 'Assists per game', value: SAMPLE_SEASON.apg },
  { short: 'FG%', long: 'Field goal', value: SAMPLE_SEASON.fg },
  { short: '3P%', long: 'Three-point', value: SAMPLE_SEASON.tp },
  { short: 'FT%', long: 'Free throw', value: SAMPLE_SEASON.ft },
  { short: '+/−', long: 'Plus/minus', value: SAMPLE_SEASON.pm },
  { short: 'MIN', long: 'Minutes', value: SAMPLE_SEASON.min },
];

export default function PlayerPerformance() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>PERFORMANCE</Text>
        <Text style={styles.title}>Your season</Text>
        <SampleBanner />
        <Text style={styles.body}>
          Your numbers come from the games your team records. They fill in here once a game is saved.
        </Text>

        <View style={styles.grid}>
          {TILES.map((tile) => (
            <View key={tile.short} style={styles.tile}>
              <Text style={styles.short}>{tile.short}</Text>
              <Text style={styles.value}>{SHOW_SAMPLE_DATA ? tile.value : '—'}</Text>
              <Text style={styles.long}>{tile.long}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>LAST FIVE GAMES · POINTS</Text>
          {SHOW_SAMPLE_DATA ? (
            <View style={styles.trend}>
              {SAMPLE_LAST_FIVE.map((points, i) => (
                <View key={i} style={styles.trendItem}>
                  <Text style={styles.trendValue}>{points}</Text>
                  <Text style={styles.long}>G{i + 1}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.body}>Your points in each recent game appear here as a trend.</Text>
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
  body: { color: palette.muted, fontSize: 15, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { flexBasis: '48%', flexGrow: 1, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 14, padding: 16, gap: 4 },
  short: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  value: { color: palette.text, fontSize: 28, fontWeight: '700' },
  long: { color: palette.muted, fontSize: 12 },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 12 },
  label: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  trend: { flexDirection: 'row', justifyContent: 'space-between' },
  trendItem: { alignItems: 'center', gap: 4 },
  trendValue: { color: palette.text, fontSize: 22, fontWeight: '700' },
});