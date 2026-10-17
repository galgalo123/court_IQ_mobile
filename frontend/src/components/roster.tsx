import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';
import { positionLabel } from '@/features/profile';
import { getTeamMembersOnServer, type MemberResult } from '@/lib/api';

const ROLE_LABEL: Record<string, string> = {
  STATISTICIAN: 'Statistician',
  PLAYER: 'Player',
  COACH: 'Coach',
  MEDICAL: 'Medical',
};

// Loads the real team roster from the server.
export function Roster({ teamId }: { teamId?: string }) {
  const [members, setMembers] = useState<MemberResult[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) return;
    getTeamMembersOnServer(Number(teamId))
      .then(setMembers)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load the roster.'));
  }, [teamId]);

  if (!teamId) return <Text style={styles.muted}>No team yet.</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!members) return <Text style={styles.muted}>Loading the roster...</Text>;
  if (members.length === 0) {
    return <Text style={styles.muted}>Nobody has joined yet. Share the team code to add players and staff.</Text>;
  }

  return (
    <View style={styles.list}>
      {members.map((m) => (
        <View key={m.userId} style={styles.row}>
          <View style={styles.top}>
            <Text style={styles.name}>{m.name}</Text>
            {m.manager ? <Text style={styles.tag}>MANAGER</Text> : null}
          </View>
          <Text style={styles.meta}>
            {ROLE_LABEL[m.role] ?? m.role} · {positionLabel(m.position)}
          </Text>
          <Text style={styles.meta}>
            Height {m.height ?? '—'} · {m.gender === 'men' ? "Men's" : m.gender === 'women' ? "Women's" : '—'}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 14, padding: 14, gap: 4 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: palette.text, fontSize: 16, fontWeight: '700' },
  tag: { color: palette.text, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  meta: { color: palette.muted, fontSize: 13 },
  muted: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  error: { color: palette.error, fontSize: 14 },
});