import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';

const STATUSES = ['Available', 'Restricted', 'Recovering', 'Unavailable'];

export default function PlayerMedical() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>MEDICAL STATUS</Text>
        <Text style={styles.title}>Your availability</Text>

        <View style={styles.card}>
          <Text style={styles.label}>CURRENT STATUS</Text>
          <Text style={styles.big}>Not set yet</Text>
          <Text style={styles.body}>
            Your medical staff set your status after each assessment. Detailed medical notes stay with authorised staff.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>STATUS LEVELS</Text>
          <View style={styles.row}>
            {STATUSES.map((status) => (
              <View key={status} style={styles.chip}>
                <Text style={styles.chipText}>{status}</Text>
              </View>
            ))}
          </View>
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
  big: { color: palette.text, fontSize: 24, fontWeight: '700' },
  body: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: palette.border, borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { color: palette.muted, fontSize: 13, fontWeight: '600' },
});