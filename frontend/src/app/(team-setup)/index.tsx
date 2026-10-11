import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import type { TeamGender } from '@/features/league';

export default function GenderStep() {
  function choose(gender: TeamGender) {
    router.push({ pathname: '/league', params: { gender } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.step}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Register your team</Text>
        <Text style={styles.body}>Is your team a men's or a women's team? This decides which leagues you can join.</Text>

        <Pressable style={styles.card} onPress={() => choose('men')}>
          <Text style={styles.cardTitle}>Men's team</Text>
          <Text style={styles.cardBody}>KBF Premier League, Division One and Division Two</Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => choose('women')}>
          <Text style={styles.cardTitle}>Women's team</Text>
          <Text style={styles.cardBody}>KBF Premier League and Division One</Text>
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
  cardTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  cardBody: { color: palette.muted, fontSize: 14, lineHeight: 20 },
});
