import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Roster } from '@/components/roster';
import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';

export default function CoachTeam() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>TEAM</Text>
        <Text style={styles.title}>{user?.team?.name ?? 'Your team'}</Text>
        <Roster teamId={user?.team?.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
});