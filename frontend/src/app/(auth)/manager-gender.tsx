import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OptionCard } from '@/components/options';
import { palette } from '@/constants/palette';
import { onboarding } from '@/features/onboarding';

export default function ManagerGender() {
  function choose(gender: 'men' | 'women') {
    // Changing the gender clears any league chosen earlier, since the list depends on it.
    onboarding.manager = { ...onboarding.manager, gender, leagueId: undefined };
    router.push('/manager-league');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.step}>STEP 2 OF 4 · YOUR TEAM</Text>
        <Text style={styles.title}>Men's or women's team?</Text>
        <Text style={styles.body}>This decides which leagues you can join.</Text>

        <OptionCard title="Men's team" body="KBF Premier League, Division One and Division Two" onPress={() => choose('men')} />
        <OptionCard title="Women's team" body="KBF Premier League and Division One" onPress={() => choose('women')} />
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