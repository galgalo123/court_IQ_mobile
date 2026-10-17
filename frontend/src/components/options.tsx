import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/palette';

export function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipOn]}>
      <Text style={[styles.chipText, selected && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

export function OptionCard({ title, body, onPress }: { title: string; body: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderColor: palette.border, borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: palette.surface },
  chipOn: { backgroundColor: palette.text, borderColor: palette.text },
  chipText: { color: palette.text, fontSize: 14, fontWeight: '600' },
  chipTextOn: { color: palette.inverse },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 6 },
  cardTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  cardBody: { color: palette.muted, fontSize: 13, lineHeight: 19 },
});