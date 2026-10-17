import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { findLeague } from '@/features/league';
import { positionLabel } from '@/features/profile';
import { useProfile } from '@/lib/use-profile';

export default function PlayerHome() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const league = findLeague(user?.team?.leagueId);
  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>PLAYER</Text>
        <Text style={styles.title}>Hi, {firstName}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>YOUR TEAM</Text>
          <Text style={styles.big}>{user?.team?.name ?? 'No team yet'}</Text>
          {league ? <Text style={styles.muted}>{league.name}</Text> : null}
          {user?.team?.homeVenue ? <Text style={styles.muted}>{user.team.homeVenue}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>YOUR PROFILE</Text>
          {loading ? (
            <Text style={styles.muted}>Loading...</Text>
          ) : (
            <View style={styles.grid}>
              <Detail label="Position" value={positionLabel(profile?.position)} />
              <Detail label="Height" value={profile?.height ?? '—'} />
              <Detail label="Gender" value={profile?.gender === 'men' ? "Men's" : profile?.gender === 'women' ? "Women's" : '—'} />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>NEXT GAME</Text>
          <Text style={styles.body}>No fixtures yet. Your team's schedule appears here once the manager adds games.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 8 },
  label: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  big: { color: palette.text, fontSize: 22, fontWeight: '700' },
  body: { color: palette.text, fontSize: 15, lineHeight: 22 },
  muted: { color: palette.muted, fontSize: 14 },
  grid: { flexDirection: 'row', gap: 12 },
  detail: { flex: 1, gap: 4 },
  value: { color: palette.text, fontSize: 16, fontWeight: '600' },
});