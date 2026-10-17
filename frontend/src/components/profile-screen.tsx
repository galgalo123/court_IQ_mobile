import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { findLeague } from '@/features/league';
import { positionLabel } from '@/features/profile';
import { useProfile } from '@/lib/use-profile';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const league = findLeague(user?.team?.leagueId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>PROFILE</Text>
        <Text style={styles.title}>{user?.name ?? 'Account'}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Team</Text>
          <Text style={styles.value}>{user?.team?.name ?? 'No team'}</Text>
          <Text style={styles.label}>League</Text>
          <Text style={styles.value}>{league?.name ?? '—'}</Text>
          <Text style={styles.label}>Home venue</Text>
          <Text style={styles.value}>{user?.team?.homeVenue || '—'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Playing details</Text>
          {loading ? (
            <Text style={styles.value}>Loading...</Text>
          ) : (
            <>
              <Text style={styles.label}>Position</Text>
              <Text style={styles.value}>{positionLabel(profile?.position)}</Text>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>{profile?.height ?? '—'}</Text>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{profile?.gender === 'men' ? "Men's" : profile?.gender === 'women' ? "Women's" : '—'}</Text>
            </>
          )}
        </View>

        <Pressable onPress={signOut} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 6 },
  label: { color: palette.muted, fontSize: 12, fontWeight: '600', marginTop: 8 },
  value: { color: palette.text, fontSize: 16 },
  signOut: { borderColor: palette.border, borderWidth: 1, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
  signOutText: { color: palette.error, fontSize: 16, fontWeight: '600' },
});