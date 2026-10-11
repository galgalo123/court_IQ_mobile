import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { DEMO_OPPONENT } from '@/features/game/demo';

export default function StatisticianHome() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>STATISTICIAN</Text>
        <Text style={styles.title}>Game day, {firstName}.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>NEXT GAME · TONIGHT 6:30 PM</Text>
          <Text style={styles.matchup}>CourtIQ vs {DEMO_OPPONENT}</Text>
          <Text style={styles.muted}>Home · Court 2</Text>
          <Pressable style={styles.primary} onPress={() => router.push('/live')}>
            <Text style={styles.primaryText}>Start live stats</Text>
          </Pressable>
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
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 8 },
  label: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  matchup: { color: palette.text, fontSize: 22, fontWeight: '700' },
  muted: { color: palette.muted, fontSize: 14 },
  primary: { backgroundColor: palette.text, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  primaryText: { color: palette.inverse, fontSize: 16, fontWeight: '700' },
});
